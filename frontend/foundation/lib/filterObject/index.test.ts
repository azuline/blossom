import { filterObject } from "@foundation/lib/filterObject";
import { describe, expect, it } from "vitest";

describe.concurrent("@foundation/lib/filterObject", () => {
  it("basic", () => {
    const result = filterObject({ a: "hi", b: "bye" }, ([k]) => k === "a");
    expect(result).toEqual({ a: "hi" });
  });
});
