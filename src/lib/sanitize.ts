import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [...sanitizeHtml.defaults.allowedTags, "h1", "h2", "h3", "h4", "img", "span"];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  "*": ["class"],
  img: ["src", "alt", "width", "height", "loading"],
  a: ["href", "title", "target", "rel"],
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    // Force safe link targets
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
