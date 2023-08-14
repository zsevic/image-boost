'use client';

import '../styles/globals.css';
import { Provider } from 'jotai';
import React from 'react';
import ReactGA4 from 'react-ga4';
import { Environment } from '../common/enums/environment';
import { ANALYTICS_ID } from '../constants/config';
import { isEnvironment } from '../utils';

if (!isEnvironment(Environment.Development)) {
  ReactGA4.initialize(ANALYTICS_ID);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
