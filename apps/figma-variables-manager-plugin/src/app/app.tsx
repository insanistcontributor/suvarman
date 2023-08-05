import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { getFormattedConfig } from "@fvm/core";
import type { VariablesConfig } from "@fvm/core";
import { FigmaMessage } from "../messages";
// TODO:
// 1. Create collection
// 2. Create Variable

function App() {
  const testSend = () => {
    console.log("Test send");
    console.log("parent", parent);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count: 2 } },
      "*"
    );
  };

  const [collectionName, setCollectionName] = useState("");
  const [config, setConfig] = useState<VariablesConfig | null>(null);

  const onReadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = document.getElementById("file-selector") as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processConfig(text);
      };
      reader.readAsText(input.files[0]);
    }
  };

  const processConfig = async (configString: string) => {
    getFormattedConfig(configString)
      .then((config) => {
        setConfig(config);
      })
      .catch((err) => {
        alert("Error parsing config file");
      });
  };

  const onCreateVariables = () => {
    const createCollectionMessage: FigmaMessage = {
      type: "create-variable-collection",
      payload: {
        collectionName: config?.collectionName || "Default collection name",
      },
    };

    parent.postMessage({ pluginMessage: createCollectionMessage }, "*");
  };

  return (
    <div className="bg-red-100">
      <h1 className="heading">This is app</h1>
      <input type="text" onChange={(e) => setCollectionName(e.target.value)} />
      <button onClick={onCreateVariables}>Create collection</button>

      <input
        id="file-selector"
        type="file"
        multiple={false}
        accept=".json"
        onChange={(e) => onReadFile(e)}
      />
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-page")!;
  const root = createRoot(container);
  root.render(<App />);
});
