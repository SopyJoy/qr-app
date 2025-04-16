import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

export default function QRCodeScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanInterval = useRef(null);

  const [scannedResult, setScannedResult] = useState('');
  const [cameraStarted, setCameraStarted] = useState(false);
  const [error, setError] = useState('');

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        streamRef.current = stream;
        await video.play();
        setCameraStarted(true);
        startScanning();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow access to your camera.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please ensure your device has a camera.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another app. Please close other apps using the camera.');
      } else {
        setError('Unable to access camera. Please try again.');
      }
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (scanInterval.current) clearInterval(scanInterval.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStarted(false);
  };

  // Function to start scanning for QR codes
  const startScanning = () => {
    scanInterval.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        setScannedResult(code.data);
        stopCamera();
      }
    }, 500);
  };

  // Reset scanner state
  const resetScanner = () => {
    setScannedResult('');
    setError('');
    startCamera();
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>

      <div className="relative w-full bg-gray-200 rounded-lg mb-4 overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && (
        <div className="w-full mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {scannedResult && (
        <div className="w-full mb-4">
          <h2 className="text-lg font-semibold mb-2">Scanned Result:</h2>
          <div className="p-3 bg-green-100 text-green-800 rounded-md break-words">
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

      <div className="grid gap-3 w-full">
        {!cameraStarted && !scannedResult && (
          <button
            onClick={startCamera}
            className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
          >
            Start Camera
          </button>
        )}

        {scannedResult && (
          <button
            onClick={resetScanner}
            className="bg-gray-700 text-white py-3 px-4 rounded-md hover:bg-gray-800 font-medium"
          >
            Scan Again
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Click "Start Camera" and point it at a QR code to scan.
      </p>
    </div>
  );
}
