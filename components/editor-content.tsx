"use client"

import { useRef, useEffect } from "react"

interface EditorContentProps {
  content: string
  onChange: (content: string) => void
}

export function EditorContent({ content, onChange }: EditorContentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing..."
          className="w-full resize-none bg-transparent text-lg leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          style={{ 
            minHeight: "calc(100vh - 200px)",
            fontFamily: "var(--font-lora), serif",
            lineHeight: "1.8",
          }}
        />
      </div>
    </div>
  )
}

