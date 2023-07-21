import '../styles/globals.css';

import { type AppProps } from 'next/app';
import React from 'react';

// eslint-disable-next-line
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
