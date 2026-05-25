import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import ThemeContextProvider from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </ThemeContextProvider>,
);
