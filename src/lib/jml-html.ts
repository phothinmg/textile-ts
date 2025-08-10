import Constants from "../shares/constants.js";
import { escapeHTML, isAttr } from "../shares/helpers.js";
import type {
	JsonMLAttributes,
	JsonMLNode,
	JsonMLRoot,
	TagName,
} from "../shares/types.js";

/**
 * jmlNode2Html takes a single node in a JSON-ML tree and converts it to an HTML
 * string.
 *
 * @param node - the node to be converted
 * @returns an HTML string
 */
const jmlNode2Html = (node: JsonMLNode) => {
	if (typeof node === "string") {
		return escapeHTML(node);
	} else if (Array.isArray(node)) {
		const tag = node.shift();
		let attributes = <JsonMLAttributes>{};
		let tagAttrs = "";
		const content = <any[]>[];
		if (node.length && isAttr(node[0])) {
			attributes = node.shift() as JsonMLAttributes;
		}
		while (node.length) {
			content.push(jmlNode2Html(node.shift() as JsonMLNode));
		}
		for (const a in attributes) {
			tagAttrs +=
				attributes[a] == null
					? ` ${a}`
					: ` ${a}="${escapeHTML(String(attributes[a]), true)}"`;
		}
		// be careful about adding whitespace here for inline elements
		if (tag === "!") {
			return `<!--${content.join("")}-->`;
		} else if (
			Constants.voidTag.has(tag as TagName) ||
			(tag?.indexOf(":") > -1 && !content.length)
		) {
			return `<${tag}${tagAttrs} />`;
		} else {
			return `<${tag}${tagAttrs}>${content.join("")}</${tag}>`;
		}
	}
};

/**
 * Converts a JsonML tree to an HTML string.
 *
 * @param tree - The root of the JsonML tree to convert.
 * @returns The resulting HTML string.
 *
 * @example
 * ```typescript
 * const jsonML = [
 *   ["div", { class: "container" }, ["span", "Hello, world!"]]
 * ];
 * const html = jmlToHTML(jsonML);
 * // html: '<div class="container"><span>Hello, world!</span></div>'
 * ```
 */
const jmlToHTML = (tree: JsonMLRoot) => {
	return tree.map(jmlNode2Html).join("");
};

export default jmlToHTML;
