import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';
import { emailAtom, isLoggedInAtom, licenseKeyAtom } from '../atoms/login-atom';
import request from '../utils/request';

const Login = (): React.JSX.Element => {
  const [email, setEmail] = useAtom(emailAtom);
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom);
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);

  // eslint-disable-next-line
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await request.post('/licenses/verify/login', {
        email,
        licenseKey,
      });
      setIsLoggedIn(true);
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        alert('Login failed, please check your internet connection');
        setIsLoggedIn(false);
        return;
      }

      if (error?.code === 'ERR_NETWORK') {
        alert('Login failed, please try again later');
        setIsLoggedIn(false);
        return;
      }

      if (error?.response?.status === 401) {
        alert('Login failed, please try again');
        setIsLoggedIn(false);
        return;
      }

      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="logo.png"
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
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
              required
              onChange={(e) => {
                setLicenseKey(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            // eslint-disable-next-line
            onClick={handleLogin}
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
