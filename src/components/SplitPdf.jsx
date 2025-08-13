import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [rangeError, setRangeError] = useState('');
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
      formData.append('pages', pages);
      const response = await fetch(`${API_URL}/doc-service/pdf/split`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to split PDF';
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
      let filename = 'split.pdf';
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

  const validateRanges = (input) => {
    // Accepts: 1-5,1,3,5,2-4, etc.
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start >= end) {
          return 'For ranges like x-y, x should be less than y.';
        }
      } else {
        const num = Number(part);
        if (isNaN(num) || num < 1) {
          return 'Pages must be positive numbers.';
        }
      }
    }
    return '';
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
      <h2 className="text-2xl font-bold mb-4">Split PDF</h2>
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
        <label className="block text-sm font-medium">Pages to Extract</label>
        <input
          type="text"
          required
          className="border rounded px-3 py-2"
          value={pages}
          onChange={e => {
            setPages(e.target.value);
            setRangeError(validateRanges(e.target.value));
          }}
          placeholder="e.g. 1-5 or 1,3,5"
        />
        {rangeError && <div className="text-red-600 text-xs mt-1">{rangeError}</div>}
        <div className="text-xs text-gray-600 bg-gray-100 rounded p-2">
          <strong>How to specify pages:</strong><br />
          <span className="block mt-1">- <b>1-5</b>: Extracts pages 1 to 5 (inclusive)</span>
          <span className="block">- <b>1,3,5</b>: Extracts only pages 1, 3, and 5</span>
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !file || !pages || !!rangeError}
        >
          {loading ? 'Splitting...' : 'Split PDF'}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && downloadUrl && (
          <a
            href={downloadUrl.url}
            download={downloadUrl.filename}
            className="block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            Download Split PDF
          </a>
        )}
      </form>
    </div>
  );
}
