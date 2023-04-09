import { describe, expect, it } from "vitest";
import { filterObject } from ".";

describe.concurrent("@foundation/std", () => {
  it("basic", () => {
    const result = filterObject({ a: "hi", b: "bye" }, ([k]) => k === "a");
    expect(result).toEqual({ a: "hi" });
  });
});
