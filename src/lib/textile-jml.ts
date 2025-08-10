import Constants from "../shares/constants.js";
import { regexp } from "../shares/re.js";
import ReTests from "../shares/retest.js";
import type {
	CloseToken,
	JsonMLAttributes,
	JsonMLNode,
	JsonMLRoot,
	OpenToken,
	Options,
	TagName,
	Token,
} from "../shares/types.js";
import { Builder, Ribbon } from "./builder.js";
import {
	copyAttr,
	fixLinks,
	parseAttr,
	parseHtml,
	parseHtmlAttr,
	parseInline,
	parseList,
	parseTable,
	tokenize,
} from "./parsers.js";

// ===================================================================================//

const allowedBlockTags = {
	p: 0,
	hr: 0,
	ul: 1,
	ol: 0,
	li: 0,
	div: 1,
	pre: 0,
	object: 1,
	script: 0,
	noscript: 0,
	blockquote: 1,
	notextile: 1,
};
const hasOwn = Object.prototype.hasOwnProperty;
/**
 * Parse a given string of source text into a JSON-ML definition list,
 * handling various textile markup and HTML elements.
 *
 * @param src - The source string to be parsed, containing a definition list.
 * @param options - Optional parsing options that may influence processing,
 *                  such as enabling line breaks.
 *
 * @returns A JSON-ML node representing the parsed definition list.
 *
 * The function iterates over the source text, identifying and processing
 * different elements such as definition terms and definitions.
 * It utilizes regular expressions to match specific patterns and constructs
 * corresponding JSON-ML nodes, which are collected and returned as the result.
 */
function parseDefList(src: string, options?: Options) {
	const ribbon = new Ribbon(src.trim());
	const defList = ["dl", "\n"];
	let m: RegExpExecArray | null = null;
	let terms: string[] = [];
	let def: string = "";
	// Use the correct regex for definition lists
	while ((m = regexp.reItem_DefList.exec(src))) {
		// m[1] = terms, m[2] = definition
		terms = m[1].split(/(?:^|\n)- /).filter(Boolean);
		while (terms.length) {
			defList.push(
				"\t",
				["dt"].concat(
					parseInline(terms.shift()?.trim() as string, options) as any,
				) as any,
				"\n",
			);
		}
		def = m[2].trim();
		defList.push(
			"\t",
			["dd"].concat(
				/=:$/.test(def)
					? textileToJML(def.slice(0, -2).trim(), options)
					: (parseInline(def, options) as any),
			) as any,
			"\n",
		);
		ribbon.advance(m[0]);
		src = ribbon.toString();
	}
	return defList;
}

/**
 * Extends a target object with properties from one or more source objects.
 * Properties from later source objects overwrite earlier ones.
 *
 * @param target - The target object to be extended.
 * @param args - One or more source objects containing properties to merge
 *               into the target object.
 * @returns The modified target object with merged properties.
 */

export function extend(target: Record<string, any>, ...args: any[]) {
	for (let i = 1; i < args.length; i++) {
		const src = args[i];
		if (src != null) {
			for (const nextKey in src) {
				if (hasOwn.call(src, nextKey)) {
					target[nextKey] = src[nextKey];
				}
			}
		}
	}
	return target;
}
/**
 * Converts a given string into an array of JSON-ML nodes, representing paragraphs.
 * Splits the input string by two or more newlines, processes each segment, and
 * constructs nodes with inline content.
 *
 * @param s - The source string to be processed into paragraphs.
 * @param tag - Optional HTML tag name to wrap each paragraph. Defaults to "p".
 * @param pba - Optional attributes to apply to the paragraph tag.
 * @param linebreak - Optional string to insert between paragraphs.
 * @param options - Additional parsing options.
 *
 * @returns An array of JSON-ML nodes representing the paragraphs.
 */

function paragraph(
	s: string,
	tag?: TagName,
	pba?: JsonMLAttributes,
	linebreak?: string,
	options?: Options,
) {
	tag = tag || "p";
	let out: any[] = [];
	s.split(/(?:\r?\n){2,}/).forEach((bit, i) => {
		if (tag === "p" && /^\s/.test(bit)) {
			// no-paragraphs
			bit = bit.replace(/\r?\n[\t ]/g, " ").trim();
			out = out.concat(parseInline(bit, options));
		} else {
			if (linebreak && i) {
				out.push(linebreak);
			}
			out.push(
				pba
					? [tag, pba].concat(parseInline(bit, options))
					: [tag].concat(parseInline(bit, options) as any),
			);
		}
	});
	return out;
}

