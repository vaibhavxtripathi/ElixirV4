"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
  });

  const sanitizedValue = useMemo(() => {
    return DOMPurify.sanitize(value || "", { USE_PROFILES: { html: true } });
  }, [value]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== sanitizedValue) {
      editorRef.current.innerHTML = sanitizedValue || "";
    }
  }, [sanitizedValue]);

  function refreshActiveStates() {
    try {
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
      });
    } catch {}
  }

  function exec(command: string, valueArg?: string) {
    document.execCommand(command, false, valueArg);
    const html = editorRef.current?.innerHTML || "";
    onChange(DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }));
    refreshActiveStates();
  }

  function onInput() {
    const html = editorRef.current?.innerHTML || "";
    onChange(DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }));
    refreshActiveStates();
  }

  function insertLink() {
    const url = linkInputRef.current?.value?.trim();
    if (!url) return;
    try {
      const valid = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      exec("createLink", valid);
    } finally {
      if (linkInputRef.current) linkInputRef.current.value = "";
      setShowLink(false);
    }
  }

  useEffect(() => {
    const handler = () => refreshActiveStates();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  return (
    <div className={className}>
      <div className="relative flex flex-wrap items-center gap-1 rounded-md border border-white/10 bg-card/60 p-1">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${
              active.bold ? "bg-white/10 text-white" : "text-white/70"
            }`}
            onClick={() => exec("bold")}
            aria-label="Bold"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${
              active.italic ? "bg-white/10 text-white" : "text-white/70"
            }`}
            onClick={() => exec("italic")}
            aria-label="Italic"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${
              active.underline ? "bg-white/10 text-white" : "text-white/70"
            }`}
            onClick={() => exec("underline")}
            aria-label="Underline"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${
              active.ul ? "bg-white/10 text-white" : "text-white/70"
            }`}
            onClick={() => exec("insertUnorderedList")}
            aria-label="Bulleted list"
            title="Bulleted list"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`h-8 w-8 ${
              active.ol ? "bg-white/10 text-white" : "text-white/70"
            }`}
            onClick={() => exec("insertOrderedList")}
            aria-label="Numbered list"
            title="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white/70 hover:text-white"
            onClick={() => {
              setShowLink((s) => !s);
              setTimeout(() => linkInputRef.current?.focus(), 0);
            }}
            aria-label="Insert link"
            title="Insert link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        {showLink && (
          <div className="absolute right-1 top-10 z-10 flex items-center gap-2 rounded-md border border-white/10 bg-card/90 p-2 backdrop-blur">
            <Input
              ref={linkInputRef}
              placeholder="https://example.com"
              className="h-8 w-60 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") insertLink();
                if (e.key === "Escape") setShowLink(false);
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8"
              onClick={insertLink}
            >
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8"
              onClick={() => setShowLink(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={onInput}
        className="min-h-40 w-full rounded-md border border-white/10 bg-white/5 p-4 focus:outline-none prose prose-invert max-w-none [&_a]:underline"
        data-placeholder={placeholder || "Write your content..."}
        suppressContentEditableWarning
      />
    </div>
  );
}
