import React, { useState } from 'react';
import mountainBg from '../assets/mountain.jpg'; 
import {
  FaRegEnvelope,
  FaLock,
  FaUser,
  FaBell,
  FaChevronDown,
} from 'react-icons/fa';
import { MdLanguage } from 'react-icons/md';

const LoginPage = () => {
  const [email, setEmail] = useState('officer@tourism.gov.in');
  const [password, setPassword] = useState('**********');
  const [role, setRole] = useState('Tourism Officer');

  const roles = ['Tourism Officer', 'Admin', 'Guide', 'Tourist'];

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password, role });
  };

  return (
    // Main container now holds the full-screen background
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `linear-gradient(to bottom, #EEF8FC, rgba(255,255,255,0.5)), url(${mountainBg})` }}
    >
      {/* Main content container */}
      <div className="w-full max-w-6xl mx-auto rounded-2xl  flex flex-col lg:flex-row overflow-hidden"> 
        
        {/* Left Section (Branding Info) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-10">
          <div className="max-w-md w-full">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-[#008080] w-16 h-16 flex items-center justify-center rounded-xl text-4xl font-bold text-white">
                  Y
                </div>
              </div>
              <h2 className="text-4xl text-black font-bold mt-4">Yatraksha</h2>
              <p className="text-xl text-gray-600 mt-2 mb-8">Tourism Organization Dashboard</p>

              <div className="space-y-4">
                <div className="flex items-center pl-20 p-4">
                  <FaUser className="text-5xl bg-[#BAF2C8] rounded-lg text-[#00BF96] mr-4 p-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-black text-lg">Tourist Management</h3>
                    <p className="text-sm text-gray-600 opacity-80">Verify IDs and manage tourist data</p>
                  </div>
                </div>
                <div className="flex items-start text-left pl-20  p-4 ">
                  <FaBell className="text-5xl bg-[#FFE785] rounded-lg text-[#DF2A2A] mr-4 p-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-black text-lg">Real-time Alerts</h3>
                    <p className="text-sm text-gray-600 opacity-80">Handle emergencies and anomalies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="w-full lg:w-1/2 flex rounded-2xl items-center justify-center p-10 bg-white">
          <div className="max-w-sm w-full">
            <div className="flex justify-end mb-6">
              <button className="flex items-center px-3 py-2 bg-[#008080] hover:bg-[#008F8F] rounded-lg text-white font-semibold text-sm">
                <MdLanguage className="mr-2 text-lg" /> EN
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center text-black">Login</h2>
              <p className="text-gray-600 text-center mt-1">Access your tourism dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-gray-500 text-sm font-semibold mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaRegEnvelope className="text-gray-400" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BF96]"
                    placeholder="officer@tourism.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-500 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-gray-400" />
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BF96]"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="role" className="block text-gray-500 text-sm font-semibold mb-2">
                  Select Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00BF96]"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaChevronDown className="text-gray-400" />
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#008080] hover:bg-[#008F8F] text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;