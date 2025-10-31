import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { register, unregister } from "./serviceWorkerRegistration.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
// In development we should not register the service worker because it can
// interfere with Vite's dev server (returning cached HTML for module imports).
if (import.meta.env && import.meta.env.PROD) {
  register();
} else {
  // If a SW was previously registered (from a production build), unregister
  // it when running in dev so module requests aren't served as HTML.
  unregister();
}
