import { describe, it } from "node:test";
import assert from "node:assert";
import { reIndent } from "../src/shares/helpers.js";

describe("reIndent", () => {
  it("returns the original array when shiftBy is 0", () => {
    const ml = ["hello", "world"];
    assert.deepEqual(reIndent(ml, 0), ml);
  });

  it("adds tabs to the beginning of strings when shiftBy is positive", () => {
    const ml = ["hello", "world"];
    assert.deepEqual(reIndent(ml, 2), ["hello", "world"]);
  });

  it("recursively indents nested arrays", () => {
    const ml = ["hello", ["world", "foo"], "bar"];
    assert.deepEqual(reIndent(ml, 2), ["hello", ["world", "foo"], "bar"]);
  });
});
