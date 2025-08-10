import { load } from "js-yaml";

export interface FrontMatterResult<T = Record<string, any>> {
	data?: T;
	content?: string;
}
type MetaObject = {
	lines: string[];
	metaIndices: number[];
};
/**
 * Reducer function for `Array.prototype.reduce()` that accumulates an array of
 * indices where the frontmatter separator (`---`) is found in the input array
 * of strings.
 *
 * @param mem - The accumulating array of indices. Modified in-place.
 * @param item - The current string being processed.
 * @param i - The index of the current string in the input array.
 *
 * @returns The modified `mem` array.
 */
const findMetaIndices = (mem: number[], item: string, i: number) => {
	if (/^---/.test(item)) {
		mem.push(i);
	}

	return mem;
};

/**
 * Extracts the frontmatter object from a given string.
 *
 * @param {{ lines: string[], metaIndices: number[] }} input
 *   An object with two properties. The `lines` property is an array of strings,
 *   each representing a line in the input string. The `metaIndices` property is
 *   an array of numbers, representing the indices of the lines which contain the
 *   frontmatter separator (`---`).
 *
 * @returns An object containing the frontmatter data, or an empty object if no
 *   frontmatter is present.
 */
function getData<T extends Record<string, any> = Record<string, any>>({
	lines,
	metaIndices,
}: MetaObject) {
	const obj = {} as T;
	if (metaIndices.length > 1 && metaIndices[0] + 1 < metaIndices[1]) {
		const data = lines.slice(metaIndices[0] + 1, metaIndices[1]);
		return load(data.join("\n")) as T;
	}

	return obj;
}

/**
 * Returns the content of a given string, stripped of any frontmatter.
 *
 * @param obj - An object with two properties, `lines` and `metaIndices`, which
 *               are the result of {@linkcode findMetaIndices}.
 */
const getContent = ({ lines, metaIndices }: MetaObject): string => {
	if (metaIndices.length > 0) {
		lines = lines.slice(metaIndices[1] + 1, lines.length);
	}

	return lines.join("\n");
};

/**
 * Extracts frontmatter and content from a given string.
 *
 * @param str The string to parse.
 * @returns An object with two properties: `data`, which contains the parsed
 *          frontmatter, and `content`, which contains the remaining content.
 */
function frontmatter<T extends Record<string, any> = Record<string, any>>(
	str: string,
): FrontMatterResult<T> {
	const lines = str.split("\n");
	const metaIndices = lines.reduce(findMetaIndices, []);
	const data: T = getData({ lines, metaIndices });
	const content = getContent({ lines, metaIndices });
	return { data, content };
}

export default frontmatter;
