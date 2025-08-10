// cSpell:disable
import { describe, it } from "node:test";
import assert from "node:assert";
import Textile from "../src/index.js";
import fs from "node:fs";
const tx = fs.readFileSync("tests/table-test.textile", "utf8");
const textile = new Textile();

describe("Paragraphs", () => {
  it("Plain Paragraph", () => {
    const text = "A paragraph.";
    const html = textile.parse(text).html;
    const result = "<p>A paragraph.</p>";
    assert.equal(html, result);
  });
  it("Identifying a paragraph with p.", () => {
    const text = "p. A paragraph.";
    const html = textile.parse(text).html;
    const result = "<p>A paragraph.</p>";
    assert.equal(html, result);
  });
  it("Indentation can be specified by one or more parentheses for every 1em to the right or left", () => {
    const text = "p(((. Left indent 3em.";
    const html = textile.parse(text).html;
    const result = '<p style="padding-left:3em;">Left indent 3em.</p>';
    assert.equal(html, result);
  });
  it("Indentation can be specified by one or more parentheses for every 1em to the right or left", () => {
    const text = "p)))>. right indent 3em";
    const html = textile.parse(text).html;
    const result =
      '<p style="padding-right:3em;text-align:right;">right indent 3em</p>';
    assert.equal(html, result);
  });
});
describe("Block signatures tests", () => {
  it("Plain Heading", () => {
    const text = "h2. Textile";
    const html = textile.parse(text).html;
    const result = "<h2>Textile</h2>";
    assert.equal(html, result);
  });
  it("Heading with class and Id", () => {
    const text = "h2(foo bar #biz). Textile";
    const html = textile.parse(text).html;
    //TODO remove space in last of class attrs.
    const result = '<h2 class="foo bar" id="biz">Textile</h2>';
    assert.equal(html, result);
  });
  it("Heading with styles", () => {
    const text = "h2{color:green}. This is a title";
    const html = textile.parse(text).html;
    //TODO add ";" at the end of style attr.
    const result = '<h2 style="color:green;">This is a title</h2>';
    assert.equal(html, result);
  });
  it("Heading with class , Id and styles", () => {
    const text = "h2(foo bar #biz){color:green}. Textile";
    const html = textile.parse(text).html;
    const result =
      '<h2 class="foo bar" id="biz" style="color:green;">Textile</h2>';
    assert.equal(html, result);
  });
  it("Heading with formatting modifiers", () => {
    const text = "h2<>. Textile";
    const html = textile.parse(text).html;
    const result = '<h2 style="text-align:justify;">Textile</h2>';
    assert.equal(html, result);
  });
  it("Headings can be aligned left", () => {
    const text = "h3<. Left aligned header";
    const html = textile.parse(text).html;
    const result = '<h3 style="text-align:left;">Left aligned header</h3>';
    assert.equal(html, result);
  });
  it("Headings can be aligned right", () => {
    const text = "h3>. Right aligned header";
    const html = textile.parse(text).html;
    const result = '<h3 style="text-align:right;">Right aligned header</h3>';
    assert.equal(html, result);
  });
  it("Headings can be aligned center", () => {
    const text = "h3=. Centered header";
    const html = textile.parse(text).html;
    const result = '<h3 style="text-align:center;">Centered header</h3>';
    assert.equal(html, result);
  });
});
describe("Pre-formatted text", () => {
  it("Displayed in a pre block. Spaces and line breaks are preserved", () => {
    const text = "pre. Pre-formatted       text";
    const html = textile.parse(text).html;
    const result = "<pre>Pre-formatted       text</pre>";
    assert.equal(html, result);
  });
  it("Blocks with empty lines, pre.. is used:", () => {
    const text = `pre.. 
                  The first pre-formatted line.
 
                                  And another line.`;
    const html = textile.parse(text).html;
    const result =
      "<pre>\n                  The first pre-formatted line.\n \n                                  And another line.</pre>";
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
    const html = textile.parse(text).html;
    const result =
      '<pre class="language-js"><code class="language-js">    export default function isAttrNode(input) {\n      return (\n        typeof input === "object" &amp;&amp;\n        Array.isArray(input) === false &amp;&amp;\n        input !== null\n      );\n    }\n    </code></pre>';
    assert.equal(html, result);
  });
});
describe("Block quotations", () => {
  it("Block quotations using `bq.`", () => {
    const text = "bq. A block quotation.";
    const html = textile.parse(text).html;
    const result = "<blockquote>\n<p>A block quotation.</p>\n</blockquote>";
    assert.equal(html, result);
  });
});
describe("Textile comments", () => {
  it("Use three '#' signs and a full stop to start comment block", () => {
    const text = "###. This is a textile comment block.";
    const html = textile.parse(text).html;
    const result = "";
    assert.equal(html, result);
  });
});
describe("No formatting (override Textile)", () => {
  it("Skip Textile processing for a block of content.", () => {
    const text =
      'notextile. Straight quotation marks are not converted into curly ones "in this example".';
    const html = textile.parse(text).html;
    const result =
      'Straight quotation marks are not converted into curly ones "in this example".';
    assert.equal(html, result);
  });
});

