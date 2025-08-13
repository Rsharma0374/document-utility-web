import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function MergePdf() {
  const [files, setFiles] = useState([]);
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
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      const response = await fetch(`${API_URL}/doc-service/pdf/merge`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to merge PDFs';
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
      let filename = 'merged.pdf';
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
      <h2 className="text-2xl font-bold mb-4">Merge PDFs</h2>
      <form
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 tall-or-wide:grid-cols-1"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm font-medium">Select PDF Files (2 or more)</label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          className="border rounded px-3 py-2"
          onChange={e => {
            const newFiles = Array.from(e.target.files);
            setFiles(prevFiles => {
              // Prevent duplicates by name and size
              const allFiles = [...prevFiles, ...newFiles];
              const uniqueFiles = [];
              const seen = new Set();
              for (const file of allFiles) {
                const key = file.name + file.size;
                if (!seen.has(key)) {
                  seen.add(key);
                  uniqueFiles.push(file);
                }
              }
              return uniqueFiles;
            });
            // Reset input value so the same file can be selected again if needed
            e.target.value = '';
          }}
        />
        {files.length > 0 && (
          <ul className="mt-2 mb-2 space-y-1">
            {files.map((file, idx) => (
              <li key={file.name + file.size} className="flex items-center justify-between bg-gray-100 rounded px-2 py-1 text-xs">
                <span className="truncate max-w-[180px]" title={file.name}>{file.name} ({(file.size/1024).toFixed(1)} KB)</span>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700 font-bold px-2"
                  onClick={() => setFiles(files => files.filter((_, i) => i !== idx))}
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || files.length < 2}
        >
          {loading ? 'Merging...' : 'Merge PDFs'}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && downloadUrl && (
          <a
            href={downloadUrl.url}
            download={downloadUrl.filename}
            className="block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            Download Merged PDF
          </a>
        )}
      </form>
    </div>
  );
}
