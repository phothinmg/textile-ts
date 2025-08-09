import { describe, it } from "node:test";
import assert from "node:assert";
import frontmatter from "../src/frontmatter.js";

describe("matter function", () => {
  it("should return content with no frontmatter separator", () => {
    const input = "This is content with no frontmatter.";
    const expected = { data: {}, content: input };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });

  it("should parse frontmatter with single key-value pair", () => {
    const input = "---\ntitle: Example\n---\nThis is example content.";
    const expected = {
      data: { title: "Example" },
      content: "This is example content.",
    };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });

  it("should parse frontmatter with multiple key-value pairs", () => {
    const input =
      "---\ntitle: Example\nauthor: John Doe\n---\nThis is example content.";
    const expected = {
      data: { title: "Example", author: "John Doe" },
      content: "This is example content.",
    };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });

  it("should ignore empty lines in frontmatter", () => {
    const input = "---\n\nauthor: John Doe\n---\nThis is example content.";
    const expected = {
      data: { author: "John Doe" },
      content: "This is example content.",
    };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });

  it("should trim whitespace from frontmatter keys and values", () => {
    const input = "---\n title:  Example \n---\nThis is example content.";
    const expected = {
      data: { title: "Example" },
      content: "This is example content.",
    };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });

  it("should return content with no frontmatter data", () => {
    const input = "---\n---\nThis is example content.";
    const expected = { data: {}, content: "This is example content." };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });

  it("should handle frontmatter separator with no data", () => {
    const input = "---\n---";
    const expected = { data: {}, content: "" };
    const result = frontmatter(input);
    assert.deepEqual(result, expected);
  });
});
