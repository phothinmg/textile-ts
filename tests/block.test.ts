import { describe, it} from "node:test";
import assert from "node:assert";
import Textile from "../src/index.js";


describe("Paragraphs", () => {
  it("Plain Paragraph", () => {
    const text = "A paragraph.";
    const html = Textile.textToHTML(text);
    const result = "<p>A paragraph.</p>";
    assert.equal(html, result);
  });
  it("Identifying a paragraph with p.", () => {
    const text = "p. A paragraph.";
   const html = Textile.textToHTML(text);
    const result = "<p>A paragraph.</p>";
    assert.equal(html, result);
  });
  it("Indentation can be specified by one or more parentheses for every 1em to the right or left", () => {
    const text = "p(((. Left indent 3em.";
   const html = Textile.textToHTML(text);
    const result = '<p style="padding-left:3em;">Left indent 3em.</p>';
    assert.equal(html, result);
  });
  it("Indentation can be specified by one or more parentheses for every 1em to the right or left", () => {
    const text = "p)))>. right indent 3em";
   const html = Textile.textToHTML(text);
    const result =
      '<p style="padding-right:3em;text-align:right;">right indent 3em</p>';
    assert.equal(html, result);
  });
});
describe("Block signatures tests", () => {
  it("Plain Heading", () => {
    const text = "h2. Textile";
   const html = Textile.textToHTML(text);
    const result = "<h2>Textile</h2>";
    assert.equal(html, result);
  });
  it("Heading with class and Id", () => {
    const text = "h2(foo bar #biz). Textile";
   const html = Textile.textToHTML(text);
    //TODO remove space in last of class attrs.
    const result = '<h2 class="foo bar" id="biz">Textile</h2>';
    assert.equal(html, result);
  });
  it("Heading with styles", () => {
    const text = "h2{color:green}. This is a title";
   const html = Textile.textToHTML(text);
    //TODO add ";" at the end of style attr.
    const result = '<h2 style="color:green;">This is a title</h2>';
    assert.equal(html, result);
  });
  it("Heading with class , Id and styles", () => {
    const text = "h2(foo bar #biz){color:green}. Textile";
   const html = Textile.textToHTML(text);
    const result =
      '<h2 class="foo bar" id="biz" style="color:green;">Textile</h2>';
    assert.equal(html, result);
  });
  it("Heading with formatting modifiers", () => {
    const text = "h2<>. Textile";
   const html = Textile.textToHTML(text);
    const result = '<h2 style="text-align:justify;">Textile</h2>';
    assert.equal(html, result);
  });
  it("Headings can be aligned left", () => {
    const text = "h3<. Left aligned header";
   const html = Textile.textToHTML(text);
    const result = '<h3 style="text-align:left;">Left aligned header</h3>';
    assert.equal(html, result);
  });
  it("Headings can be aligned right", () => {
    const text = "h3>. Right aligned header";
   const html = Textile.textToHTML(text);
    const result = '<h3 style="text-align:right;">Right aligned header</h3>';
    assert.equal(html, result);
  });
  it("Headings can be aligned center", () => {
    const text = "h3=. Centered header";
   const html = Textile.textToHTML(text);
    const result = '<h3 style="text-align:center;">Centered header</h3>';
    assert.equal(html, result);
  });
});
describe("Pre-formatted text", () => {
  it("Displayed in a pre block. Spaces and line breaks are preserved", () => {
    const text = "pre. Pre-formatted       text";
   const html = Textile.textToHTML(text);
    const result = "<pre>Pre-formatted       text</pre>";
    assert.equal(html, result);
  });
  it("Blocks with empty lines, pre.. is used:", () => {
    const text = `pre.. 
                  The first pre-formatted line.
 
                                  And another line.`;
   const html = Textile.textToHTML(text);
    const result =
      '<pre>\n                  The first pre-formatted line.\n \n                                  And another line.</pre>';
    assert.equal(html, result);
  });
});
describe("Block code", () => {
  it(" For long blocks of code with blank lines in between, use the extended block directive `bc..`.", () => {
    const text = `bc(language-js)..
    export default function isAttrNode(input) {
      return (
        typeof input === "object" &&
        Array.isArray(input) === false &&
        input !== null
      );
    }
    `;
   const html = Textile.textToHTML(text);
    const result =
      '<pre class="language-js"><code class="language-js">    export default function isAttrNode(input) {\n      return (\n        typeof input === "object" &amp;&amp;\n        Array.isArray(input) === false &amp;&amp;\n        input !== null\n      );\n    }\n    </code></pre>';
    assert.equal(html, result);
  });
});
describe("Block quotations", () => {
  it("Block quotations using `bq.`", () => {
    const text = "bq. A block quotation.";
   const html = Textile.textToHTML(text);
    const result = "<blockquote>\n<p>A block quotation.</p>\n</blockquote>";
    assert.equal(html, result);
  });
});
describe("Textile comments", () => {
  it("Use three '#' signs and a full stop to start comment block", () => {
    const text = "###. This is a textile comment block.";
   const html = Textile.textToHTML(text);
    const result = "";
    assert.equal(html, result);
  });
});
describe("No formatting (override Textile)", () => {
  it("Skip Textile processing for a block of content.", () => {
    const text = 'notextile. Straight quotation marks are not converted into curly ones "in this example".';
   const html = Textile.textToHTML(text);
    const result = 'Straight quotation marks are not converted into curly ones "in this example".';
    assert.equal(html, result);
  });
});
