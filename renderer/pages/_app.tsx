import '../styles/globals.css';

import { Provider } from 'jotai';
import { type AppProps } from 'next/app';
import React from 'react';

// eslint-disable-next-line
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
