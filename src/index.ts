import highlightCodeBlock, {
	type HighlightFunc,
} from "./extensions/highlight-codeblock.js";
import frontmatter, { type FrontMatterResult } from "./frontmatter/index.js";
import htmlToJML from "./htmlToHtml/index.js";
import jmlToHTML from "./lib/jml-html.js";
import textileToJML from "./lib/textile-jml.js";
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
	codeBlockHighlightFunction?: HighlightFunc;
}
//const isPlainObj = (obj: any) => Object.keys(obj).length === 0;
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
		const { data, content }: FrontMatterResult<T> = frontmatter<T>(this._raw);
		if (data) this._data = data;
		if (!content) {
			throw new Error("ERROR: Textile raw string required");
		}
		this._tree = textileToJML(content, this._opts);
		if (this._opts.codeBlockHighlightFunction) {
			this._tree = highlightCodeBlock(
				this._tree,
				this._opts.codeBlockHighlightFunction,
			);
		}
		//
		this._html = jmlToHTML(this._tree);
	}
	parse(raw: string) {
		this._raw = raw;
		this._init();
		return {
			html: this._html,
			data: this._data,
		};
	}
	static htmlToJML(html: string): JsonMLNodes {
		return htmlToJML(html);
	}
	static frontmatter<T extends Record<string, any> = Record<string, any>>(
		raw: string,
	): FrontMatterResult<T> {
		return frontmatter<T>(raw);
	}
	static textToHTML(raw: string): string {
		return jmlToHTML(textileToJML(raw));
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
