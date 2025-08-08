import { describe, it } from "node:test";
import assert from "node:assert";
import Textile from "../src/index.js";

describe("Links tests", () => {
  it("A local link:", () => {
    const text = '"link text":/example';
    const html = Textile.textToHTML(text);
    const result = '<p><a href="/example">link text</a></p>';
    assert.equal(html, result);
  });
  it("A link with a title attribute:", () => {
    const text = '"link text(with title)":https://example.com/';
    const html = Textile.textToHTML(text);
    const result =
      '<p><a href="https://example.com/" title="with title">link text</a></p>';
    assert.equal(html, result);
  });
  it("An email link:", () => {
    const text =
      '"(classname)link text(title tooltip)":mailto:someone@example.com';
    const html = Textile.textToHTML(text);
    const result =
      '<p><a class="classname" href="mailto:someone@example.com" title="title tooltip">link text</a></p>';
    assert.equal(html, result);
  });
  it("Combine with a link with an image link:", () => {
    const text = "!carver.png!:https://textpattern.com/";
    const html = Textile.textToHTML(text);
    const result =
      '<p><a href="https://textpattern.com/"><img src="carver.png" alt="" /></a></p>';
    assert.equal(html, result);
  });
  // Usage of a link alias is done by generate html document.
  // it("Usage of a link alias:", () => {
  //   const text = `This is "a link to Textpattern":txp, and "another link":txp to the same site.

  //   [txp]https://textpattern.com/
  //   `;
  //   const html = Textile.textToHTML(text);
  //   const result =
  //     '<p>This is <a href="https://textpattern.com/">a link to Textpattern</a>, and <a href="https://textpattern.com/">another link</a> to the same site.</p><p></p>';
  //   assert.equal(html, result);
  // });
});
