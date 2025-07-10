import React from 'react';
import { FileText, Lock, Unlock, Wrench, Image, Combine, Split, Minimize2, Coffee, ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomeContent() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-blue-50 to-pink-100 px-4 py-10">

      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold mb-4 text-blue-800 flex items-center gap-2">
          <FileText className="inline-block text-yellow-500" size={32} />
          Welcome to Document Utility – Your All-in-One PDF Tool
        </h2>
        <p className="mb-4 text-gray-700 text-lg">
          Are you looking for a fast, secure, and easy way to manage your PDF documents online? Document Utility is your go-to solution for all your PDF needs. Our free web-based platform allows you to merge, split, compress, lock, unlock, and convert PDF files with just a few clicks. Whether you are a student, professional, or anyone who works with digital documents, our tool is designed to save you time and effort.
        </p>
        <h3 className="text-2xl font-semibold mb-3 text-blue-700 flex items-center gap-2">
          <Wrench className="text-blue-400" size={24} /> Key Features
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <li className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3 shadow-sm">
            <Combine className="text-indigo-500 mt-1" size={28} />
            <span><b>Merge PDFs:</b> Combine multiple PDF files into a single document effortlessly. Perfect for organizing reports, assignments, or business documents.</span>
          </li>
          <li className="flex items-start gap-3 bg-pink-50 rounded-lg p-3 shadow-sm">
            <Split className="text-pink-500 mt-1" size={28} />
            <span><b>Split PDFs:</b> Extract specific pages or split large PDFs into smaller, more manageable files.</span>
          </li>
          <li className="flex items-start gap-3 bg-red-50 rounded-lg p-3 shadow-sm">
            <Minimize2 className="text-red-500 mt-1" size={28} />
            <span><b>Compress PDFs:</b> Reduce the file size of your PDFs without compromising quality, making them easier to share via email or upload online.</span>
          </li>
          <li className="flex items-start gap-3 bg-green-50 rounded-lg p-3 shadow-sm">
            <Lock className="text-blue-600 mt-1" size={28} />
            <span><b>Lock PDFs:</b> Secure your sensitive documents with password protection.</span>
          </li>
          <li className="flex items-start gap-3 bg-purple-50 rounded-lg p-3 shadow-sm">
            <Unlock className="text-green-600 mt-1" size={28} />
            <span><b>Unlock PDFs:</b> Remove passwords from PDFs you own.</span>
          </li>
          <li className="flex items-start gap-3 bg-lime-50 rounded-lg p-3 shadow-sm">
            <Image className="text-lime-600 mt-1" size={28} />
            <span><b>PDF to Image:</b> Convert your PDF files to high-quality images for use in presentations or digital archiving.</span>
          </li>
          <li className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 shadow-sm">
            <FileText className="text-yellow-600 mt-1" size={28} />
            <span><b>PDF to Base64:</b> Convert your PDF files to Base64 format for use in web development or digital archiving.</span>
          </li>
          <li className="flex items-start gap-3 bg-blue-50 rounded-lg p-3 shadow-sm">
            <FileText className="text-blue-600 mt-1" size={28} />
            <span><b>Base64 to PDF:</b> Easily convert Base64-encoded data back into a PDF file.</span>
          </li>
        </ul>
        <p className="mb-4 text-gray-700 text-lg">
          Our platform is completely free to use, with no registration required. We prioritize your privacy—your files are never stored on our servers, and all processing happens securely in your browser. Document Utility is mobile-friendly and works seamlessly on any device.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="text-yellow-600" size={24} />
          <span className="text-gray-700 text-lg">Start using Document Utility today and experience the easiest way to handle your PDF documents online. If you find our tool helpful, consider supporting us by buying a coffee!</span>
        </div>
      </div>
      <button
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition font-semibold text-lg mt-2"
      >
        <ArrowLeftCircle size={22} /> Back to Home
      </button>
    </div>
  );
} 