import type { FigmaMessage } from "./messages";

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 500,
  height: 500,
});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-variable-collection") {
    const message = msg as Extract<
      FigmaMessage,
      { type: "create-variable-collection" }
    >;

    const collection = figma.variables.createVariableCollection(
      message.payload.collectionName ?? ""
    );

    const returnedMessage: Extract<
      FigmaMessage,
      { type: "return-collection-id" }
    > = {
      type: "return-collection-id",
      payload: {
        collectionId: collection.id,
        collectionModeId: collection.modes[0].modeId,
      },
    };

    figma.ui.postMessage(returnedMessage);
  }

  if (msg.type === "create-variable") {
    const message = msg as Extract<FigmaMessage, { type: "create-variable" }>;

    const payload = message.payload;

    let createdVariable = figma.variables.createVariable(
      payload.name,
      payload.collectionId,
      payload.type
    );

    const resolvedValue =
      payload.type === "COLOR"
        ? figma.util.rgba(payload.value as string)
        : payload.value;
    createdVariable.setValueForMode(
      message.payload.collectionModeId,
      resolvedValue
    );
  }

  if (msg.type === "notify-success") {
    figma.notify("Successfully imported the variables!");
  }

  if (msg.type === "notify-error") {
    const message = msg as Extract<FigmaMessage, { type: "notify-error" }>;
    figma.notify(
      message?.payload?.message
        ? message?.payload?.message
        : "Can't create variables! Unknown error",
      { error: true }
    );
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
