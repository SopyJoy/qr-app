import { useState, useRef } from 'react';
import jsQR from 'jsqr';


export default function QRCodeReader() {
  const [scannedResult, setScannedResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection for QR code processing
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setScannedResult('');
    setIsProcessing(true);
    
    // Create an image preview
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    
    // Create an image element to load the file
    const img = new Image();
    img.onload = () => {
      try {
        processQRCodeImage(img);
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Make sure it contains a clear QR code.");
        setIsProcessing(false);
      }
      
      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);
    };
    
    img.onerror = () => {
      setError("Failed to load image. The file may be corrupted or not an image.");
      setIsProcessing(false);
      URL.revokeObjectURL(imageUrl);
    };
    
    img.src = imageUrl;
  };
  
  const processQRCodeImage = (img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
  
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
  
    if (code) {
      const scannedLink = code.data;
      setScannedResult(scannedLink);
      setIsProcessing(false);
      // ✅ No automatic redirect, just display the link
    } else {
      setError("No QR code found in the image.");
      setIsProcessing(false);
    }
  };
  

  // Clear current image and results
  const handleClear = () => {
    setScannedResult('');
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
      
      {/* Image preview area */}
      <div className="relative w-full mb-4 bg-gray-100 rounded-lg overflow-hidden" style={{aspectRatio: "1/1"}}>
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="QR Code"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-500 text-center p-4">
              Upload an image containing a QR code
            </span>
          </div>
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-pulse text-white font-bold">Processing...</div>
          </div>
        )}
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Error display */}
      {error && (
        <div className="w-full mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Results area */}
      {scannedResult && (
        <div className="w-full mb-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <div className="p-3 bg-green-100 text-green-800 rounded-md break-all">
            {scannedResult}
          </div>
          {scannedResult.startsWith('http') && (
            <a 
              href={scannedResult} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center mt-2 text-blue-600 underline"
            >
              Open Link
            </a>
          )}
        </div>
      )}
      
      {/* File input for image upload */}
      <div className="grid grid-cols-1 gap-3 w-full">
        <label className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-center cursor-pointer">
          Select QR Code Image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        
        {(imagePreview || scannedResult) && (
          <button
            onClick={handleClear}
            className="bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Instructions */}
      <p className="text-sm text-gray-600 mt-4 text-center">
        Take a photo of a QR code or upload an image containing a QR code.
        <br/>
        This method works on all browsers and devices.
      </p>
    </div>
  );
}