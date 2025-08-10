import * as htmlparser2 from "htmlparser2";
import type {
	JsonMLElement,
	JsonMLNodes,
	JsonMLRoot,
	TagName,
} from "../../shares/types.js";

/**
 * Converts an HTML string into its equivalent JsonML (JSON Markup Language) representation.
 *
 * @param html - The HTML string to convert.
 * @returns The root JsonML structure representing the parsed HTML.
 *
 * @example
 * ```typescript
 * const html = '<div><p>Hello <b>world</b>!</p></div>';
 * const jml = htmlToJML(html);
 * // jml will be:
 * // [
 * //   [
 * //     "div",
 * //     [
 * //       "p",
 * //       "Hello ",
 * //       ["b", "world"],
 * //       "!"
 * //     ]
 * //   ]
 * // ]
 * ```
 */
const htmlToJML = (html: string) => {
	const result: JsonMLRoot = [];
	let current: any | null = null;
	const stack: JsonMLNodes = [];
	const parser = new htmlparser2.Parser(
		{
			onopentag(name, attribs) {
				const eln: JsonMLElement = [name as TagName];
				if (Object.keys(attribs).length > 0) {
					eln.push(attribs as any);
				}
				if (current) {
					(current as JsonMLNodes).push(eln);
					stack.push(current);
				} else {
					result.push(eln);
				}
				current = eln;
			},
			ontext(text) {
				if (current) {
					current.push(text);
				} else {
					result.push(text);
				}
			},
			onclosetag() {
				if (stack.length > 0) {
					current = stack.pop();
				} else {
					current = null;
				}
			},
		},
		{ decodeEntities: true },
	);
	parser.write(html);
	parser.end();
	return result;
};

export default htmlToJML;
