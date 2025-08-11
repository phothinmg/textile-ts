export type HighlightFunc = (code: string, lang: string) => string;
export type TextileExtensionFun = (...args: any[]) => TextileExtension;
interface SyntaxHighlightExtension {
	type: "syntaxHighlight";
	highlighter: "highlight.js" | "prismjs" | "shiki";
	function: HighlightFunc;
}
interface FakeExtension {
	type: "fake";
}
export type TextileExtension = SyntaxHighlightExtension | FakeExtension;
