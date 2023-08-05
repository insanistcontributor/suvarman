import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="bg-red-100">
      <h1 className="heading">This is app</h1>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-page")!;
  const root = createRoot(container);
  root.render(<App />);
});