describe("Links tests", () => {
  it("A local link:", () => {
    const text = '"link text":/example';
    const html = textile.parse(text).html;
    const result = '<p><a href="/example">link text</a></p>';
    assert.equal(html, result);
  });
  it("A link with a title attribute:", () => {
    const text = '"link text(with title)":https://example.com/';
    const html = textile.parse(text).html;
    const result =
      '<p><a href="https://example.com/" title="with title">link text</a></p>';
    assert.equal(html, result);
  });
  it("An email link:", () => {
    const text =
      '"(classname)link text(title tooltip)":mailto:someone@example.com';
    const html = textile.parse(text).html;
    const result =
      '<p><a class="classname" href="mailto:someone@example.com" title="title tooltip">link text</a></p>';
    assert.equal(html, result);
  });
  it("Combine with a link with an image link:", () => {
    const text = "!carver.png!:https://textpattern.com/";
    const html = textile.parse(text).html;
    const result =
      '<p><a href="https://textpattern.com/"><img src="carver.png" alt="" /></a></p>';
    assert.equal(html, result);
  });
});

describe("List tests", () => {
  it("Bulleted (unordered) lists", () => {
    const text = "* Item A";
    const html = textile.parse(text).html;
    const result = "<ul>\n\t<li>Item A</li>\n</ul>";
    assert.equal(html, result);
  });
  it("Numbered (ordered) lists", () => {
    const text = "# Item one";
    const html = textile.parse(text).html;
    const result = "<ol>\n\t<li>Item one</li>\n</ol>";
    assert.equal(html, result);
  });
  it("Definition lists", () => {
    const text = `- HTML := HyperText Markup Language, based on SGML.
    - XHTML := HTML 4.0 rewritten to be compliant with XML rules.
    - HTML5 := The latest revision of the HTML standard
    Still under development =:
    `;
    const html = textile.parse(text).html;
    const result =
      '<dl>\n\t<dt><span class="caps">HTML</span></dt>\n\t<dd><p>HyperText Markup Language, based on <span class="caps">SGML</span>.<br />\n    &#8211; <span class="caps">XHTML</span> := <span class="caps">HTML</span> 4.0 rewritten to be compliant with <span class="caps">XML</span> rules.<br />\n    &#8211; <span class="caps">HTML5</span> := The latest revision of the <span class="caps">HTML</span> standard<br />\n    Still under development</p></dd>\n</dl>';
    assert.equal(html, result);
  });
  it("Footnotes", () => {
    const text = `A table, a chair, a bowl of fruit and a violin; what else does a man need to be happy?[1]

    fn1. "Albert Einstein":http://www.brainyquote.com/quotes/quotes/a/alberteins148867.html
    `;
    const html = textile.parse(text).html;
    const result =
      '<p>A table, a chair, a bowl of fruit and a violin; what else does a man need to be happy?<sup class="footnote" id="fnr1"><a href="#fn1">1</a></sup></p>fn1. <a href="http://www.brainyquote.com/quotes/quotes/a/alberteins148867.html">Albert Einstein</a>';
    assert.equal(html, result);
  });
});

