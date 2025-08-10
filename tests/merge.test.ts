import { describe, it } from "node:test";
import assert from "node:assert";
import { merge } from "../src/shares/helpers.js";

describe("merge function", () => {
  it("merges two objects with overlapping keys", () => {
    const a = { foo: "bar", baz: "qux" };
    const b = { foo: "newBar", quux: "corge" };
    const expected = { foo: "newBar", baz: "qux", quux: "corge" };
    const result = merge(a, b);
    assert.deepEqual(result, expected);
  });

  it("merges two objects with non-overlapping keys", () => {
    const a = { foo: "bar" };
    const b = { baz: "qux" };
    const expected = { foo: "bar", baz: "qux" };
    const result = merge(a, b);
    assert.deepEqual(result, expected);
  });

  it("merges an object with an empty object", () => {
    const a = { foo: "bar" };
    const b = {};
    const result = merge(a, b);
    const expected = { foo: "bar" };
    assert.deepEqual(result, expected);
  });

  it("merges an object with no second object", () => {
    const a = { foo: "bar" };
    const result = merge(a);
    const expected = { foo: "bar" };
    assert.deepEqual(result, expected);
  });
});
