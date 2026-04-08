import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register/', formData);
      alert('Account created, Log in.');
      navigate('/login');
    } catch (err) {
      // This will show you if it's a 400 (Validation Error), 403 (Permission), etc.
      console.error("Registration Error:", err.response?.data || err.message);
      const serverMsg = err.response?.data;
      
      // If the server sends back specific errors (like "username already exists")
      setError(typeof serverMsg === 'object' 
        ? Object.values(serverMsg).flat().join(' ') 
        : 'Failed to create account.');
    }
  };

  return (
        /* Outer container: Full screen, row layout */
        <div className="flex min-h-screen w-full bg-gray-900">
            
            {/* LEFT SIDE: Image/Branding (Hidden on mobile, takes 50% width on large screens) */}
            <div className="hidden lg:flex flex-col justify-center items-center lg:w-1/2 bg-blue-900 relative">
                {/* Fallback styling just in case the image fails to load */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                ></div>
                <div className="relative z-10 text-center px-12">
                    <h2 className="text-5xl font-extrabold text-white mb-6">EventHub</h2>
                    <p className="text-xl text-blue-200">The easiest way to manage your events and participants.</p>
                </div>
            </div>

            {/* RIGHT SIDE: The Form (Takes 100% width on mobile, 50% width on large screens) */}
             <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 sm:p-12 md:p-20 bg-white dark:bg-gray-800">

               

                {/* Form Container (Centered, max-width to prevent stretching) */}

                <div className="w-full max-w-md">

                    <div className="mb-8 text-center lg:text-left">

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>

                        <p className="text-gray-500 dark:text-gray-400">Enter your details to get started.</p>

                    </div>


                    {error && (

                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">

                            {error}

                        </div>

                    )}


                    <form onSubmit={handleSubmit} className="space-y-6">

                       

                        {/* Username Group */}

                        <div>

                            <label htmlFor="username" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                                Username

                            </label>

                            <input

                                id="username"

                                name="username"

                                type="text"

                                placeholder="john_doe"

                                onChange={handleChange}

                                className="block w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"

                                required

                            />

                        </div>


                        {/* Email Group */}

                        <div>

                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                                Email Address

                            </label>

                            <input

                                id="email"

                                name="email"

                                type="email"

                                placeholder="name@mail.com"

                                onChange={handleChange}

                                className="block w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"

                                required

                            />

                        </div>


                        {/* Password Group */}

                        <div>

                            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">

                                Password

                            </label>

                            <input

                                id="password"

                                name="password"

                                type="password"

                                placeholder="••••••••"

                                onChange={handleChange}

                                className="block w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"

                                required

                            />

                        </div>


                        {/* Submit Button */}

                        <button

                            type="submit"

                            className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all mt-2"

                        >

                            Sign Up

                        </button>

                    </form>



                    {/* Footer Link */}
                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;