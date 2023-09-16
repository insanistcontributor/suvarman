import { VariablesConfig } from "@suvarman/core";
import { createMachine, assign } from "xstate";

type MachineContext = {
  config?: VariablesConfig;
  collectionId?: string;
  collectionModeId?: string;
};

export const processConfigFSM = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7AxnWACAwugHYBmAllLgGIDKAsgHQCSEANmAMQDyAcgPoAlAKIBBACJ98vKkwDiAbQAMAXUSgADulhkALmWJqQAD0QAmUwBYGigIwBWAGwXTNhw5sBmAOxeANCABPRABaOwY7C0U7Lw8bU1sbLxsADi87AF90-zQsHAJickpaRhZ2bn58YREAFSFJLgAZBqF8aqZeJVUkEE1tPQNukwQwgE4RxScLCwiRxyi7fyCEROSGB1MHCJtPLwdZj0zsjGxYPEJSCmp6BnxUMABDPSJKADd71DJ7gCN2WHK+IQCARcASdQy9XT6IiGIbBew2BgWewODwOCYbcyKPyBRB2UwjBhxOyKKJeTHTEaHEA5E5nAqXYo3O6PMjPXBvD7fX4cMHdCH9aGDRAeeJrWbJUx2EZ7Cwoxa4jyKBjJPaSyLJPGoqk0vLnQpXRi3B5PSiYdCsdiYAX-GQ8Jg0AASkiqtXqTRabQ6KnBWkhA1AsPMDHxySRyUU0wjHhG03lCA8suVihjiksmwligOWWpx119KK1yNLLZZotYCtUP+gOBoO9fN9AphIXhiORHjxpm8dhs0rjnYJ6cUGs2ksc0u1udO+QuBcYPHQehIAVwsAArphaTy6xoG1Cm-HRXtoslw+5olMPHHkeFnMSNeYRpYsZls0R0BA4IYdVO9Qz6D6+j3IUEDhMZW0cVF0XWeJsSWYJH2VFELHDNIyWjVwJ1yH98wNZg2DAAC-UFANEDROMRlWCwRi7exJVSZJKWzb86RnXCixNdl3k+H5P3rQD-WMRBVlDCZnEfcYfBsZC42JMJ1hSLxZh8FEHC8TDaWnfVGXY1lTXNS1Gz4oj9wTZVvGQix2xGLwkRcPsPFWFEpSQ6MYyk9S81Yxl50XZc1w3HBCMMkiEHxMJRJPVNkhSOI5RxULkPCNFogTTYpNMGyX3SIA */
    id: "Process Config FSM",

    tsTypes: {} as import("./processConfig.fsm.typegen").Typegen0,
    context: {},
    initial: "Idle",

    states: {
      Idle: {
        on: {
          ON_READ_CONFIG: {
            target: "Idle",
            internal: true,
            actions: "assignConfigToContext",
          },

          ON_CREATE_COLLECTION: "Creating collection",
        },
      },

      "Creating variables": {
        entry: "onCreateVariables",

        on: {
          ON_ERROR: {
            target: "Idle",
            actions: "onNotifyError",
          },
        },

        always: "Notify success",
      },

      "Creating collection": {
        on: {
          ON_FINISH_CREATE_COLLECTION: {
            target: "Creating variables",
            actions: "assignCollectionIdToContext",
          },
          ON_ERROR: {
            target: "Idle",
            actions: "onNotifyError",
          },
        },

        entry: "onCreateCollection",
      },

      "Notify success": {
        always: "Idle",
        entry: "onNotifySuccess",
      },
    },

    schema: {
      context: {} as MachineContext,
      events: {} as
        | { type: "ON_CREATE_COLLECTION" }
        | { type: "ON_READ_CONFIG"; payload: { config: VariablesConfig } }
        | {
            type: "ON_FINISH_CREATE_COLLECTION";
            payload: { collectionId: string; collectionModeId: string };
          }
        | { type: "ON_ERROR" }
        | { type: "ON_FINISH_CREATE_VARIABLE" },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      assignConfigToContext: assign((_, event) => {
        return {
          config: event.payload.config,
        };
      }),
      assignCollectionIdToContext: assign((_, event) => {
        return {
          collectionId: event.payload.collectionId,
          collectionModeId: event.payload.collectionModeId,
        };
      }),
    },
  }
);
