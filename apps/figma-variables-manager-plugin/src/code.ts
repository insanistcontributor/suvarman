import type { FigmaMessage } from "./messages";

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  console.log("msg", msg);
  if (msg.type === "create-rectangles") {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === "create-variable-collection") {
    const message = msg as Extract<
      FigmaMessage,
      { type: "create-variable-collection" }
    >;

    const collection = figma.variables.createVariableCollection(
      message.payload.collectionName ?? ""
    );

    // collection.addMode("default");

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

    console.log("message", msg);
    // message.payload.variables.forEach((variable) => {
    //   console.log("variable", variable);
    //   let createdVariable = figma.variables.createVariable(
    //     variable.name,
    //     collection.id,
    //     variable.type
    //   );

    //   createdVariable.setValueForMode(
    //     collection.modes[0].modeId,
    //     variable.value
    //   );
    // });

    // const createdVars = [];
    // for (const v in message.payload.variables) {
    //   console.log("v", v);
    //   const variable = message.payload.variables[v];
    //   let createdVariable = figma.variables.createVariable(
    //     variable.name,
    //     collection.id,
    //     variable.type
    //   );
    //   createdVars.push(createdVariable);

    //   // await createdVariable.setValueForMode(
    //   //   collection.modes[0].modeId,
    //   //   variable.value
    //   // );
    // }

    // console.log("createdVars", createdVars);
    // createdVars.forEach(async (variable, idx) => {
    //   variable.setValueForMode(
    //     collection.modes[0].modeId,
    //     message.payload.variables[idx].value
    //   );
    // });
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

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