/**
 * Converts a Textile-formatted string into a JsonML (JSON Markup Language) tree.
 *
 * This function parses the given Textile markup and returns its representation as a JsonMLRoot,
 * which can be used for further processing or rendering as HTML or other formats.
 *
 * @param src - The Textile source string to be converted.
 * @param option - Optional parsing options. If not provided, defaults to `{ breaks: true }`.
 * @returns The root of the JsonML tree representing the parsed Textile content.
 *
 * @example
 * ```typescript
 * import textileToJML from './textile-jml';
 *
 * const textile = "h1. Hello World\n\nThis is *Textile* markup.";
 * const jml = textileToJML(textile);
 * console.log(JSON.stringify(jml, null, 2));
 * ```
 */
export default function textileToJML(
	src: string,
	option?: Options,
): JsonMLRoot {
	const options = option ? option : { breaks: true };
	const list = new Builder();
	let linkRefs = <Record<string, any>>{};
	let m: RegExpExecArray | null = null;

	const ribbon = new Ribbon(src.replace(/^( *\r?\n)+/, ""));
	// loop
	while (ribbon.valueOf()) {
		ribbon.save();
		src = ribbon.toString();
		// link_ref -- this goes first because it shouldn't trigger a linebreak
		if ((m = regexp.reLinkRef.exec(src))) {
			if (!linkRefs) {
				linkRefs = {};
			}
			ribbon.advance(m[0]);
			src = ribbon.toString();
			linkRefs[m[1]] = m[2];
			continue;
		}
		// add linebreak
		list.linebreak();
		// named block
		if ((m = regexp.reBlock.exec(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			const blockType = m[0] as TagName;
			let pba = parseAttr(src, blockType) as any;

			if (pba) {
				ribbon.advance(pba[0] as any);
				src = ribbon.toString();
				pba = pba[1] as any;
			}
			if ((m = /^\.(\.?)(?:\s|(?=:))/.exec(src))) {
				// FIXME: this whole copyAttr seems rather strange?
				// slurp rest of block
				const extended = !!m[1];
				let reBlockGlob = extended
					? regexp.reBlockExtended
					: regexp.reBlockNormal;
				if (blockType === "bc" || blockType === "pre") {
					reBlockGlob = extended
						? regexp.reBlockExtendedPre
						: regexp.reBlockNormalPre;
				}
				m = reBlockGlob.exec(ribbon.advance(m[0])) as RegExpExecArray;
				ribbon.advance(m[0]);
				// bq | bc | notextile | pre | h# | fn# | p | ###
				if (blockType === "bq") {
					let inner = m[1];
					if ((m = /^:(\S+)\s+/.exec(inner))) {
						if (!pba) {
							pba = {};
						}
						pba.cite = m[1];
						inner = inner.slice(m[0].length);
					}
					// RedCloth adds all attr to both: this is bad because it produces duplicate IDs
					const par = paragraph(
						inner,
						"p",
						copyAttr(pba, { cite: 1, id: 1 }),
						"\n",
						options,
					);
					list.add(
						["blockquote", pba, "\n"].concat(par).concat(["\n"]) as JsonMLNode,
					);
				} else if (blockType === "bc") {
					const subPba = pba ? copyAttr(pba, { id: 1 }) : null;
					list.add([
						"pre",
						pba,
						subPba ? ["code", subPba, m[1]] : ["code", m[1]],
					] as JsonMLNode);
				} else if (blockType === "notextile") {
					list.merge(parseHtml(tokenize(m[1])));
				} else if (blockType === "###") {
					// ignore the insides
				} else if (blockType === "pre") {
					// I disagree with RedCloth, but agree with PHP here:
					// "pre(foo#bar).. line1\n\nline2" prevents multiline preformat blocks
					// ...which seems like the whole point of having an extended pre block?
					list.add(["pre", pba, m[1]] as any);
				} else if (regexp.reFootnoteDef.test(blockType)) {
					// footnote
					// Need to be careful: RedCloth fails "fn1(foo#m). footnote" -- it confuses the ID
					const fnId = blockType.replace(/\D+/g, "");
					if (!pba) {
						pba = {};
					}
					pba.class = `${pba.class ? `${pba.class} ` : ""}footnote`;
					pba.id = `fn${fnId}`;
					list.add(
						[
							"p",
							pba,
							["a", { href: `#fnr${fnId}` }, ["sup", fnId]],
							" ",
						].concat(parseInline(m[1], options)) as JsonMLNode,
					);
				} else {
					// heading | paragraph
					list.merge(paragraph(m[1], blockType, pba, "\n", options));
				}
				continue;
			} else {
				ribbon.load();
				src = ribbon.toString();
			}
		}
		// HTML comment
		if ((m = ReTests.testComment(src))) {
			ribbon.advance(m[0] + (/(?:\s*\n+)+/.exec(src) || [])[0]);
			src = ribbon.toString();
			list.add(["!", m[1]]);
			continue;
		}
		// block HTML
		if ((m = ReTests.testOpenTagBlock(src))) {
			const tag = m[1];

			// Is block tag? ...
			if (tag in allowedBlockTags) {
				if (m[3] || tag in Constants.singletons) {
					// single?
					ribbon.advance(m[0]);
					src = ribbon.toString();
					if (/^\s*(\n|$)/.test(src)) {
						const elm = [tag];
						if (m[2]) {
							elm.push(parseHtmlAttr(m[2]) as any);
						}
						list.add(elm as JsonMLNode);
						ribbon.skipWS();
						src = ribbon.toString();
						continue;
					}
				} else if (tag === "pre") {
					const t = tokenize(src, { pre: 1, code: 1 }, tag);
					const p = parseHtml(t, true);
					ribbon.load().advance(p.sourceLength);
					src = ribbon.toString();
					if (/^\s*(\n|$)/.test(src)) {
						list.merge(p);
						ribbon.skipWS(); // skip tailing whitespace
						src = ribbon.toString();
						continue;
					}
				} else if (tag === "notextile") {
					// merge all child elements
					const t = tokenize(src, {}, tag);
					let s = 1; // start after open tag
					while (/^\s+$/.test(t[s].src)) {
						s++; // skip whitespace
					}
					const p = parseHtml(t.slice(s, -1), true);
					const x = t.pop();
					ribbon.load().advance((x as Token).pos + (x as Token).src.length);
					src = ribbon.toString();
					if (/^\s*(\n|$)/.test(src)) {
						list.merge(p);
						ribbon.skipWS(); // skip tailing whitespace
						src = ribbon.toString();
						continue;
					}
				} else {
					ribbon.skipWS();
					src = ribbon.toString();
					const t = tokenize(src, {}, tag);
					const x = t.pop(); // this should be the end tag
					let s = 1; // start after open tag
					while (t[s] && /^[\n\r]+$/.test(t[s].src)) {
						s++; // skip whitespace
					}
					if ((x as OpenToken | CloseToken).tag === tag) {
						// inner can be empty
						const inner =
							t.length > 1 ? src.slice(t[s].pos, (x as Token).pos) : "";
						ribbon.advance((x as Token).pos + (x as Token).src.length);
						src = ribbon.toString();
						if (/^\s*(\n|$)/.test(src)) {
							let elm = [tag];
							if (m[2]) {
								elm.push(parseHtmlAttr(m[2]) as any);
							}
							if (tag === "script" || tag === "style") {
								elm.push(inner as any);
							} else {
								const innerHTML = inner.replace(/^\n+/, "").replace(/\s*$/, "");
								const isBlock =
									/\n\r?\n/.test(innerHTML) || tag === "ol" || tag === "ul";
								const innerElm = isBlock
									? textileToJML(innerHTML, options)
									: parseInline(
											innerHTML,
											extend({}, options, { breaks: false }),
										);
								if (isBlock || /^\n/.test(inner)) {
									elm.push("\n" as any);
								}
								if (isBlock || /\s$/.test(inner)) {
									(innerElm as any[]).push("\n");
								}
								elm = elm.concat(innerElm as any);
							}

							list.add(elm as JsonMLNode);
							ribbon.skipWS(); // skip tailing whitespace
							src = ribbon.toString();
							continue;
						}
					}
				}
			}
			ribbon.load();
			src = ribbon.toString();
		}
		// ruler
		if ((m = regexp.reRuler.exec(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			list.add(["hr"]);
			continue;
		}

		// list
		if ((m = ReTests.testList(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			list.add(parseList(m[0], options));
			continue;
		}

		// definition list
		if ((m = ReTests.testDefList(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			list.add(parseDefList(m[0], options) as JsonMLNode);
			continue;
		}

		// table
		if ((m = ReTests.testTable(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			list.add(parseTable(m[1], options) as JsonMLNode);
			continue;
		}

		// paragraph
		m = regexp.reBlockNormal.exec(src) as RegExpExecArray;
		list.merge(paragraph(m[1], "p", undefined, "\n", options));
		ribbon.advance(m[0]);
		src = ribbon.toString();
	}
	return linkRefs ? fixLinks(list.get(), linkRefs) : list.get();
}
