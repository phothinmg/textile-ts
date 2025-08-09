import { describe, it } from "node:test";
import assert from "node:assert";
import { jml2html } from "../src/html-jml.js";
import type { JsonMLRoot } from "../src/shares/types.js";

describe("jml2html", () => {
  it("should return an empty string for an empty JSON-ML tree", () => {
    const tree: JsonMLRoot = [];
    const expected = "";
    const result = jml2html(tree);
    assert.strictEqual(result, expected);
  });

  it("should convert a single node with text content to HTML", () => {
    const tree: JsonMLRoot = ["Hello World!"];
    const expected = "Hello World!";
    const result = jml2html(tree);
    assert.strictEqual(result, expected);
  });

  it("should convert a single node with HTML tag to HTML", () => {
    const tree: JsonMLRoot = [["p", "Hello World!"]];
    const expected = "<p>Hello World!</p>";
    const result = jml2html(tree);
    assert.strictEqual(result, expected);
  });

  it("should convert multiple nodes with text content and HTML tags to HTML", () => {
    const tree: JsonMLRoot = ["Hello ", ["p", "World!"], " Foo "];
    const expected = "Hello <p>World!</p> Foo ";
    const result = jml2html(tree);
    assert.strictEqual(result, expected);
  });

  it("should convert nested HTML tags to HTML", () => {
    const tree: JsonMLRoot = [["div", ["p", "Hello World!"]]];
    const expected = "<div><p>Hello World!</p></div>";
    const result = jml2html(tree);
    assert.strictEqual(result, expected);
  });
});
