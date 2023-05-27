import React, { useState, useRef } from 'react';
import Header from './components/Header';

function ImageCropper() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const canvasRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));

    // Get the dimensions of the selected image
    const img = new Image();
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height
      };
      setImageDimensions(dimensions);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleProceed = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.onload = () => {
      const { width, height } = image;
      const size = Math.min(width, height);
      const x = (width - size) / 2;
      const y = (height - size) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, size, size, 0, 0, 500, 500);
      showMessage();
    };
    image.src = selectedImage;
  };

  const showMessage = () => {
    setTimeout(() => {
      alert('Image cropped successfully!');
    }, 1500);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'cropped_image.png';
    link.click();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageDimensions(null);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <Header />
      <div className="centered-form">
        <h1>Image Cropper</h1>
        <form className="ui form">
          <div className="field" style={{ width: '40%', margin: 'auto' }}>
            <label>Choose an image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </div>
          
          <button
            className="ui green button"
            type="button"
            style={{ marginTop: '1rem' }}
            onClick={handleProceed}
            disabled={!selectedImage}
          >
            Cliquez pour procéder
          </button>
          {selectedImage && (
            <button
              className="ui red button"
              type="button"
              style={{ marginTop: '1rem', marginLeft: '1rem' }}
              onClick={handleReset}
            >
              Reset
            </button>
          )}
        </form>
        {selectedImage && (
          <div className="cropped-image">
            <h6>Cropped Image (500x500):</h6>
            <canvas ref={canvasRef} width={500} height={500} style={{ border: '1px solid #ccc' }} /> <br />
            <button
              className="ui primary button"
              type="button"
              style={{ marginTop: '1rem' }}
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        )}

        <hr />

        {imageDimensions && (
          <div className="preview">
            <h6>Selected Image Dimensions:</h6>
            <p>Width: {imageDimensions.width}px</p>
            <p>Height: {imageDimensions.height}px</p>
            <img src={selectedImage} alt="Selected" style={{ border: '1px solid #ccc' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCropper;
