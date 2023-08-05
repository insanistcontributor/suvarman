import { z } from "zod";

export const schema = z.object({
  collectionName: z.optional(z.string()),
  variables: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      description: z.optional(z.string()),
      type: z.string(),
    })
  ),
});

type Config = z.infer<typeof schema>;

function getFormattedConfig(configString: string): Promise<Config> {
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
