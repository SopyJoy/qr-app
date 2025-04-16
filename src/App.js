import React, { useState } from "react";
import QrScanner from "./Components/QrScanner";
import QrScannerCamera from "./Components/QrScannerCamera";
import QrCodeGenerator from "./Components/QrCodeGenerator";

function App() {
  const [view, setView] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-indigo-200 flex flex-col items-center justify-center relative px-4">
      {!view && (
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center transition-all duration-300">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            QR Code App
          </h1>
          <p className="text-gray-500 mb-8 text-base">
            Scan and generate QR codes easily with just one click.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setView("scanner")}
              className="w-full py-3 px-6 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition duration-300"
            >
              Scan QR (Upload)
            </button>

            <button
              onClick={() => setView("camera")}
              className="w-full py-3 px-6 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition duration-300"
            >
              Scan QR (Camera)
            </button>

            <button
              onClick={() => setView("generator")}
              className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-300"
            >
              Generate QR Code
            </button>
          </div>
        </div>
      )}

      {/* Render View Based on Selection */}
      <div className="w-full max-w-3xl mt-4">
        {view === "scanner" && <QrScanner />}
        {view === "camera" && <QrScannerCamera />}
        {view === "generator" && <QrCodeGenerator />}
      </div>

      {/* Back Button */}
      {view && (
        <button
          onClick={() => setView(null)}
          className="fixed top-6 left-6 text-sm bg-gray-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 transition"
        >
          ← Back to Home
        </button>
      )}
    </div>
  );
}

export default App;
