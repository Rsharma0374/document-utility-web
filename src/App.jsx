import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { FileText, Lock, Unlock, Wrench } from 'lucide-react';
import './App.css';
import './index.css';
import { useCallback } from 'react';
import PdfLock from './components/PdfLock';
import PdfUnlock from './components/PdfUnlock';
import Base64ToPdf from './components/Base64ToPdf';
import PdfToBase64 from './components/PdfToBase64';
import CompressPdf from './components/CompressPdf';
import MergePdf from './components/MergePdf';

function MainGrid() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2 sm:px-6 py-6">
      {/* Doc Utility Icon */}
      <div className="mb-6 flex items-center justify-center">
        <span className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 shadow">
          <FileText size={32} className="text-blue-600" />
          <Wrench size={20} className="text-blue-400 -ml-2" />
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-10">Document Utility</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 tall-or-wide:grid-cols-1 gap-8 w-full max-w-4xl">
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 sm:p-10 flex flex-col items-center hover:bg-blue-50 transition min-h-[200px]"
          onClick={() => navigate('/lock')}
        >
          <Lock size={56} className="mb-4 text-blue-600" />
          <span className="text-xl font-semibold">Lock PDF</span>
        </div>
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 sm:p-10 flex flex-col items-center hover:bg-green-50 transition min-h-[200px]"
          onClick={() => navigate('/unlock')}
        >
          <Unlock size={56} className="mb-4 text-green-600" />
          <span className="text-xl font-semibold">Unlock PDF</span>
        </div>
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 sm:p-10 flex flex-col items-center hover:bg-yellow-50 transition min-h-[200px]"
          onClick={() => navigate('/base64-to-pdf')}
        >
          <FileText size={56} className="mb-4 text-yellow-600" />
          <span className="text-xl font-semibold">Base64 to PDF</span>
        </div>
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 sm:p-10 flex flex-col items-center hover:bg-purple-50 transition min-h-[200px]"
          onClick={() => navigate('/pdf-to-base64')}
        >
          <FileText size={56} className="mb-4 text-purple-600" />
          <span className="text-xl font-semibold">PDF to Base64</span>
        </div>
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 sm:p-10 flex flex-col items-center hover:bg-red-50 transition min-h-[200px]"
          onClick={() => navigate('/compress-pdf')}
        >
          <FileText size={56} className="mb-4 text-red-600" />
          <span className="text-xl font-semibold">Compress PDF</span>
        </div>
        <div
          className="cursor-pointer bg-white rounded-lg shadow-md p-8 sm:p-10 flex flex-col items-center hover:bg-indigo-50 transition min-h-[200px]"
          onClick={() => navigate('/merge-pdf')}
        >
          <FileText size={56} className="mb-4 text-indigo-600" />
          <span className="text-xl font-semibold">Merge PDFs</span>
        </div>
      </div>
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
        <Route path="/base64-to-pdf" element={<Base64ToPdf />} />
        <Route path="/pdf-to-base64" element={<PdfToBase64 />} />
        <Route path="/compress-pdf" element={<CompressPdf />} />
        <Route path="/merge-pdf" element={<MergePdf />} />
      </Routes>
    </Router>
  );
}

export default App;
