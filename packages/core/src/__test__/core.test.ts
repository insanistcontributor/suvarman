import { describe, expect, test } from "vitest";
import { core } from "../index";
describe("core", () => {
  test("core", () => {
    core();
    expect(true).toBe(true);
  });
});
