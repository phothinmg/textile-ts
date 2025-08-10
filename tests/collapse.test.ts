import { describe, it } from "node:test";
import assert from "node:assert";
import { collapse } from "../src/shares/re.js";

describe("collapse function", () => {
  it("should return an empty string for an empty input", () => {
    const input = "";
    const expected = "";
    assert.strictEqual(collapse(input), expected);
  });

//   it("should return the original string if it has no comments or whitespace", () => {
//     const input = "Hello World!";
//     const expected = "Hello World!";
//     assert.strictEqual(collapse(input), expected);
//   });

  it("should remove comments", () => {
    const input = "# This is a comment\nHello World!";
    const expected = "HelloWorld!";
    assert.strictEqual(collapse(input), expected);
  });

  it("should remove whitespace", () => {
    const input = "   Hello   World!   ";
    const expected = "HelloWorld!";
    assert.strictEqual(collapse(input), expected);
  });

  it("should remove comments and whitespace", () => {
    const input = "# This is a comment\n   Hello   World!   ";
    const expected = "HelloWorld!";
    assert.strictEqual(collapse(input), expected);
  });

  it("should remove multiple comments and whitespace", () => {
    const input = "# This is a comment\n# Another comment\n   Hello   World!   ";
    const expected = "HelloWorld!";
    assert.strictEqual(collapse(input), expected);
  });
});