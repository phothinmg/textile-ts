import { describe, it } from "node:test";
import assert from "node:assert";

import { parseHtmlAttr } from "../src/lib/parsers.js";

describe("parseHtmlAttr", () => {
  it("should return an empty object for an empty input string", () => {
    const value = "";
    const expected = {};
    const result = parseHtmlAttr(value);
    assert.deepEqual(result, expected);
  });

  it("should parse a single attribute with double quotes", () => {
    const value = 'name="value"';
    const expected = { name: "value" };
    const result = parseHtmlAttr(value);
    assert.deepEqual(result, expected);
  });

  it("should parse a single attribute with single quotes", () => {
    const value = "name='value'";
    const expected = { name: "value" };
    const result = parseHtmlAttr(value);
    assert.deepEqual(result, expected);
  });

  it("should parse multiple attributes with double quotes", () => {
    const value = 'name="value" class="foo"';
    const expected = {
      name: "value",
      class: "foo",
    };
    const result = parseHtmlAttr(value);
    assert.deepEqual(result, expected);
  });

  it("should parse multiple attributes with single quotes", () => {
    const value = "name='value' class='foo'";
    const expected = {
      name: "value",
      class: "foo",
    };
    const result = parseHtmlAttr(value);
    assert.deepEqual(result, expected);
  });

  it("should handle an attribute with no value", () => {
    const value = "name";
    const expected = {
      name: null,
    };
    const result = parseHtmlAttr(value);
    assert.deepEqual(result, expected);
  });
});
