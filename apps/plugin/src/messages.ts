export type FigmaMessage =
  | {
      type: "create-variable-collection";
      payload: {
        collectionName?: string;
      };
    }
  | {
      type: "create-variable";
      payload: {
        collectionId: string;
        collectionModeId: string;
        name: string;
        value: string | number;
        type: VariableResolvedDataType;
        description?: string;
      };
    }
  | {
      type: "notify-success";
    }
  | {
      type: "notify-error";
      payload?: {
        message: string;
      };
    }
  | {
      type: "return-collection-id";
      payload: {
        collectionId: string;
        collectionModeId: string;
      };
    }
  | {
      type: "error-create-collection";
    }
  | {
      type: "error-create-variable";
    };
