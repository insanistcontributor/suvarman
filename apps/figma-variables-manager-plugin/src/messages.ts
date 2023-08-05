export type FigmaMessage =
  | { type: "create-variable-collection"; payload: { collectionName?: string } }
  | {
      type: "create-variable";
      payload: {
        name: string;
        value: string;
        type: VariableResolvedDataType;
        description?: string;
      };
    };
