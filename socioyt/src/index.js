import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const Clerk_api_key =
  "pk_test_c3Ryb25nLXBhbmdvbGluLTk3LmNsZXJrLmFjY291bnRzLmRldiQ";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={Clerk_api_key} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
