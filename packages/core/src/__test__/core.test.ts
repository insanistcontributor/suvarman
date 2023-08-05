import { describe, expect, test } from "vitest";
import { getFormattedConfig } from "../index";
import fs from "fs";
import path from "path";
describe("core", () => {
  test("core", async () => {
    const configString = fs.readFileSync(
      path.join(__dirname, "example.json"),
      "utf-8"
    );

    const config = await getFormattedConfig(configString).then(
      (config) => config
    );

    expect(config).toEqual({
      collectionName: "Example Collection",
      variables: [
        {
          name: "color variable",
          type: "COLOR",
          value: "#123123",
        },
        {
          name: "number varialbl",
          type: "FLOAT",
          value: "0.123",
        },
      ],
    });
  });
});
