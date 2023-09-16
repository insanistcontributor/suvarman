// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions:
      | "onCreateCollection"
      | "onCreateVariables"
      | "onNotifyError"
      | "onNotifySuccess";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignCollectionIdToContext: "ON_FINISH_CREATE_COLLECTION";
    assignConfigToContext: "ON_READ_CONFIG";
    onCreateCollection: "ON_CREATE_COLLECTION";
    onCreateVariables: "ON_FINISH_CREATE_COLLECTION";
    onNotifyError: "ON_ERROR";
    onNotifySuccess: "";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "Creating collection"
    | "Creating variables"
    | "Idle"
    | "Notify success";
  tags: never;
}
