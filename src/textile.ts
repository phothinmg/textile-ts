import textileToJML from "./lib/textile-jml.js";
import jmlToHTML from "./lib/jml-html.js";

const textile = (raw: string, options?: { breaks: boolean }) => {
  const opts = options ?? { breaks: true };
  return jmlToHTML(textileToJML(raw, opts));
};

export default textile;
