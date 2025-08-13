import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('0.5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setDownloadUrl(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality);
      const response = await fetch(`${API_URL}/doc-service/pdf/compress`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to compress PDF';
        try {
          const data = await response.json();
          if (data && data.error) {
            errorMsg = data.error;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      let filename = 'compressed.pdf';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      setDownloadUrl({ url, filename });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold mb-4">Compress PDF</h2>
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
        <label className="block text-sm font-medium">Quality</label>
        <select
          className="border rounded px-3 py-2"
          value={quality}
          onChange={e => setQuality(e.target.value)}
          required
        >
          {Array.from({ length: 9 }, (_, i) => (0.1 * (i + 1)).toFixed(1)).map(q => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? 'Compressing...' : 'Compress PDF'}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && downloadUrl && (
          <a
            href={downloadUrl.url}
            download={downloadUrl.filename}
            className="block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            Download Compressed PDF
          </a>
        )}
      </form>
    </div>
  );
}
