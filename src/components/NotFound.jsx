import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-10">
      <h1 className="text-5xl font-bold text-yellow-800 mb-4">404</h1>
      <p className="text-gray-700 mb-6 text-center text-xl">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow font-semibold text-lg"
      >
        Return Home
      </button>
    </div>
  );
}