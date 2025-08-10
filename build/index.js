#!/usr/bin/env node
import * as esbuild from "esbuild";
import { createRequire } from "node:module";
import { dtsPlugin } from "esbuild-plugin-d.ts";
import fs from "node:fs/promises";
import forceRemoveDir from "./forceRemoveDir.js";
//
const require = createRequire(import.meta.url);
const _package = require("../package.json");

const yn = new Date().getFullYear();
const yearNow = yn > 2025 ? `-${yn}` : "";

const bannerText = `
/*!
 * textile-ts v${_package.version} -- Copyright (c) 2025${yearNow} ${_package.author} -- license ${_package.license}
 *
 * Bundled dependencies information.
 *
 * textile-js :
 *            Author : Borgar - https://github.com/borgar
 *            LICENSE: MIT - https://github.com/borgar/textile-js/blob/master/LICENSE
 *            Github : https://github.com/borgar/textile-js
 */
`;
//
const pkJsonCjs = `
{
  "type": "commonjs"
}
`;
const pkJsonEsm = `
{
  "type": "module"
}
`;
//
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
//
//
const buildFns = [
  async function () {
    await forceRemoveDir(".dist");
  },
  async function () {
    await wait(1000);
    await esbuild
      .build({
        entryPoints: ["src/index.ts"],
        outdir: "./dist/esm",
        format: "esm",
        bundle: true,
        external: ["htmlparser2", "js-yaml"],
        treeShaking: true,
        sourcemap: true,
        banner: {
          js: bannerText,
        },
        plugins: [
          dtsPlugin({
            experimentalBundling: true,
          }),
        ],
      })
      .catch(() => process.exit(1));
  },
  async function () {
    await wait(1000);
    await esbuild
      .build({
        entryPoints: ["src/index.ts"],
        outdir: "./dist/commonjs",
        format: "cjs",
        bundle: true,
        external: ["htmlparser2", "js-yaml"],
        treeShaking: true,
        sourcemap: true,
        banner: {
          js: bannerText,
        },
        plugins: [
          dtsPlugin({
            experimentalBundling: true,
          }),
        ],
      })
      .catch(() => process.exit(1));
  },
  async function () {
    await wait(1000);
    await fs.writeFile("dist/commonjs/package.json", pkJsonCjs);
    await fs.writeFile("dist/esm/package.json", pkJsonEsm);
  },
];

// Executing arrays of async/await JavaScript functions in series vs. concurrently
// https://www.coreycleary.me/executing-arrays-of-async-await-javascript-functions-in-series-vs-concurrently/

// executing in series
const start = performance.now();
for await (const fn of buildFns) {
  await fn();
}
const end = performance.now();
console.log((end - start).toFixed(0));
// executing concurrently
//await Promise.all(buildFunctions.map((fn) => fn()));
