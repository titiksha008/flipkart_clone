import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4">
      <div className="flex w-full max-w-3xl shadow-lg rounded-sm overflow-hidden">
        <div className="bg-[#2874f0] text-white p-10 w-5/12 hidden md:flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">Start Shopping</h1>
            <p className="text-blue-200 text-sm leading-relaxed">
              Signup is disabled in this demo version. The app already uses a default user.
            </p>
          </div>
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.svg"
            alt="Flipkart illustration"
            className="w-40"
          />
        </div>

        <div className="bg-white flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">No signup required</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            This assignment version does not require account creation. You can directly use the store
            with the default seeded user for cart, wishlist, profile, and orders.
          </p>

          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-[#fb641b] text-white py-3 font-bold rounded-sm hover:bg-[#f05b10]"
          >
            CONTINUE TO SHOPPING
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Go to{' '}
            <Link to="/" className="text-[#2874f0] font-semibold">
              Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}