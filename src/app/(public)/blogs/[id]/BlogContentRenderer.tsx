"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "isomorphic-dompurify";

export default function BlogContentRenderer({ content }: { content: string }) {
  // Detect if content is HTML (has HTML tags) or Markdown
  const isHtml = /<[^>]+>/.test(content);

  if (isHtml) {
    // Legacy HTML content - sanitize and render
    const sanitized = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "a", "b", "strong", "i", "em", "u", "p", "br", "ul", "ol", "li",
        "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span", "div", 
        "code", "pre", "hr", "img",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt"],
    });
    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
  } else {
    // Markdown content - render with ReactMarkdown
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
  }
}
