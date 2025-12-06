"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, Copy, Download, Save } from "lucide-react"
import type { PostGenerationResponse, TextPost } from "@/lib/post-types"
import { PostForm } from "./post-form"
import { Header } from "./header"
import { ErrorBoundary } from "./error-boundary"
import { EditorContent } from "./editor-content"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

/**
 * Main orchestrator for the text post generator experience.
 *
 * Maintains the generated post data, handles editing, and swaps between
 * the dashboard and creation workflows.
 *
 * @example
 * ```tsx
 * <PostGenerator />
 * ```
 */
export function PostGenerator(): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  // Post-specific state with prefixes for clarity and isolation
  const [postData, setPostData] = useState<PostGenerationResponse | null>(null)
  const [postEditedContent, setPostEditedContent] = useState<string>("")
  const [postIsLoading, setPostIsLoading] = useState(false)
  const [postIsInitializing, setPostIsInitializing] = useState(true)
  const [postViewMode, setPostViewMode] = useState<"dashboard" | "creation">("dashboard")
  const [postSaveStatus, setPostSaveStatus] = useState<"saved" | "saving" | null>(null)
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const [emojiSearch, setEmojiSearch] = useState("")
  
  const isOnPostPage = pathname?.includes("/dashboard/post") ?? false

  // Extended emojis with keywords for search
  const EMOJI_WITH_KEYWORDS: Array<{ emoji: string; keywords: string[] }> = [
    // Reactions
    { emoji: "👍", keywords: ["thumbs up", "like", "good", "yes", "approve"] },
    { emoji: "❤️", keywords: ["heart", "love", "red heart"] },
    { emoji: "👏", keywords: ["clap", "applause", "congratulations"] },
    { emoji: "🙌", keywords: ["raise hands", "celebration", "hooray"] },
    { emoji: "🔥", keywords: ["fire", "hot", "trending", "lit"] },
    { emoji: "💯", keywords: ["hundred", "100", "perfect", "century"] },
    { emoji: "🎉", keywords: ["party", "celebration", "confetti"] },
    { emoji: "🌟", keywords: ["star", "sparkle", "favorite"] },
    { emoji: "✨", keywords: ["sparkles", "magic", "shine"] },
    { emoji: "💪", keywords: ["muscle", "strong", "power", "flex"] },
    { emoji: "👌", keywords: ["ok", "okay", "perfect", "good"] },
    { emoji: "🤝", keywords: ["handshake", "deal", "agreement"] },
    { emoji: "🙏", keywords: ["pray", "thanks", "please", "thank you"] },
    { emoji: "💖", keywords: ["sparkling heart", "love", "adore"] },
    { emoji: "💝", keywords: ["heart box", "gift", "present"] },
    { emoji: "🎊", keywords: ["confetti", "party", "celebration"] },
    { emoji: "🏆", keywords: ["trophy", "winner", "champion"] },
    { emoji: "🥇", keywords: ["gold medal", "first", "winner"] },
    { emoji: "🎯", keywords: ["target", "goal", "bullseye", "aim"] },
    { emoji: "💎", keywords: ["diamond", "gem", "precious"] },
    
    // Business
    { emoji: "💼", keywords: ["briefcase", "business", "work", "office"] },
    { emoji: "📈", keywords: ["chart", "growth", "increase", "trending up"] },
    { emoji: "📊", keywords: ["bar chart", "statistics", "data", "analytics"] },
    { emoji: "📱", keywords: ["mobile", "phone", "smartphone"] },
    { emoji: "💻", keywords: ["laptop", "computer", "pc"] },
    { emoji: "📞", keywords: ["phone", "call", "telephone"] },
    { emoji: "📧", keywords: ["email", "mail", "message"] },
    { emoji: "📝", keywords: ["memo", "note", "write", "document"] },
    { emoji: "📋", keywords: ["clipboard", "list", "checklist"] },
    { emoji: "📌", keywords: ["pin", "pushpin", "location"] },
    { emoji: "📍", keywords: ["location", "pin", "place", "map"] },
    { emoji: "💡", keywords: ["lightbulb", "idea", "inspiration", "bright"] },
    { emoji: "🔑", keywords: ["key", "access", "solution"] },
    { emoji: "⚡", keywords: ["lightning", "fast", "energy", "power"] },
    { emoji: "🚀", keywords: ["rocket", "launch", "fast", "growth", "startup"] },
    { emoji: "📦", keywords: ["package", "box", "delivery"] },
    { emoji: "💰", keywords: ["money bag", "cash", "wealth"] },
    { emoji: "💵", keywords: ["dollar", "money", "cash"] },
    { emoji: "💳", keywords: ["credit card", "payment", "card"] },
    
    // Success
    { emoji: "✅", keywords: ["check", "checkmark", "done", "complete", "yes"] },
    { emoji: "🎖️", keywords: ["medal", "award", "achievement"] },
    { emoji: "⭐", keywords: ["star", "favorite", "rating"] },
    { emoji: "👑", keywords: ["crown", "king", "queen", "royal"] },
    { emoji: "🏅", keywords: ["medal", "sports", "award"] },
    { emoji: "🎁", keywords: ["gift", "present", "box"] },
    { emoji: "🎈", keywords: ["balloon", "party", "celebration"] },
    { emoji: "🎪", keywords: ["circus", "tent", "entertainment"] },
    
    // Ideas
    { emoji: "🔍", keywords: ["magnifying glass", "search", "find", "look"] },
    { emoji: "🔎", keywords: ["magnifying glass", "search", "investigate"] },
    { emoji: "💭", keywords: ["thought", "think", "idea", "bubble"] },
    { emoji: "🧠", keywords: ["brain", "think", "smart", "intelligence"] },
    { emoji: "🔮", keywords: ["crystal ball", "future", "predict"] },
    { emoji: "🎨", keywords: ["art", "paint", "creative", "design"] },
    { emoji: "✍️", keywords: ["writing", "write", "pen"] },
    { emoji: "📚", keywords: ["books", "library", "study", "learn"] },
    { emoji: "📖", keywords: ["book", "read", "story"] },
    { emoji: "📄", keywords: ["page", "document", "paper"] },
    { emoji: "📃", keywords: ["page", "document"] },
    { emoji: "📑", keywords: ["bookmark", "marker"] },
    { emoji: "🔖", keywords: ["bookmark", "save", "mark"] },
    { emoji: "🗺️", keywords: ["map", "location", "travel"] },
    { emoji: "🧭", keywords: ["compass", "direction", "navigate"] },
    
    // Communication
    { emoji: "💬", keywords: ["speech", "chat", "message", "talk"] },
    { emoji: "📢", keywords: ["megaphone", "announce", "loud"] },
    { emoji: "📣", keywords: ["megaphone", "announce"] },
    { emoji: "🔔", keywords: ["bell", "notification", "alert"] },
    { emoji: "📮", keywords: ["mailbox", "post", "mail"] },
    { emoji: "✉️", keywords: ["envelope", "email", "mail", "letter"] },
    { emoji: "📨", keywords: ["incoming", "mail", "message"] },
    { emoji: "💌", keywords: ["love letter", "romance", "mail"] },
    { emoji: "📬", keywords: ["mailbox", "open", "mail"] },
    { emoji: "📭", keywords: ["mailbox", "closed", "mail"] },
    { emoji: "📪", keywords: ["mailbox", "mail"] },
    { emoji: "📫", keywords: ["mailbox", "flag", "mail"] },
    { emoji: "📯", keywords: ["postal horn", "mail"] },
    { emoji: "📡", keywords: ["satellite", "signal", "antenna"] },
    { emoji: "📻", keywords: ["radio", "broadcast"] },
    { emoji: "📺", keywords: ["tv", "television", "watch"] },
    { emoji: "📹", keywords: ["video camera", "record", "film"] },
    { emoji: "🎙️", keywords: ["microphone", "mic", "record", "podcast"] },
    { emoji: "🎤", keywords: ["microphone", "sing", "karaoke"] },
    
    // Growth
    { emoji: "🌱", keywords: ["seedling", "plant", "grow", "new"] },
    { emoji: "🌿", keywords: ["herb", "plant", "green"] },
    { emoji: "🌳", keywords: ["tree", "nature", "big"] },
    { emoji: "🌲", keywords: ["evergreen", "tree", "pine"] },
    { emoji: "🌴", keywords: ["palm tree", "beach", "tropical"] },
    { emoji: "🌵", keywords: ["cactus", "desert"] },
    { emoji: "🌾", keywords: ["rice", "harvest", "farm"] },
    { emoji: "🌷", keywords: ["tulip", "flower", "spring"] },
    { emoji: "🌹", keywords: ["rose", "flower", "love", "romance"] },
    { emoji: "🌺", keywords: ["hibiscus", "flower"] },
    { emoji: "🌻", keywords: ["sunflower", "flower", "sun"] },
    { emoji: "🌼", keywords: ["blossom", "flower"] },
    { emoji: "🌸", keywords: ["cherry blossom", "flower", "spring"] },
    { emoji: "🌍", keywords: ["earth", "world", "globe", "planet"] },
    { emoji: "🌎", keywords: ["earth", "americas", "globe"] },
    { emoji: "🌏", keywords: ["earth", "asia", "globe"] },
    { emoji: "⛰️", keywords: ["mountain", "peak", "climb"] },
    { emoji: "🏔️", keywords: ["snow mountain", "peak", "winter"] },
    
    // Time
    { emoji: "⏰", keywords: ["alarm clock", "time", "wake up"] },
    { emoji: "⏱️", keywords: ["stopwatch", "timer", "time"] },
    { emoji: "⏲️", keywords: ["timer", "clock", "time"] },
    { emoji: "🕐", keywords: ["one oclock", "1", "time"] },
    { emoji: "🕑", keywords: ["two oclock", "2", "time"] },
    { emoji: "🕒", keywords: ["three oclock", "3", "time"] },
    { emoji: "🕓", keywords: ["four oclock", "4", "time"] },
    { emoji: "🕔", keywords: ["five oclock", "5", "time"] },
    { emoji: "🕕", keywords: ["six oclock", "6", "time"] },
    { emoji: "🕖", keywords: ["seven oclock", "7", "time"] },
    { emoji: "🕗", keywords: ["eight oclock", "8", "time"] },
    { emoji: "🕘", keywords: ["nine oclock", "9", "time"] },
    { emoji: "🕙", keywords: ["ten oclock", "10", "time"] },
    { emoji: "🕚", keywords: ["eleven oclock", "11", "time"] },
    { emoji: "🕛", keywords: ["twelve oclock", "12", "time"] },
    { emoji: "📅", keywords: ["calendar", "date", "schedule"] },
    { emoji: "📆", keywords: ["calendar", "tear off", "date"] },
    { emoji: "🗓️", keywords: ["calendar", "spiral", "date"] },
    { emoji: "⏳", keywords: ["hourglass", "time", "wait"] },
    { emoji: "⌛", keywords: ["hourglass", "done", "time"] },
    
    // Actions
    { emoji: "❌", keywords: ["cross", "no", "wrong", "cancel", "delete"] },
    { emoji: "⚠️", keywords: ["warning", "alert", "caution"] },
    { emoji: "🔴", keywords: ["red circle", "red", "stop"] },
    { emoji: "🟢", keywords: ["green circle", "green", "go"] },
    { emoji: "🟡", keywords: ["yellow circle", "yellow", "caution"] },
    { emoji: "🔵", keywords: ["blue circle", "blue"] },
    { emoji: "🟣", keywords: ["purple circle", "purple"] },
    { emoji: "⚫", keywords: ["black circle", "black"] },
    { emoji: "⚪", keywords: ["white circle", "white"] },
    { emoji: "🟤", keywords: ["brown circle", "brown"] },
    { emoji: "🔶", keywords: ["orange diamond", "orange"] },
    { emoji: "🔷", keywords: ["blue diamond", "blue"] },
    { emoji: "🔸", keywords: ["small orange diamond", "orange"] },
    { emoji: "🔹", keywords: ["small blue diamond", "blue"] },
    { emoji: "🔺", keywords: ["red triangle", "up", "red"] },
    { emoji: "🔻", keywords: ["red triangle", "down", "red"] },
    { emoji: "💠", keywords: ["diamond", "shape", "blue"] },
    { emoji: "🔘", keywords: ["button", "radio", "select"] },
    
    // Technology
    { emoji: "🖥️", keywords: ["desktop", "computer", "monitor"] },
    { emoji: "⌨️", keywords: ["keyboard", "type", "computer"] },
    { emoji: "🖱️", keywords: ["mouse", "computer", "click"] },
    { emoji: "🖨️", keywords: ["printer", "print", "paper"] },
    { emoji: "📲", keywords: ["mobile", "arrow", "download"] },
    { emoji: "☎️", keywords: ["telephone", "phone", "call"] },
    { emoji: "📟", keywords: ["pager", "beeper"] },
    { emoji: "📠", keywords: ["fax", "machine"] },
    { emoji: "🔌", keywords: ["plug", "electric", "power"] },
    { emoji: "🔦", keywords: ["flashlight", "torch", "light"] },
    { emoji: "🕯️", keywords: ["candle", "light", "flame"] },
    { emoji: "🧯", keywords: ["fire extinguisher", "fire", "safety"] },
    { emoji: "🛢️", keywords: ["oil", "drum", "barrel"] },
    { emoji: "💿", keywords: ["cd", "disc", "music"] },
    { emoji: "💾", keywords: ["floppy disk", "save", "storage"] },
    { emoji: "📀", keywords: ["dvd", "disc", "movie"] },
    
    // Misc
    { emoji: "🎭", keywords: ["theater", "drama", "masks"] },
    { emoji: "🎬", keywords: ["clapper", "movie", "film"] },
    { emoji: "🎧", keywords: ["headphones", "music", "listen"] },
    { emoji: "🎵", keywords: ["musical note", "music", "song"] },
    { emoji: "🎶", keywords: ["notes", "music", "melody"] },
    { emoji: "🎼", keywords: ["score", "music", "sheet"] },
    { emoji: "🎹", keywords: ["piano", "keyboard", "music"] },
    { emoji: "🥁", keywords: ["drum", "music", "beat"] },
    { emoji: "🎷", keywords: ["saxophone", "music", "jazz"] },
    { emoji: "🎺", keywords: ["trumpet", "music", "brass"] },
    { emoji: "🎸", keywords: ["guitar", "music", "rock"] },
    { emoji: "🎻", keywords: ["violin", "music", "classical"] },
    { emoji: "🎲", keywords: ["dice", "game", "random", "luck"] },
    { emoji: "🎳", keywords: ["bowling", "game", "strike"] },
    { emoji: "🎮", keywords: ["video game", "game", "play", "controller"] },
    { emoji: "🕹️", keywords: ["joystick", "game", "arcade"] },
  ]

  // Extract emojis and create search index
  const ALL_EMOJIS = EMOJI_WITH_KEYWORDS.map(item => item.emoji)
  
  // Filter emojis based on search (search in emoji itself and keywords)
  const filteredEmojis = emojiSearch
    ? EMOJI_WITH_KEYWORDS
        .filter(item => {
          const searchLower = emojiSearch.toLowerCase()
          return (
            item.emoji.includes(emojiSearch) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
          )
        })
        .map(item => item.emoji)
    : ALL_EMOJIS

  const insertEmoji = (emoji: string): void => {
    // Find the textarea element
    const textarea = document.querySelector('textarea[placeholder="Start writing..."]') as HTMLTextAreaElement
    if (!textarea) {
      // Fallback: insert at the end
      setPostEditedContent(postEditedContent + emoji)
      setIsEmojiOpen(false)
      return
    }

    const start = textarea.selectionStart || postEditedContent.length
    const end = textarea.selectionEnd || postEditedContent.length
    const newContent = postEditedContent.substring(0, start) + emoji + postEditedContent.substring(end)
    
    setPostEditedContent(newContent)
    
    // Set cursor position after inserted emoji
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + emoji.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
    
    setIsEmojiOpen(false)
  }

  useEffect(() => {
    // Check for post data from localStorage immediately on mount
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("generatedPostData")
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData) as PostGenerationResponse
          setPostData(parsed)
          setPostEditedContent(parsed.content)
          setPostViewMode("creation")
          setPostIsInitializing(false)
        } catch (error) {
          console.error("Error parsing stored post data:", error)
          setPostIsInitializing(false)
        }
      } else {
        // No data found - check if we're on post page, if so redirect
        if (isOnPostPage) {
          router.push("/dashboard")
          return
        }
        setPostIsInitializing(false)
      }
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (postData) {
      setPostEditedContent(postData.content)
    }
  }, [postData])

  // Auto-save functionality
  useEffect(() => {
    if (!postData || !postEditedContent || postIsInitializing) return

    setPostSaveStatus("saving")
    
    // Save to localStorage with debounce
    const timeoutId = setTimeout(() => {
      if (typeof window !== "undefined") {
        const dataToSave: PostGenerationResponse = {
          topic: postData.topic,
          platform: postData.platform,
          content: postEditedContent,
          summary: postData.summary,
        }
        localStorage.setItem("generatedPostData", JSON.stringify(dataToSave))
        setPostSaveStatus("saved")
        
        // Clear saved status after 2 seconds
        setTimeout(() => setPostSaveStatus(null), 2000)
      }
    }, 1000) // Debounce 1 second

    return () => clearTimeout(timeoutId)
  }, [postEditedContent, postData, postIsInitializing])

  const handleGenerate = (data: PostGenerationResponse): void => {
    setPostData(data)
    setPostEditedContent(data.content)
    setPostViewMode("creation")
  }

  const handleBack = (): void => {
    // Clear stored data when going back
    if (typeof window !== "undefined") {
      localStorage.removeItem("generatedPostData")
    }
    setPostViewMode("dashboard")
    setPostData(null)
    setPostEditedContent("")
    // Redirect to dashboard if we're on the post page
    if (isOnPostPage) {
      router.push("/dashboard")
    }
  }

  const handleCopy = async (): void => {
    try {
      await navigator.clipboard.writeText(postEditedContent)
      toast.success("Post copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy post")
      console.error("Copy error:", error)
    }
  }

  const handleDownload = (): void => {
    if (!postData) return
    
    const blob = new Blob([postEditedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${postData.topic.replace(/\s+/g, "-").toLowerCase()}-post.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Post downloaded!")
  }

  const handleSave = (): void => {
    if (!postData) return
    
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]")
    const newPost: TextPost = {
      id: `post-${Date.now()}`,
      topic: postData.topic,
      platform: postData.platform,
      content: postEditedContent,
      summary: postData.summary,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    savedPosts.push(newPost)
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts))
    toast.success("Post saved!")
    // Exit after saving
    handleBack()
  }

  const handleRegenerate = async (): Promise<void> => {
    if (!postData) return
    
    setPostIsLoading(true)
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: postData.topic,
          platform: postData.platform,
          goal: postData.summary || "",
          tone: undefined,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        toast.error("Regeneration failed", {
          description: errorText || "Could not regenerate post. Please try again.",
        })
        setPostIsLoading(false)
        return
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const data = await response.json() as PostGenerationResponse
        setPostData(data)
        setPostEditedContent(data.content)
        toast.success("Post regenerated!")
      } else {
        // Handle streaming response if needed
        const reader = response.body?.getReader()
        if (reader) {
          let fullText = ""
          const decoder = new TextDecoder()
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            fullText += decoder.decode(value, { stream: true })
          }
          
          try {
            const data = JSON.parse(fullText) as PostGenerationResponse
            setPostData(data)
            setPostEditedContent(data.content)
            toast.success("Post regenerated!")
          } catch (error) {
            console.error("Error parsing streamed response:", error)
            toast.error("Failed to parse response")
          }
        }
      }
    } catch (error) {
      console.error("Regeneration error:", error)
      toast.error("Failed to regenerate post")
    } finally {
      setPostIsLoading(false)
    }
  }

  // Show loading state while initializing to avoid showing form before data loads
  // Also check if we're on /dashboard/post page - if so, we should have data, don't show form
  if (postIsInitializing || (isOnPostPage && !postData)) {
    return (
      <ErrorBoundary componentName="PostGenerator">
        <div className="min-h-screen bg-background">
          <Header />
          {/* Post Title Section - similar to carousel dashboard */}
          <div className="border-b border-border px-6 py-4 bg-background">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Text Post</span>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  // Never show form on /dashboard/post page - only show results
  if (postViewMode === "dashboard" && !isOnPostPage) {
    return (
      <ErrorBoundary componentName="PostGenerator">
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Generate Text Post</h1>
                <p className="text-muted-foreground">
                  Create high-performing LinkedIn text posts with AI
                </p>
              </div>
              <PostForm onGenerate={handleGenerate} postIsLoading={postIsLoading} setPostIsLoading={setPostIsLoading} />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
  
  // If on post page but no data, show loading (should redirect)
  if (isOnPostPage && !postData) {
    return (
      <ErrorBoundary componentName="PostGenerator">
        <div className="min-h-screen bg-background">
          <Header />
          {/* Post Title Section - similar to carousel dashboard */}
          <div className="border-b border-border px-6 py-4 bg-background">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Text Post</span>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary componentName="PostGenerator">
      <div className="min-h-screen bg-background">
        <Header 
          topic={postData?.topic} 
          saveStatus={postSaveStatus}
        />
        {/* Post Title Section with actions - similar to carousel dashboard */}
        <div className="border-b border-border px-6 py-4 bg-background">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Generator
              </Button>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">{postEditedContent.length} characters</span>
            </div>
            <div className="flex items-center gap-2">
              <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="p-2 text-lg"
                    title="Insert emoji"
                  >
                    😊
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-3" align="end">
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Search emojis..."
                      value={emojiSearch}
                      onChange={(e) => setEmojiSearch(e.target.value)}
                      className="w-full"
                    />
                    <div className="max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-8 gap-2">
                        {filteredEmojis.map((emoji, index) => (
                          <button
                            key={`${emoji}-${index}`}
                            type="button"
                            onClick={() => insertEmoji(emoji)}
                            className="p-2 text-xl hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      {filteredEmojis.length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          No emojis found
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="p-2"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="p-2"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
              <div className="relative">
                {/* Animated gradient border */}
                <div
                  className="absolute -inset-[2px] rounded-lg opacity-75 blur-[2px]"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                    backgroundSize: "300% 100%",
                    animation: "borderRun 3s linear infinite",
                  }}
                />
                {/* Button */}
                <button
                  onClick={handleRegenerate}
                  disabled={postIsLoading}
                  className="relative px-4 py-2 rounded-lg bg-background text-foreground text-sm font-medium cursor-pointer hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Regenerate
                </button>
              </div>
              <Button
                variant="secondary"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save & Exit
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Post editor */}
            <EditorContent content={postEditedContent} onChange={setPostEditedContent} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

