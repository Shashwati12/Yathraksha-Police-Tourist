import { useState } from 'react';
import { FaRegEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('user');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#CBEAF6] to-[#FFFFFF] font-serif p-4">
            <div className="w-full max-w-md p-6 sm:p-8 space-y-8 bg-[#008080] rounded-2xl shadow-lg">
            
                {/* Header */}
                <div className="text-center">
                    {/* Responsive font size */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Welcome Back!</h1>
                    <p className="text-gray-300 mt-2">Sign in as {activeTab}</p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    {/* Email/Username Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaRegEnvelope className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            defaultValue="Meena"
                            className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Username or Email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaLock className="text-gray-400" />
                        </span>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            defaultValue="password"
                            className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Password"
                        />
                    </div>

                    {/* Sign In Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#FF8045] hover:bg-[#FF7433] text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
                        >
                            Sign In
                        </button>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="w-full py-3 px-4 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                            Sign In with Google <FcGoogle className="text-2xl" />
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center text-gray-300">
                    <p>
                        Don't have an account?{' '}
                        <a href="#" className="font-semibold text-white hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;