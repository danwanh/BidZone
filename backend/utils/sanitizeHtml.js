import sanitizeHtml from "sanitize-html";

export const sanitizeDescription = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "b",
      "i",
      "em",
      "strong",
      "u",
      "ul",
      "ol",
      "li",
      "br",
      "span",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
};
