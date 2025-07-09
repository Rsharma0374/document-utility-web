import { useState } from 'react';
import { Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function BuyMeCoffee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('5');
  const [loading, setLoading] = useState(true); //to be changed to false
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const response = await fetch(`${API_URL}/doc-service/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, amount }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to process donation';
        try {
          const data = await response.json();
          if (data && data.error) errorMsg = data.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      setSuccess(true);
      setName('');
      setEmail('');
      setAmount('5');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-10">
      {/* Home button in top left */}
      <button
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Home size={20} />
        <span className="hidden sm:inline">Home</span>
      </button>
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <Coffee size={48} className="mb-4 text-yellow-600" />
        <h1 className="text-3xl font-bold mb-2 text-yellow-800">Support My Work</h1>
        <p className="text-gray-700 mb-6 text-center">
          If you find this tool helpful, you can support me by buying me a coffee! Your support helps me keep building and improving free tools like this.
        </p>
        {success ? (
          <div className="text-green-700 font-semibold text-center mb-4">Thank you for your support! Your donation was received.</div>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              className="border rounded px-3 py-2"
              placeholder="Your Name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              className="border rounded px-3 py-2"
              placeholder="Your Email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            >
              <option value="2">☕ 1 Coffee - ₹50</option>
              <option value="5">☕☕ 2 Coffees - ₹100</option>
              <option value="10">☕☕☕ 3 Coffees - ₹150</option>
              <option value="20">☕☕☕☕ 4 Coffees - ₹200</option>
            </select>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-yellow-400 text-brown-900 rounded-full shadow-lg hover:bg-yellow-300 transition font-semibold text-lg disabled:opacity-50"
              disabled={loading}
            >
              {/* {loading ? 'Processing...' : 'Buy me a coffee'} */}
              {!loading ? 'Processing...' : 'Coming Soon'}
            </button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
} 