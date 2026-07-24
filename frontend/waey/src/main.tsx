import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "@/lib/swRegister";

registerSW();

createRoot(document.getElementById("root")!).render(<App />);
