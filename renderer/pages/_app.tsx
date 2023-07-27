import '../styles/globals.css';

import { Provider } from 'jotai';
import { type AppProps } from 'next/app';
import React from 'react';

export default function MyApp({
  Component,
  pageProps,
}: AppProps): React.JSX.Element {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
