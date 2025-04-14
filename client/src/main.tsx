import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Check if the user prefers dark mode
const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply dark mode class if needed
if (isDarkMode) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
