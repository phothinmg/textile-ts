import { describe, it } from "node:test";
import assert from "node:assert";
import { html2jml } from "../src/html-jml.js";

describe("html2jml", () => {
  it("should return an empty array for an empty HTML string", () => {
    const html = "";
    const expected = [];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert a single HTML tag with no attributes", () => {
    const html = "<p></p>";
    const expected = [["p"]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert a single HTML tag with attributes", () => {
    const html = '<p class="foo" id="bar"></p>';
    const expected = [["p", { class: "foo", id: "bar" }]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert nested HTML tags", () => {
    const html = "<div><p></p></div>";
    const expected = [["div", ["p"]]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert an HTML tag with text content", () => {
    const html = "<p>Hello World!</p>";
    const expected = [["p", "Hello World!"]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert an HTML tag with multiple text contents", () => {
    const html = "<p>Hello <span>World!</span></p>";
    const expected = [["p", "Hello ", ["span", "World!"]]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert an HTML tag with attributes and text content", () => {
    const html = '<p class="foo">Hello World!</p>';
    const expected = [["p", { class: "foo" }, "Hello World!"]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });

  it("should convert a void HTML tag (self-closing)", () => {
    const html = '<img src="image.jpg" />';
    const expected = [["img", { src: "image.jpg" }]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });
  // TODO edit like checked
  it("should convert an HTML tag with a boolean attribute", () => {
    const html = '<input type="checkbox" checked>';
    const expected = [["input", { type: "checkbox", checked: "" }]];
    const result = html2jml(html);
    assert.deepEqual(result, expected);
  });
});
