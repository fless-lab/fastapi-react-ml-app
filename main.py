from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel
from passlib.context import CryptContext
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import numpy as np

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base = declarative_base()
engine = create_engine("sqlite:///users.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
PASSWORD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))

Base.metadata.create_all(bind=engine)

class UserCreate(BaseModel):
    fullname: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SurvieEntre(BaseModel):
    age: int
    sex: int
    pclass: int

class SurvieSortie(BaseModel):
    survived: str

class PoidEntre(BaseModel):
    taille: float

class PoidSortie(BaseModel):
    prediction: float

@app.post("/api/register")
def register(user: UserCreate):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Un utilisateur existe déjà avec cette même adresse mail")

    hashed_password = PASSWORD_CONTEXT.hash(user.password)
    db_user = User(fullname=user.fullname, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token({"email": user.email}, expires_delta=timedelta(days=1))
    return {"message": "Utilisateur enregistré avec succès !", "access_token": token}

@app.post("/api/login")
def login(user: UserLogin):
    db_user = db.query(User).filter(User.email == user.email).first()
    print(db_user)
    if not db_user or not PASSWORD_CONTEXT.verify(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nom d'utilisateur ou mot de passe incorrect")

    token = create_access_token({"email": user.email}, expires_delta=timedelta(days=1))
    return {"message": "Utilisateur connecté avec succès !", "access_token": token}

SECRET_KEY = "raouf-secret-key"
bearer_scheme = HTTPBearer()
token_blacklist = set()

@app.post("/api/logout")
def logout(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    token_blacklist.add(token.credentials)

    return {"message": "Utilisateur déconnecté avec succès !"}


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@app.get("/api")
def public_route():
    return {"message": "Hey, welcome to Raouf's API. This route is not protected"}

@app.get("/api/profile")
def profile(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    if token.credentials in token_blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Le token a été révoqué ou blacklisté")

    email = payload.get("email")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")

    return {"fullname": user.fullname, "email": user.email}


model_survie = load('titanic.joblib')
model_poid = load('taille.joblib')

@app.post("/api/survivor", tags=["Titanic survivor"])
def predict_survivor(data: SurvieEntre, token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    if token.credentials in token_blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Le token a été révoqué ou blacklisté")

    new_data = [[data.age, data.sex, data.pclass]]
    prediction = int(model_survie.predict(new_data)[0])
    survived = "Désolé ! Ce passager est mort." if prediction == 0 else "Bonne nouvelle ! Ce passager est en vie."

    return {"survived": survived, "prediction": prediction}

@app.post("/api/weight", tags=["Weight prediction"])
def predict_weight(data: PoidEntre, token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    if token.credentials in token_blacklist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Le token a été révoqué ou blacklisté")

    # Convertir la taille de mètres à inches
    taille_inch = data.taille * 39.37
    prediction_pound = model_poid.predict([[taille_inch]])
    prediction_kg = np.round(prediction_pound * 0.45359237, 2)  # Conversion en kg avec deux décimales

    output_data = PoidSortie(prediction=prediction_kg)

    return output_data