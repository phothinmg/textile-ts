import { describe, it } from "node:test";
import assert from "node:assert";
import Textile from "../src/index.js";

describe("List tests", () => {
  it("Bulleted (unordered) lists", () => {
    const text = "* Item A";
    const html = Textile.textToHTML(text);
    const result = "<ul>\n\t<li>Item A</li>\n</ul>";
    assert.equal(html, result);
  });
  it("Numbered (ordered) lists", () => {
    const text = "# Item one";
    const html = Textile.textToHTML(text);
    const result = "<ol>\n\t<li>Item one</li>\n</ol>";
    assert.equal(html, result);
  });
  it("Definition lists", () => {
    const text = `- HTML := HyperText Markup Language, based on SGML.
    - XHTML := HTML 4.0 rewritten to be compliant with XML rules.
    - HTML5 := The latest revision of the HTML standard
    Still under development =:
    `;
    const html = Textile.textToHTML(text);
    const result =
      '<dl>\n\t<dt><span class="caps">HTML</span></dt>\n\t<dd><p>HyperText Markup Language, based on <span class="caps">SGML</span>.<br />\n    &#8211; <span class="caps">XHTML</span> := <span class="caps">HTML</span> 4.0 rewritten to be compliant with <span class="caps">XML</span> rules.<br />\n    &#8211; <span class="caps">HTML5</span> := The latest revision of the <span class="caps">HTML</span> standard<br />\n    Still under development</p></dd>\n</dl>'
    assert.equal(html, result);
  });
  it("Footnotes", () => {
    const text = `A table, a chair, a bowl of fruit and a violin; what else does a man need to be happy?[1]

    fn1. "Albert Einstein":http://www.brainyquote.com/quotes/quotes/a/alberteins148867.html
    `;
    const html = Textile.textToHTML(text);
    const result =
      '<p>A table, a chair, a bowl of fruit and a violin; what else does a man need to be happy?<sup class="footnote" id="fnr1"><a href="#fn1">1</a></sup></p>fn1. <a href="http://www.brainyquote.com/quotes/quotes/a/alberteins148867.html">Albert Einstein</a>';
    assert.equal(html, result);
  });
});
