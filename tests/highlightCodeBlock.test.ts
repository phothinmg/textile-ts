// import { describe, it } from "node:test";
// import assert from "node:assert";
// import hljs from "highlight.js";
// import Prism from "prismjs";
// import Textile, { type TextileExtension } from "../src/index.js";

// const hljsExtension: TextileExtension = {
//   type: "syntaxHighlight",
//   highlighter: "highlight.js",
//   function: (code, lang) => {
//     return hljs.highlight(code, { language: lang }).value;
//   },
// };

// const prismExtension: TextileExtension = {
//   type: "syntaxHighlight",
//   highlighter: "prismjs",
//   function: (code, lang) => {
//     return Prism.highlight(code, Prism.languages[lang], lang);
//   },
// };

// const code = `
// bc(*js foo #bar)..
// export default function isAttrNode(input) {
//   return (
//     typeof input === "object" &&
//     Array.isArray(input) === false &&
//     input !== null
//   );
// }
// `;

// describe("Code block highlight test", () => {
//   it("With highlight.js", () => {
//     const textile = new Textile();
//     const result = textile.use(hljsExtension).parse(code).html;
//     const expected =
//       '<pre class="language-js foo" id="bar"><code class="language-js foo"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">isAttrNode</span>(<span class="hljs-params">input</span>) {\n  <span class="hljs-keyword">return</span> (\n    <span class="hljs-keyword">typeof</span> input === <span class="hljs-string">"object"</span> &amp;&amp;\n    <span class="hljs-title class_">Array</span>.<span class="hljs-title function_">isArray</span>(input) === <span class="hljs-literal">false</span> &amp;&amp;\n    input !== <span class="hljs-literal">null</span>\n  );\n}\n</code></pre>';
//     assert.equal(result, expected);
//   });
//   it("With Prism Js", () => {
//     const textile = new Textile();
//     const result = textile.use(prismExtension).parse(code).html;
//     const expected =
//       '<pre class="language-js foo" id="bar"><code class="language-js foo"><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">isAttrNode</span><span class="token punctuation">(</span><span class="token parameter">input</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token keyword">typeof</span> input <span class="token operator">===</span> <span class="token string">"object"</span> <span class="token operator">&amp;&amp;</span>\n    Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>input<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token boolean">false</span> <span class="token operator">&amp;&amp;</span>\n    input <span class="token operator">!==</span> <span class="token keyword">null</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>';
//     assert.equal(result, expected);
//   });
// });
