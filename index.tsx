
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Shim process.env for browser compatibility on static hosts like GitHub Pages
(window as any).process = { env: { ...(window as any).process?.env } };

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
