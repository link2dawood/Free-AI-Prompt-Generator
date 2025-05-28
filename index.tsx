
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Tailwind styles are included via CDN in index.html
// Global styles or overrides could be imported here if not using Tailwind exclusively.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
