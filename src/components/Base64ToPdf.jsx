import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Base64ToPdf() {
  const [base64, setBase64] = useState('');
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
      formData.append('base64', base64);
      const response = await fetch(`${API_URL}/doc-service/base64-to-pdf`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to convert Base64 to PDF';
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
      let filename = 'output.pdf';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative w-full">
      {/* Home button in top left */}
      <button
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Home size={20} />
        <span className="hidden sm:inline">Home</span>
      </button>
      <h2 className="text-2xl font-bold mb-4">Base64 to PDF</h2>
      <form
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm font-medium">Paste Base64 String</label>
        <textarea
          required
          className="border rounded px-3 py-2 h-32 resize-y"
          value={base64}
          onChange={e => setBase64(e.target.value)}
          placeholder="Paste your Base64 string here..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert to PDF'}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && downloadUrl && (
          <a
            href={downloadUrl.url}
            download={downloadUrl.filename}
            className="block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            Download PDF
          </a>
        )}
      </form>
    </div>
  );
}
