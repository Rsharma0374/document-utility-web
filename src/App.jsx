import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { FileText, Lock, Unlock, Wrench } from 'lucide-react';
import './App.css';
import './index.css';
import { useCallback } from 'react';
import PdfLock from './components/PdfLock';
import PdfUnlock from './components/PdfUnlock';

function MainGrid() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Doc Utility Icon */}
      <div className="mb-4 flex items-center justify-center">
        <span className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 shadow">
          <FileText size={32} className="text-blue-600" />
          <Wrench size={20} className="text-blue-400 -ml-2" />
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-8">Document Utility</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl">
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:bg-blue-50 transition"
          onClick={() => navigate('/lock')}
        >
          <Lock size={48} className="mb-4 text-blue-600" />
          <span className="text-xl font-semibold">Lock PDF</span>
        </div>
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:bg-green-50 transition"
          onClick={() => navigate('/unlock')}
        >
          <Unlock size={48} className="mb-4 text-green-600" />
          <span className="text-xl font-semibold">Unlock PDF</span>
        </div>
      </div>
    </div>
  );
}

function LockPDF() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Lock PDF</h2>
      <p>Lock PDF functionality goes here.</p>
      <button
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
      >
        Home
      </button>
    </div>
  );
}

function UnlockPDF() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Unlock PDF</h2>
      <p>Unlock PDF functionality goes here.</p>
      <button
        className="mt-8 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        onClick={() => navigate('/')}
      >
        Home
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainGrid />} />
        <Route path="/lock" element={<PdfLock />} />
        <Route path="/unlock" element={<PdfUnlock />} />
      </Routes>
    </Router>
  );
}

export default App;
