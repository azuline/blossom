import { flattenRecord } from ".";
import { describe, expect, expectTypeOf, it } from "vitest";

describe.concurrent("@foundation/std/flattenRecord", () => {
  it("basic", () => {
    const result = flattenRecord({ a: "hi", b: { c: "bye", d: { "1": "hi" } } });
    expect(result).toEqual({ a: "hi", "b.c": "bye", "b.d.1": "hi" });
  });
});

expectTypeOf(
  flattenRecord({ a: "hi", b: { c: "bye" } }),
).toEqualTypeOf<{ a: string; "b.c": string }>();
