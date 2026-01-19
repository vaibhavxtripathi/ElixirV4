"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your blog content in Markdown...",
  className,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")}>
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger value="write" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-60 w-full rounded-md border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y font-mono text-sm leading-relaxed"
          />
          <div className="mt-2 p-3 rounded-md bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 mb-2">Markdown quick reference:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/40">
              <span><code className="bg-white/10 px-1 rounded"># Heading 1</code></span>
              <span><code className="bg-white/10 px-1 rounded">## Heading 2</code></span>
              <span><code className="bg-white/10 px-1 rounded">**bold**</code></span>
              <span><code className="bg-white/10 px-1 rounded">*italic*</code></span>
              <span><code className="bg-white/10 px-1 rounded">[link](url)</code></span>
              <span><code className="bg-white/10 px-1 rounded">`code`</code></span>
              <span><code className="bg-white/10 px-1 rounded">- list item</code></span>
              <span><code className="bg-white/10 px-1 rounded">1. numbered</code></span>
              <span><code className="bg-white/10 px-1 rounded">&gt; quote</code></span>
              <span><code className="bg-white/10 px-1 rounded">---</code> horizontal rule</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="min-h-60 w-full rounded-md border border-white/10 bg-white/5 p-6 overflow-auto">
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-3 text-white first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mt-5 mb-2 text-white">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-4 mb-2 text-white">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-semibold mt-3 mb-2 text-white">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-white/80 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 text-white/80 ml-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 text-white/80 ml-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-white/80">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500/50 pl-4 my-3 italic text-white/60">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={`${className} block`}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-black/40 border border-white/10 rounded-lg p-3 overflow-x-auto my-3 text-sm">
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
                  hr: () => <hr className="my-6 border-white/10" />,
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-white/90">{children}</em>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-white/40 italic">Preview will appear here...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
