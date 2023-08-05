import { VariablesConfig } from "@fvm/core";
import { createMachine, assign } from "xstate";

type MachineContext = {
  config?: VariablesConfig;
  collectionId?: string;
  collectionModeId?: string;
};

export const processConfigFSM = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7AxnWACAwugHYBmAllLgGIDKAsgHQCSEANmAMQDyAcgPoAlAKIBBACJ98vKkwDiAbQAMAXUSgADulhkALmWJqQAD0QAmUwBYGigIwBWAGwXTNhw5sBmAOxeANCABPRABaOwY7C0U7Lw8bU1sbLxsADi87AF90-zQsHAJickpaRhZ2bn58YREAFSFJLgAZBqF8aqZeJVUkEE1tPQNukwQwgE4RxScLCwiRxyi7fyCEROSGB1MHCJtPLwdZj0zsjGxYPEJSCmp6BnxUMABDPSJKADd71DJ7gCN2WHK+IQCARcASdQy9XT6IiGIbBew2BgWewODwOCYbcyKPyBRB2UwjBhxOyKKJeTHTEaHEA5E5nAqXYo3O6PMjPXBvD7fX7-GQ8Jg0AASkiqtT4ADURAImCIAELNMHdCH9aGDMx2BEWNKKUxeRTJCweYkORa4jyKBio0xG5Juabqqk0vLnQpXRi3B5PSiYdCsdiYZU8ph8wXC0SiqRNFptDoqcFaSEDUCw8wMfH6lKKaaZjwjaYmhAeCwOBjJRS57VFuzJeIHLLU45O+lFa7ulls72+sD+qH-QHA0GxxXx5UwkLwxHI1Ho9bxbFLUyli12EYeZLJQ02KbZzJ1ojoCBwQyO075C7NuhxvpQ0cIOFjCeOKfrGdY-PBFfWBdY9xJVIZOvHnSZ6uswbBgJeCYqkmiBovmIyrBYK5pPYVqpMklIAQ2J7OgyLbMp67LvJ8PyHkOV6JsYiCrPqEzOCM+JYkkFjJPmxJhOsKReLMPgog4XgOlhQEuoyrYER2fojmRkE3oWJbeMxBrLl4SIuPmpirmshojCiBpjEiFg7ukQA */
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
          ON_ERROR: "Idle",
          ON_FINISH_CREATE_VARIABLE: "Idle",
        },
      },

      "Creating collection": {
        on: {
          ON_FINISH_CREATE_COLLECTION: {
            target: "Creating variables",
            actions: "assignCollectionIdToContext",
          },
          ON_ERROR: "Idle",
        },

        entry: "onCreateCollection",
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
