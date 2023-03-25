import { filterObject } from ".";
import { describe, expect, it } from "vitest";

describe.concurrent("@foundation/std", () => {
  it("basic", () => {
    const result = filterObject({ a: "hi", b: "bye" }, ([k]) => k === "a");
    expect(result).toEqual({ a: "hi" });
  });
});
