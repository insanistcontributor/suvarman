import { z } from "zod";

export const schema = z.object({
  collectionName: z.optional(z.string()),
  variables: z.array(
    z.object({
      name: z.string(),
      value: z.union([z.string(), z.number()]),
      description: z.optional(z.string()),
      type: z.enum(["COLOR", "BOOLEAN", "FLOAT", "STRING"]),
    })
  ),
});

export type VariablesConfig = z.infer<typeof schema>;

function getFormattedConfig(configString: string): Promise<VariablesConfig> {
  return new Promise((resolve, reject) => {
    try {
      const parsed = schema.parse(JSON.parse(configString));
      resolve(parsed);
    } catch (error) {
      reject(error);
    }
  });
}

export { getFormattedConfig };
