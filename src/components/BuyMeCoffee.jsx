import { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { fetchGatewayKey, getApiKey, createOrder } from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL;

export default function BuyMeCoffee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [gatewayKey, setGatewayKey] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const cachedKey = sessionStorage.getItem('AES_KEY');
    const cachedId = sessionStorage.getItem('KEY_ID');
    if (cachedKey && cachedId) {
      setGatewayKey({ sKey: cachedKey, sId: cachedId });
    } else {
      fetchGatewayKey()
        .then(data => {
          setGatewayKey(data);
          sessionStorage.setItem('AES_KEY', data.sKey);
          sessionStorage.setItem('KEY_ID', data.sId);
        })
        .catch(() => {});
    }
  }, []);

  // Amount mapping for display
  const amountMap = {
    '2': { display: '☕ 1 Coffee - ₹50', value: 50 },
    '5': { display: '☕☕ 2 Coffees - ₹100', value: 100 },
    '10': { display: '☕☕☕ 3 Coffees - ₹150', value: 150 },
    '20': { display: '☕☕☕☕ 4 Coffees - ₹200', value: 200 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const apiKey = await getApiKey();
      console.log(apiKey);
      setApiKey(apiKey);

      // Create order on your backend
      const response = await createOrder(name, email, amountMap[amount].value, 'INR');
      
      if (!response.ok) {
        let errorMsg = 'Failed to create order';
        try {
          const data = await response.json();
          if (data && data.error) errorMsg = data.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      
      const orderData = await response.json();
      
      // Initialize Razorpay
      const options = {
        key: apiKey, // Replace with your actual Razorpay Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Document Utility',
        description: `Support - ${amountMap[amount].display}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${API_URL}/doc-service/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                name,
                email,
                amount: amountMap[amount].value
              }),
            });
            
            if (verifyResponse.ok) {
              setSuccess(true);
              setName('');
              setEmail('');
              setAmount('5');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: '#F59E0B'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
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
          <div className="text-green-700 font-semibold text-center mb-4">
            Thank you for your support! Your donation was received successfully.
          </div>
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
              {loading ? 'Processing...' : `Buy me a coffee - ₹${amountMap[amount].value}`}
            </button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
} 