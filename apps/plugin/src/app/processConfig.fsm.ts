import { VariablesConfig } from "@suvarman/core";
import { createMachine, assign } from "xstate";

type MachineContext = {
  config?: VariablesConfig;
  collectionId?: string;
  collectionModeId?: string;
};

export const processConfigFSM = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOB7AxnWACAwugHYBmAllLgGIDKAsgHQCSEANmAMQDyAcgPoAlAKIBBACJ98vKkwDiAbQAMAXUSgADulhkALmWJqQAD0QAmUwBYGigIwBWAGwXTNhw5sBmAOxeANCABPRABaOwY7C0U7Lw8bU1sbLxsADi87AF90-zQsHAJickpaRhZ2bn58YREAFSFJLgAZBqF8aqZeJVUkEE1tPQNukwQwgE4RxScLCwiRxyi7fyCEROSGB1MHCJtPLwdZj0zsjGxYPEJSCmp6BnxUMABDPSJKADd71DJ7gCN2WHK+IQCARcASdQy9XT6IiGIbBew2BgWewODwOCYbcyKPyBRB2UwjBhxOyKKJeTHTEaHEA5E5nAqXYo3O6PMjPXBvD7fX4cMHdCH9aGDMx2BEWNKKUxeRTJCweYkORa4jyKBio0zy5JuaYiqk0vLnQpXRi3B5PSiYdCsdiYAX-GQ8Jg0AASkiqtXqTRabQ6KnBWkhA1AsPMDHxMpSimmkY8I2mioQHgsDgYyUUsYlSbsyXiByy1OO+vpRWuJpZbItVrANqh-0BwNBvr5-oFMJC8MRyNR6PW8WxS1MqdVdhGHmSyTlNim0cyeaI6AgcEMetO+Quxbofr6UNbCDhYw7ji76x7WPjwRH1gH0ri6xGDmzXl1BZXBoZ11KYE3AcFQcQaPjIyrBYI5pPY6qpMklJ5sudJrkaTKmqyrzvJ8PyLk2W6BsYiCrDKEzOCM+JYkkFjJPGxJhOsKReLMPgog4j7Qc+sGGoypZmrgFbWi2GHfjuiYpt4pGysOXhIi48amKOaxyneiYxrGk4zukQA */
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
        },

        always: "Idle",
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
