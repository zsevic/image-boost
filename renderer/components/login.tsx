import React from 'react';

const Login = (): React.JSX.Element => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png" // Replace with the path to your logo image
            alt="Image Boost Logo"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-2xl font-bold">Image Boost</h2>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="licenseKey"
              className="block text-gray-700 font-bold mb-2"
            >
              License key
            </label>
            <input
              type="password"
              id="licenseKey"
              name="licenseKey"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your license key"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
