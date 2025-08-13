import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Copy } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function PdfToBase64() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBase64('');
    setCopied(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/doc-service/pdf-to-base64`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to convert PDF to Base64';
        try {
          const data = await response.json();
          if (data && data.error) {
            errorMsg = data.error;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setBase64(data.base64 || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (base64) {
      navigator.clipboard.writeText(base64);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2 sm:px-6 py-6">
      {/* Home button in top left */}
      <button
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Home size={20} />
        <span className="hidden sm:inline">Home</span>
      </button>
      <h2 className="text-2xl font-bold mb-4">PDF to Base64</h2>
      <form
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 tall-or-wide:grid-cols-1"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm font-medium">Select PDF File</label>
        <input
          type="file"
          accept="application/pdf"
          required
          className="border rounded px-3 py-2"
          onChange={e => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? 'Converting...' : 'Convert to Base64'}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {base64 && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Base64 Output</label>
            <textarea
              className="border rounded px-3 py-2 w-full h-40 resize-y text-xs font-mono"
              value={base64}
              readOnly
            />
            <button
              type="button"
              onClick={handleCopy}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
