"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"

const PostGenerator = dynamic(() => import("@/components/post-generator").then(mod => ({ default: mod.PostGenerator })), {
  loading: () => (
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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false,
})

function PostPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    // Check if we have post data in localStorage or URL params
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("generatedPostData")
      const postId = searchParams.get("id")
      
      // If we have a post ID, try to load it from saved posts
      if (postId) {
        const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]")
        const post = savedPosts.find((p: any) => p.id === postId)
        if (post) {
          // Store it as generatedPostData so PostGenerator can pick it up
          localStorage.setItem("generatedPostData", JSON.stringify({
            topic: post.topic,
            platform: post.platform,
            content: post.content,
            summary: post.summary,
          }))
          setHasData(true)
        } else {
          router.push("/dashboard")
        }
      } else if (storedData) {
        setHasData(true)
      } else {
        // No data and no ID, redirect to dashboard
        router.push("/dashboard")
      }
    }
  }, [router, searchParams])

  if (!hasData) {
    return (
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
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return <PostGenerator />
}

export default function PostPage() {
  return (
    <Suspense fallback={
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
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <PostPageContent />
    </Suspense>
  )
}

