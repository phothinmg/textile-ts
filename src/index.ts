import frontmatter, { type FrontMatterResult } from "./frontmatter/index.js";
import jmlToHTML from "./lib/jml-html.js";
import textileToJML from "./lib/textile-jml.js";
import type {
  TextileExtension,
  TextileExtensionFun,
} from "./extensions/types.js";
import { hljsAndPrismHighlight } from "./extensions/ext-parsers/syntaxHighlight.js";
import type {
  JsonMLAttributes,
  JsonMLElement,
  JsonMLNode,
  JsonMLNodes,
  JsonMLRoot,
  TagName,
} from "./shares/types.js";
export interface TextileOption {
  breaks?: boolean;
  metaData?: boolean;
}
//const isPlainObj = (obj: any) => Object.keys(obj).length === 0;
class Textile {
  private _opts: TextileOption;
  private _raw: string;
  private _data: Record<string, any>;
  private _tree: JsonMLRoot;
  private _html: string;
  private _exts: TextileExtension[];
  constructor(options?: TextileOption) {
    this._opts = {
      breaks: options?.breaks ?? true,
      metaData: options?.metaData ?? false,
    };
    this._raw = "";
    this._data = {};
    this._tree = [];
    this._html = "";
    this._exts = [];
  }
  private _init() {
    if (this._raw === "") {
      throw new Error("ERROR: Textile raw string required");
    }
    if (this._opts.metaData) {
      const { data, content }: FrontMatterResult<Record<string, any>> =
        frontmatter<Record<string, any>>(this._raw);
      if (data) this._data = data;
      if (!content) {
        throw new Error("ERROR: Textile raw string required");
      }
      this._raw = content;
    }
    this._tree = textileToJML(this._raw, this._opts);
    if (this._exts.length) {
      const hlExts = this._exts.filter((i) => i.type === "syntaxHighlight");
      if (hlExts.length) {
        const ext = hlExts[0];
        if (
          ext.highlighter === "highlight.js" ||
          ext.highlighter === "prismjs"
        ) {
          this._tree = hljsAndPrismHighlight(this._tree, ext.function);
        }
      }
    }

    this._html = jmlToHTML(this._tree);
  }
  use(ext: TextileExtension | TextileExtensionFun) {
    if (typeof ext === "function") {
      this._exts.push(ext());
    } else {
      this._exts.push(ext);
    }

    return this;
  }
  parse(raw: string) {
    this._raw = raw;
    this._init();
    return this._opts.metaData
      ? { html: this._html, metaData: this._data }
      : { html: this._html };
  }
}

export type {
  JsonMLAttributes,
  JsonMLElement,
  JsonMLNode,
  JsonMLNodes,
  JsonMLRoot,
  TagName,
  TextileExtension,
};

export default Textile;
