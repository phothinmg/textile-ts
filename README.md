# textile-ts

<div align="center">
    <img alt="textile-logo" src="textile-logo.svg">
  <div>
    <a href="https://biomejs.dev"><img alt="biome" src="https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome"><a>  <img alt="npm-v" src="https://img.shields.io/npm/v/textile-ts?logo=npm"> <a href="https://phothinmg.github.io/textile-ts/mcr/index.html"><img alt="coverage" src="https://img.shields.io/badge/coverage-96.0-brightgreen?style=flat"></a> <a href="https://www.jsdocs.io/package/textile-ts"><img alt="jsDocs.io" src="https://img.shields.io/badge/jsDocs.io-reference-blue"></a>
  </div>
</div>


## About

**_The Package is under development now_**

This implementation extends [textile-js][textilejs] by [Borgar Þorsteinsson][borgar].

## Textile Syntax Guide

Please visit [here][textile-web]

## Install

```bash
npm i textile-ts
```

## Use

API docs on [JsDocs.io][jsdocio]

### Basic

```ts
import Textile from "textile-ts";

const str = "h1. Hello World";
const textile = new Textile();
const result = textile.parse(str).html; //
```

### Syntax Highlighting

#### Example with highlight-js

```ts
import hljs from "highlight.js";
import Textile, { type TextileExtension } from "textile-ts";

const code = `
bc(*js foo #bar)..
function foo(bar) {
  return bar
}
`;
// creating hljs extension
const hljsExtension: TextileExtension = {
  type: "syntaxHighlight",
  highlighter: "highlight.js",
  function: (code, lang) => {
    return hljs.highlight(code, { language: lang }).value;
  },
};

const textile = new Textile();
const result = textile.use(hljsExtension).parse(code).html;
```

More about highlight-js: https://highlightjs.org/

#### Example with prism

```ts
import Prism from "prismjs";
import Textile, { type TextileExtension } from "textile-ts";

const code = `
bc(*js foo #bar)..
function foo(bar) {
  return bar
}
`;
// creating prism extension
const prismExtension: TextileExtension = {
  type: "syntaxHighlight",
  highlighter: "prismjs",
  function: (code, lang) => {
    return Prism.highlight(code, Prism.languages[lang], lang);
  },
};

const textile = new Textile();
const result = textile.use(prismExtension).parse(code).html;
```

More about prism : https://prismjs.com/

<!-- Definition -->

[textilejs]: https://github.com/borgar/textile-js
[textile-web]: https://textile-lang.com/
[borgar]: https://github.com/borgar
[biome]: https://biomejs.dev
[biome-check]: https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome
[npm-version]: https://img.shields.io/npm/v/textile-ts?logo=npm
[cover]: https://img.shields.io/badge/coverage-96.0-brightgreen?style=flat
[jsdocio]: https://www.jsdocs.io/package/textile-ts
[license]: LICENSE
