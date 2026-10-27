import { createRoot } from "react-dom/client";
import App from "./App";

// Mounts the app into the #root element in index.html.
createRoot(document.getElementById("root")!).render(<App />);