describe("Table Test", () => {
  it("Simple row", () => {
    const table = `
| A | simple | table | row |
| And | another | table | row |
| With an | | empty | cell |
`;
    const html =
      "<table>\n\t<tr>\n\t\t<td> A </td>\n\t\t<td> simple </td>\n\t\t<td> table </td>\n\t\t<td> row </td>\n\t</tr>\n\t<tr>\n\t\t<td> And </td>\n\t\t<td> another </td>\n\t\t<td> table </td>\n\t\t<td> row </td>\n\t</tr>\n\t<tr>\n\t\t<td> With an </td>\n\t\t<td> </td>\n\t\t<td> empty </td>\n\t\t<td> cell </td>\n\t</tr>\n</table>";
    const result = textile.parse(table).html;
    assert.equal(result, html);
  });
  it("Headings are preceded by |_.:", () => {
    const table = `
|_. First Header |_. Second Header |
| Content Cell | Content Cell |
`;
    const html =
      "<table>\n\t<tr>\n\t\t<th>First Header </th>\n\t\t<th>Second Header </th>\n\t</tr>\n\t<tr>\n\t\t<td> Content Cell </td>\n\t\t<td> Content Cell </td>\n\t</tr>\n</table>";
    const result = textile.parse(table).html;
    assert.equal(result, html);
  });
  it("The <thead> tag is added when |^. above and |-. below the heading are used", () => {
    const table = `
|^.
|_. First Header |_. Second Header |
|-.
| Content Cell | Content Cell |
| Content Cell | Content Cell |
`;
    const html =
      "<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>First Header </th>\n\t\t\t<th>Second Header </th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td> Content Cell </td>\n\t\t\t<td> Content Cell </td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td> Content Cell </td>\n\t\t\t<td> Content Cell </td>\n\t\t</tr>\n\t</tbody>\n</table>";
    const result = textile.parse(table).html;
    assert.equal(result, html);
  });
  it("Table attributes are specified by placing the special table. block modifier immediately before the table:", () => {
    const table = `
table(tableclass).
|a|classy|table|
|a|classy|table|
`;
    const html =
      '<table class="tableclass">\n\t<tr>\n\t\t<td>a</td>\n\t\t<td>classy</td>\n\t\t<td>table</td>\n\t</tr>\n\t<tr>\n\t\t<td>a</td>\n\t\t<td>classy</td>\n\t\t<td>table</td>\n\t</tr>\n</table>';
    const result = textile.parse(table).html;
    assert.equal(result, html);
  });
  it("Table attributes are specified by placing the special table. block modifier immediately before the table:", () => {
    const html =
      '<table id="dvds" style="border-collapse:collapse;" summary="Great films on DVD employing Textile summary, caption, thead, tfoot, two tbody elements and colgroups">\n\t<caption style="font-size:140%;margin-bottom:15px;">DVDs with two Textiled tbody elements</caption>\n\t<colgroup span="3" width="100">\n\t\t<col style="background:#ddd;" />\n\t\t<col width="250" />\n\t\t<col />\n\t\t<col width="50" />\n\t\t<col width="300" />\n\t</colgroup>\n\t<thead class="header">\n\t\t<tr>\n\t\t\t<th>Title </th>\n\t\t\t<th>Starring </th>\n\t\t\t<th>Director </th>\n\t\t\t<th>Writer </th>\n\t\t\t<th>Notes </th>\n\t\t</tr>\n\t</thead>\n\t<tfoot class="footer">\n\t\t<tr>\n\t\t\t<td colspan="5" style="text-align:center;">This is the tfoot, centred </td>\n\t\t</tr>\n\t</tfoot>\n\t<tbody class="toplist" style="background:#c5f7f6;">\n\t\t<tr>\n\t\t\t<td> <em>The Usual Suspects</em> </td>\n\t\t\t<td> Benicio Del Toro, Gabriel Byrne, Stephen Baldwin, Kevin Spacey </td>\n\t\t\t<td> Bryan Singer </td>\n\t\t\t<td> Chris McQuarrie </td>\n\t\t\t<td> One of the finest films ever made </td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td> <em>Se7en</em> </td>\n\t\t\t<td> Morgan Freeman, Brad Pitt, Kevin Spacey </td>\n\t\t\t<td> David Fincher </td>\n\t\t\t<td> Andrew Kevin Walker </td>\n\t\t\t<td> Great psychological thriller </td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td> <em>Primer</em> </td>\n\t\t\t<td> David Sullivan, Shane Carruth </td>\n\t\t\t<td> Shane Carruth </td>\n\t\t\t<td> Shane Carruth </td>\n\t\t\t<td> Amazing insight into trust and human psychology through science fiction. Terrific! </td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td> <em>District 9</em> </td>\n\t\t\t<td> Sharlto Copley, Jason Cope </td>\n\t\t\t<td> Neill Blomkamp </td>\n\t\t\t<td> Neill Blomkamp, Terri Tatchell </td>\n\t\t\t<td> Social commentary layered on thick, but boy is it done well </td>\n\t\t</tr>\n\t</tbody>\n\t<tbody class="medlist" style="background:#e7e895;">\n\t\t<tr>\n\t\t\t<td> <em>Arlington Road</em> </td>\n\t\t\t<td> Tim Robbins, Jeff Bridges </td>\n\t\t\t<td> Mark Pellington </td>\n\t\t\t<td> Ehren Kruger </td>\n\t\t\t<td> Awesome study in neighbourly relations </td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td> <em>Phone Booth</em> </td>\n\t\t\t<td> Colin Farrell, Kiefer Sutherland, Forest Whitaker </td>\n\t\t\t<td> Joel Schumacher </td>\n\t\t\t<td> Larry Cohen </td>\n\t\t\t<td> Edge-of-the-seat stuff in this short but brilliantly executed thriller </td>\n\t\t</tr>\n\t</tbody>\n</table>';
    const result = textile.parse(tx).html;
    assert.equal(result, html);
  });
});
