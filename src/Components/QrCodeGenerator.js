import { useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [size, setSize] = useState(200);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(inputText, {
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrImageUrl(url);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col items-center bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">🎨 Custom QR Code Generator</h1>

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text or URL"
        className="p-3 mb-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        <div>
          <label className="text-sm font-medium block mb-1">QR Size (px)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="p-2 border rounded-md w-full"
            min={100}
            max={600}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Foreground Color</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-full h-10 rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Background Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={generateQRCode}
        className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition mb-6 font-medium"
      >
        Generate QR Code
      </button>

      {qrImageUrl && (
        <div className="text-center">
          <img src={qrImageUrl} alt="Generated QR Code" className="mx-auto mb-4 rounded-lg shadow" />
          <a
            href={qrImageUrl}
            download="custom-qr-code.png"
            className="text-blue-600 underline text-sm"
          >
            ⬇️ Download QR Code
          </a>
        </div>
      )}
    </div>
  );
}
