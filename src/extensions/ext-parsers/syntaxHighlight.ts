import htmlToJML from "..//htmlToJLM/index.js";
import { isAttr } from "../../shares/helpers.js";
import type {
  JsonMLElement,
  JsonMLNode,
  JsonMLRoot,
} from "../../shares/types.js";

import type { HighlightFunc } from "../types.js";

const is_cb = (node: JsonMLNode) =>
  Array.isArray(node) &&
  node[0] === "pre" &&
  node.some((i) => Array.isArray(i) && i[0] === "code");

const findLang = (obj: Record<string, any>) => {
  let lang = null;
  if (obj) {
    const classKey = Object.keys(obj).find((i) => i === "class");

    if (classKey) {
      const classStr = obj[classKey]
        .split(" ")
        .find((i: string) => i.startsWith("language-"));
      if (classStr) {
        lang = classStr.split("-")[1];
      }
    }
  }

  return lang;
};

export const hljsAndPrismHighlight = (
  tree: JsonMLRoot,
  highlightFun: HighlightFunc
): JsonMLRoot => {
  return tree.map((node) => {
    if (Array.isArray(node) && is_cb(node)) {
      const foundCode = node.find((n) => Array.isArray(n) && n[0] === "code");
      let lang: string | null = null;
      let code: string | null = null;
      if (foundCode && isAttr(foundCode[1])) {
        const idx = node.indexOf(foundCode as JsonMLElement);
        lang = findLang(foundCode[1]);
        code = foundCode[2];
        if (lang && code) {
          const highlighted = highlightFun(code, lang);
          const newMl = htmlToJML(highlighted);
          const newNode = [foundCode[0], foundCode[1], ...newMl];
          node.splice(idx, 1, newNode);
        }
      }
    }
    return node;
  });
};
