import React, { useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { getFormattedConfig } from "@fvm/core";
import { FigmaMessage } from "../messages";
import { processConfigFSM } from "./processConfig.fsm";
import { useMachine } from "@xstate/react";

function App() {
  const [machineState, machineSend] = useMachine(processConfigFSM, {
    actions: {
      onCreateCollection: (ctx) => {
        const createCollectionMessage: FigmaMessage = {
          type: "create-variable-collection",
          payload: {
            collectionName:
              ctx.config?.collectionName || "Default collection name",
          },
        };

        parent.postMessage({ pluginMessage: createCollectionMessage }, "*");
      },
      onCreateVariables: (ctx) => {
        if (ctx.config?.variables && ctx.collectionId != undefined) {
          ctx.config?.variables.forEach((variable) => {
            const message: FigmaMessage = {
              type: "create-variable",
              payload: {
                collectionId: ctx.collectionId as string,
                collectionModeId: ctx.collectionModeId as string,
                name: variable.name,
                value: variable.value,
                type: variable.type,
              },
            };
            parent.postMessage({ pluginMessage: message }, "*");
          });
        }
      },
    },
  });

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
        machineSend({ type: "ON_READ_CONFIG", payload: { config } });
      })
      .catch((err) => {
        alert("Error parsing config file");
      });
  };

  const onCreateVariables = () => {
    machineSend({ type: "ON_CREATE_COLLECTION" });
  };

  const figmaMessageListener = useCallback(
    (event: MessageEvent) => {
      const message = event.data.pluginMessage as FigmaMessage;

      if (message.type === "return-collection-id") {
        console.log("colection id", message.payload.collectionId);
        machineSend({
          type: "ON_FINISH_CREATE_COLLECTION",
          payload: {
            collectionId: message.payload.collectionId,
            collectionModeId: message.payload.collectionModeId,
          },
        });
      }
      if (
        message.type === "error-create-collection" ||
        message.type === "error-create-variable"
      ) {
        machineSend({
          type: "ON_ERROR",
        });
      }
    },
    [machineSend]
  );

  useEffect(() => {
    window.addEventListener("message", figmaMessageListener);
    return () => {
      window.removeEventListener("message", figmaMessageListener);
    };
  }, [figmaMessageListener]);

  useEffect(() => {
    console.log("machine state changed :: ", machineState.value);
  }, [machineState.value]);

  return (
    <div className="bg-red-100">
      <h1 className="heading">Convert JSON to Figma Variable</h1>
      <button onClick={onCreateVariables}>Create collection</button>

      <input
        id="file-selector"
        type="file"
        multiple={false}
        accept=".json"
        onChange={(e) => onReadFile(e)}
        onClick={() => console.log("asdf")}
      />
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-page")!;
  const root = createRoot(container);
  root.render(<App />);
});
