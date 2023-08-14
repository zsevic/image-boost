import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useState } from 'react';
import { emailAtom, isLoggedInAtom, licenseKeyAtom } from '../atoms/login-atom';
import request from '../utils/request';

const Login = (): React.JSX.Element => {
  const [email, setEmail] = useAtom(emailAtom);
  const [licenseKey, setLicenseKey] = useAtom(licenseKeyAtom);
  const [, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await request.post('/licenses/verify/login', {
        email,
        licenseKey,
      });
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      if (error?.code === 'NETWORK_ERROR') {
        alert('Login failed, please check your internet connection');
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      if (error?.code === 'ERR_NETWORK') {
        alert('Login failed, please try again later');
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      if (error?.response?.status === 401) {
        alert('Login failed, please try again');
        setIsLoggedIn(false);
        setIsLoading(false);
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
            width={16}
            height={16}
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
            disabled={isLoading}
            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none disabled:bg-blue-500"
          >
            {isLoading && (
              <svg
                aria-hidden="true"
                className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
