import React, { useEffect, useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { getFormattedConfig } from "@suvarman/core";
import { FigmaMessage } from "../messages";
import { processConfigFSM } from "./processConfig.fsm";
import { useMachine } from "@xstate/react";
import { HiOutlineCog } from "react-icons/hi";
import { SuvarmanLogo } from "./SuvarmanLogo";

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
    <div className="p-4">
      <div className="w-full flex flex-col items-center mb-5">
        {/* <HiOutlineCog size={50} className="animate-spin" /> */}
        <SuvarmanLogo size={50} />
        <h1 className="text-xl">Suvarman</h1>
        <h1 className="text-md text-gray-400">Super Variables Manager</h1>
      </div>

      <div className="col-span-full">
        <p className="block text-sm font-medium leading-6 text-gray-900">
          Config file
        </p>

        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <div className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
              {file?.name ?? "Select file"}
            </div>
          </div>
        </div>
        <div className="my-2 w-full justify-end flex">
          <label
            htmlFor="file-selector"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 text-sm"
          >
            <span>Select config file (.json)</span>
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

      <div className="mt-6 w-full flex justify-end">
        <button
          onClick={onCreateVariables}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create Variable
        </button>
      </div>
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-page")!;
  const root = createRoot(container);
  root.render(<App />);
});
