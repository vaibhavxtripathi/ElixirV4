"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import DOMPurify from "isomorphic-dompurify";

interface BlogContentRendererProps {
  content: string;
}

export default function BlogContentRenderer({ content }: BlogContentRendererProps) {
  // Check if content appears to be HTML (has actual HTML structure, not just markdown)
  // More strict check - only consider it HTML if it has actual HTML document structure
  const hasHtmlStructure = /<(p|div|span|br|h[1-6]|ul|ol|li|strong|em|a|img)[^>]*>/i.test(content);
  
  // If content looks like it's from the old rich text editor (has HTML tags)
  if (hasHtmlStructure && !content.includes("# ") && !content.includes("## ")) {
    // Legacy HTML content - sanitize and render
    const sanitized = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "a", "b", "strong", "i", "em", "u", "p", "br", "ul", "ol", "li",
        "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span", "div", 
        "code", "pre", "hr", "img", "table", "thead", "tbody", "tr", "th", "td",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "src", "alt", "title"],
    });
    return (
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: sanitized }} 
      />
    );
  }
  
  // Markdown content - render with ReactMarkdown and proper plugins
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        // Custom components for better styling
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4 text-white">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-6 mb-3 text-white">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-5 mb-2 text-white">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mt-4 mb-2 text-white">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="mb-4 text-white/85 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-white/85 ml-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-white/85 ml-4">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-white/85">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500/50 pl-4 my-4 italic text-white/70">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300">
                {children}
              </code>
            );
          }
          return (
            <code className={`${className} block`} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto my-4 text-sm">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-8 border-white/10" />,
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/90">{children}</em>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-white/10 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-white/5">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-white border-b border-white/10">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-white/80 border-b border-white/5">
            {children}
          </td>
        ),
        img: ({ src, alt }) => (
          <img 
            src={src} 
            alt={alt || ""} 
            className="max-w-full h-auto rounded-lg my-4"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
