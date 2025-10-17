import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Tailwind CSS import if needed
import { StrictMode } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AlertProvider } from './contexts/AlertContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
   </StrictMode>
 
);
