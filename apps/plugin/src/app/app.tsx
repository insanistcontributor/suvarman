import React, { useEffect, useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { getFormattedConfig } from "@suvarman/core";
import { FigmaMessage } from "../messages";
import { processConfigFSM } from "./processConfig.fsm";
import { useMachine } from "@xstate/react";
import { SuvarmanLogo } from "./SuvarmanLogo";
import { cn } from "../utils/cn";

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
      onNotifySuccess: () => {
        const message: FigmaMessage = {
          type: "notify-success",
        };
        parent.postMessage({ pluginMessage: message }, "*");
      },
      onNotifyError: (_, event) => {
        const message: FigmaMessage = {
          type: "notify-error",
        };
        parent.postMessage({ pluginMessage: message }, "*");
      },
    },
  });

  const [file, setFile] = useState<File | null>();

  const onReadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = document.getElementById("file-selector") as HTMLInputElement;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
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
        setFile(null);
        const message: FigmaMessage = {
          type: "notify-error",
          payload: {
            message: "Error parsing config file. Please recheck your config!",
          },
        };
        parent.postMessage({ pluginMessage: message }, "*");
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

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="p-4">
        <div className="w-full flex flex-col items-center mb-5">
          <SuvarmanLogo size={50} />
          <h1 className="text-xl">Suvarman</h1>
          <h1 className="text-md text-gray-400">Super Variables Manager</h1>
        </div>

        <div className="col-span-full">
          <p className="block text-sm font-medium leading-6 text-gray-900">
            Config file
          </p>

          <div className="mt-2">
            <div className="border border-gray-400 flex flex-row rounded-md shadow-sm sm:max-w-md items-center px-3">
              <div className="flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
                {file?.name ?? "Select file"}
              </div>

              <div className="my-2 justify-end flex">
                <label
                  htmlFor="file-selector"
                  className={cn(
                    "p-2 flex cursor-pointer rounded-md font-semibold text-white text-xs",
                    "bg-gray-800 hover:bg-gray-600 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 "
                  )}
                >
                  <span>Select config file</span>
                  <input
                    type="file"
                    className="sr-only"
                    id="file-selector"
                    multiple={false}
                    accept=".json"
                    onChange={(e) => onReadFile(e)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full flex justify-end">
          <button
            onClick={onCreateVariables}
            className={cn(
              "rounded-md bg-indigo-600 px-3 py-2 text-sm text-white",
              "flex cursor-pointer rounded-md font-semibold",
              "bg-gray-800 hover:bg-gray-600 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={file == null}
          >
            Create Variables
          </button>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-300 flex flex-row justify-between">
        <a
          href="https://ibedwi.notion.site/Suvarman-Docs-2647e1fafd404fcfa889baa6797fe38d"
          target="_blank"
          className="text-sm underline hover:opacity-80"
        >
          Read Docs
        </a>
        <a
          href="https://ibedwi.notion.site/Changelog-883550a93d35443f89e784e421b3d578"
          target="_blank"
          className="text-sm underline hover:opacity-80"
        >
          <span>v0.2.1</span>
        </a>
      </div>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-page")!;
  const root = createRoot(container);
  root.render(<App />);
});
