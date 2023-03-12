import { filterObject } from "@foundation/std/filterObject";
import { describe, expect, it } from "vitest";

describe.concurrent("@foundation/std/filterObject", () => {
  it("basic", () => {
    const result = filterObject({ a: "hi", b: "bye" }, ([k]) => k === "a");
    expect(result).toEqual({ a: "hi" });
  });
});
