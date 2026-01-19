"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
          <TabsTrigger value="write" className="data-[state=active]:bg-white/10">
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-white/10">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-40 w-full rounded-md border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y font-mono text-sm"
          />
          <p className="mt-2 text-xs text-white/50">
            Supports Markdown syntax: **bold**, *italic*, `code`, [links](url), lists, etc.
          </p>
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="min-h-40 w-full rounded-md border border-white/10 bg-white/5 p-4 prose prose-invert prose-sm max-w-none [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_p]:text-white/80 [&_li]:text-white/80 [&_strong]:text-white [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-white/5 [&_pre]:p-3 [&_pre]:rounded [&_a]:text-blue-400 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-white/50 italic">{placeholder}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
