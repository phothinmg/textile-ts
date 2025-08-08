import {
  JsonMLAttributes,
  JsonMLElement,
  JsonMLNode,
  JsonMLNodes,
  JsonMLRoot,
  TagName,
} from "./shares/types.js";
import highlightCodeBlock, {
  type HighlightFunc,
} from "./highlight-codeblock.js";
import { matter, type MatterResult } from "./matter.js";
import textile2jml from "./textile-jml.js";
import { jml2html, html2jml } from "./html-jml.js";
export interface TextileOption {
  breaks?: boolean;
  codeBlockHighlightFunction?: HighlightFunc;
}
const isPlainObj = (obj: any) => Object.keys(obj).length === 0;
class Textile<T extends Record<string, any> = Record<string, any>> {
  private _opts: TextileOption;
  private _raw: string;
  private _data: T;
  private _tree: JsonMLRoot;
  private _html: string;
  constructor(options?: TextileOption) {
    this._opts = {
      breaks: options?.breaks ?? true,
      codeBlockHighlightFunction:
        options?.codeBlockHighlightFunction ?? undefined,
    };
    this._raw = "";
    this._data = {} as T;
    this._tree = [];
    this._html = "";
  }
  private _init() {
    if (this._raw === "") {
      throw new Error("ERROR: Textile raw string required");
    }
    const { data, content }: MatterResult<T> = matter<T>(this._raw);
    if (data) this._data = data;
    if (!content) {
      throw new Error("ERROR: Textile raw string required");
    }
    this._tree = textile2jml(content, this._opts);
    if (this._opts.codeBlockHighlightFunction) {
      this._tree = highlightCodeBlock(
        this._tree,
        this._opts.codeBlockHighlightFunction
      );
    }
    //
    this._html = jml2html(this._tree);
  }
  parse(raw: string) {
    this._raw = raw;
    this._init();
    const _data = isPlainObj(this._data) ? {} : { data: this._data };
    return {
      html: this._html,
      ..._data,
    };
  }
  static htmlToJML(html: string): JsonMLNodes {
    return html2jml(html);
  }
  static frontmatter<T extends Record<string, any> = Record<string, any>>(
    raw: string
  ): MatterResult<T> {
    return matter<T>(raw);
  }
  static textToHTML(raw: string): string {
    return jml2html(textile2jml(raw));
  }
}

export type {
  JsonMLAttributes,
  JsonMLElement,
  JsonMLNode,
  JsonMLNodes,
  JsonMLRoot,
  TagName,
};

export default Textile;
