import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Image } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const FORMATS = ["PNG", "JPEG", "JPG", "GIF", "BMP"];

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('PNG');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setDownloadUrl(null);
    setDownloadName('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      const response = await fetch(`${API_URL}/doc-service/pdf/to-images`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to convert PDF to images';
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
      let filename = 'images.zip';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      setDownloadUrl(url);
      setDownloadName(filename);
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
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Home size={20} />
        <span className="hidden sm:inline">Home</span>
      </button>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Image className="inline-block" size={28}/> PDF to Images</h2>
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
        <label className="block text-sm font-medium">Image Format</label>
        <select
          className="border rounded px-3 py-2"
          value={format}
          onChange={e => setFormat(e.target.value)}
          required
        >
          {FORMATS.map(fmt => (
            <option key={fmt} value={fmt}>{fmt}</option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? 'Converting...' : 'Convert to Images'}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadName}
            className="block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            Download Images
          </a>
        )}
      </form>
      <div className="text-xs text-gray-600 bg-gray-100 rounded p-2 mt-4 max-w-md">
        <strong>Note:</strong> Each page of the PDF will be converted to an image in the selected format. If there are multiple pages, you will get a ZIP file containing all images.
      </div>
    </div>
  );
}
