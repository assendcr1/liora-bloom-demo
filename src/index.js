import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app-logic/App'; // This points to the new folder safe from CLI interference

// Create the root element by targeting the 'root' ID in your public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component within StrictMode for better development debugging
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);