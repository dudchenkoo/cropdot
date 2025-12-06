"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Inter_Tight } from "next/font/google"
import { Eye, EyeOff, GripVertical, Trash2, Plus, Check, ChevronLeft, ChevronRight, Grid3x3, PaintBucket, Type, Layout, Maximize2, ArrowLeft, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, AlignVerticalDistributeCenter, Undo2, Redo2, X, Shuffle, Info, Bold, Italic, Underline, Strikethrough, ListOrdered, List, FileText, Images } from "lucide-react"
import type { CarouselData, Layer, Slide } from "@/lib/carousel-types"
import { isCarouselData } from "@/lib/carousel-types"
import { templates, type Template } from "@/lib/templates"
import {
  BACKGROUND_TYPES,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_TYPE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_HORIZONTAL_ALIGN,
  DEFAULT_PADDING,
  DEFAULT_PATTERN_OPACITY,
  DEFAULT_PATTERN_SCALE,
  DEFAULT_SIZE,
  DEFAULT_VERTICAL_ALIGN,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  LAYER_CONTENT_DEFAULTS,
  PADDING_RANGE,
  PATTERN_OPACITY_RANGE,
  PATTERN_SCALE_RANGE,
  PATTERN_TYPES,
  SIZE_OPTIONS,
} from "@/lib/constants"
import { generateLayerId, slideToLayers, getPatternBackground } from "@/lib/helpers"
import { loadCarousel, saveCarousel, deleteCarousel, type StoredCarousel } from "@/lib/storage"
import { CarouselForm } from "./carousel-form"
import { PostForm } from "./post-form"
import type { PostGenerationResponse } from "@/lib/post-types"
import { CarouselPreview } from "./carousel-preview"
import { SlideCard } from "./slide-card"
import { Header } from "./header"
import { ErrorBoundary } from "./error-boundary"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { canRedo, canUndo, createHistory, pushState, redo as redoHistory, undo as undoHistory, type HistoryState } from "@/lib/history"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  preload: false, // Load only when needed
})

/**
 * Main orchestrator for the carousel generator experience.
 *
 * Maintains the generated carousel data, handles layer- and slide-level CRUD
 * operations, and swaps between the dashboard and creation workflows. State is
 * primarily managed through `useState` hooks, which track carousel data,
 * selection, UI mode, and transient statuses. Interaction handlers update the
 * canonical `carouselData` state and mirror changes into a saved carousel list.
 *
 * @example
 * ```tsx
 * <CarouselGenerator />
 * ```
 */
export function CarouselGenerator(): JSX.Element {
  const { theme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const [history, setHistory] = useState<HistoryState<CarouselData | null>>(() => createHistory<CarouselData | null>(null, 50))
  const carouselData = history.present
  // Carousel-specific state with prefixes for clarity and isolation
  const [carouselIsLoading, setCarouselIsLoading] = useState(false)
  const [postIsLoading, setPostIsLoading] = useState(false) // For PostForm when used in CarouselGenerator
  const [carouselViewMode, setCarouselViewMode] = useState<"dashboard" | "creation">("dashboard")
  const [savedCarousels, setSavedCarousels] = useState<StoredCarousel[]>([])
  
  // Theme-aware dot pattern: light dots in dark mode, dark dots in light mode
  // Use default dark pattern until mounted to prevent hydration mismatch
  const dotPatternColor = mounted && theme === "dark" 
    ? `rgba(255, 255, 255, 0.08)` 
    : mounted && theme === "light"
    ? `rgba(0, 0, 0, 0.03)`
    : `rgba(255, 255, 255, 0.08)` // Default to dark pattern until mounted
  const [carouselSelectedSlideIndex, setCarouselSelectedSlideIndex] = useState<number>(0)
  const [carouselSelectedLayerId, setCarouselSelectedLayerId] = useState<string | null>(null)
  const [carouselDraggedLayerId, setCarouselDraggedLayerId] = useState<string | null>(null)
  const [carouselSavedStatus, setCarouselSavedStatus] = useState<string | null>(null)
  const [carouselSaveStatus, setCarouselSaveStatus] = useState<"saved" | "saving" | null>(null)
  const [carouselSelectedAction, setCarouselSelectedAction] = useState<"export" | "template" | "background" | "text" | "layout" | "size" | "info" | null>(null)
  const [applyToAllSlides, setApplyToAllSlides] = useState(false)
  const actionPanelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const backgroundColorPickerRef = useRef<HTMLInputElement>(null)
  const accentColorPickerRef = useRef<HTMLInputElement>(null)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [carouselToDelete, setCarouselToDelete] = useState<StoredCarousel | null>(null)
  const [contentType, setContentType] = useState<"carousel" | "post" | null>(null)
  const [creationStep, setCreationStep] = useState<"select-type" | "form" | "results">("select-type")

  const commitCarouselChange = useCallback(
    (updatedData: CarouselData, statusMessage?: string) => {
      // Set saving status
      setCarouselSaveStatus("saving")
      
      setHistory((current) => pushState(current, updatedData))

      // Set saved status after a short delay
      setTimeout(() => {
        setCarouselSaveStatus("saved")
        setTimeout(() => setCarouselSaveStatus(null), 2000)
      }, 300)

      if (statusMessage) {
        setCarouselSavedStatus(statusMessage)
        setTimeout(() => setCarouselSavedStatus(null), 1500)
      }
    },
    [],
  )

  useEffect(() => {
    setMounted(true)
    
    // Track window size for responsive texture
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    updateWindowSize()
    window.addEventListener("resize", updateWindowSize)
    
    return () => {
      window.removeEventListener("resize", updateWindowSize)
    }
  }, [])

  useEffect(() => {
    setSavedCarousels(loadCarousel())
  }, [])

  // Check for template carousel data from template page
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const templateCarouselData = localStorage.getItem("templateCarouselData")
    if (templateCarouselData) {
      try {
        const parsed = JSON.parse(templateCarouselData)
        if (isCarouselData(parsed) && parsed.slides && parsed.slides.length > 0) {
          setHistory(createHistory(parsed, 50))
          setCarouselSelectedSlideIndex(0)
          setCarouselSelectedLayerId(null)
          setCarouselViewMode("creation")
          setCreationStep("results")
          // Clear the stored template data
          localStorage.removeItem("templateCarouselData")
        }
      } catch (error) {
        console.error("Error loading template carousel data:", error)
        localStorage.removeItem("templateCarouselData")
      }
    }
  }, [])

  useEffect(() => {
    if (!carouselSelectedAction) return

    const panel = actionPanelRef.current
    if (!panel) return

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (!focusable.length) return

    previousFocusRef.current = (document.activeElement as HTMLElement) || null
    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]
    firstElement.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      if (focusable.length === 1) {
        event.preventDefault()
        firstElement.focus()
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [carouselSelectedAction])

  const handleGenerate = (data: CarouselData): void => {
    const dataWithLayers = {
      ...data,
      slides: data.slides.map((slide) => ({
        ...slide,
        layers: slide.layers?.length ? slide.layers : slideToLayers(slide),
      })),
    }

    // Check if a template was selected from the templates page
    let finalData = dataWithLayers
    if (typeof window !== "undefined") {
      const selectedTemplateId = localStorage.getItem("selectedTemplateId")
      if (selectedTemplateId) {
        const template = templates.find((t) => t.id === selectedTemplateId)
        if (template) {
          // Apply template to all slides
          finalData = {
            ...dataWithLayers,
            slides: dataWithLayers.slides.map((slide) => template.apply(slide)),
          }
          // Clear the stored template ID
          localStorage.removeItem("selectedTemplateId")
        }
      }
    }

    setHistory(createHistory(finalData, 50))
    setCarouselSelectedSlideIndex(0)
    setCarouselSelectedLayerId(null)
    setCarouselViewMode("creation")
    setCreationStep("results")
  }

  const handleSelectSlide = (index: number): void => {
    setCarouselSelectedSlideIndex(index)
    setCarouselSelectedLayerId(null)
  }

  const handleSaveCarousel = (): void => {
    if (!carouselData) return

    try {
      const savedEntry = saveCarousel(carouselData)
      setSavedCarousels((prev) => [savedEntry, ...prev])
      toast.success("LinkedIn post saved", {
        description: "Your high-performing LinkedIn content was saved.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save carousel."
      toast.error("Save failed", {
        description: message,
      })
    }
  }

  const handleLoadCarouselSelection = (entry: StoredCarousel): void => {
    setHistory(createHistory(entry.data, 50))
    setCarouselSelectedSlideIndex(0)
    setCarouselSelectedLayerId(null)
    setCarouselViewMode("creation")
    setIsLoadModalOpen(false)
  }

  const handleNewCarousel = (): void => {
    setCarouselViewMode("dashboard")
    setHistory(createHistory(null, 50))
    setCarouselSelectedSlideIndex(0)
    setCarouselSelectedLayerId(null)
    setCarouselSelectedAction(null)
  }

  const handleStartNewGeneration = (): void => {
    // Clear carousel data to show the creation form
    setHistory(createHistory(null, 50))
    setCarouselSelectedSlideIndex(0)
    setCarouselSelectedLayerId(null)
    setCarouselSelectedAction(null)
    setCarouselViewMode("creation")
  }

  const handleDeleteCarousel = (carousel: StoredCarousel, e: React.MouseEvent): void => {
    e.stopPropagation()
    setCarouselToDelete(carousel)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteCarousel = (): void => {
    if (!carouselToDelete) return

    try {
      deleteCarousel(carouselToDelete.id)
      setSavedCarousels((prev) => prev.filter((item) => item.id !== carouselToDelete.id))
      setDeleteConfirmOpen(false)
      setCarouselToDelete(null)
      toast.success("LinkedIn post deleted", {
        description: "The LinkedIn post has been removed.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete LinkedIn post."
      toast.error("Delete failed", {
        description: message,
      })
    }
  }

  const handleSaveAndExit = (): void => {
    if (carouselData) {
      try {
        const savedEntry = saveCarousel(carouselData)
        setSavedCarousels((prev) => [savedEntry, ...prev])
        toast.success("LinkedIn post saved", {
          description: "Your high-performing LinkedIn content has been saved.",
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save LinkedIn post."
        toast.error("Save failed", {
          description: message,
        })
      }
    }
    setCarouselViewMode("dashboard")
  }

  const handleNavigateSlide = (direction: "next" | "previous"): void => {
    if (!carouselData || carouselViewMode !== "creation") return

    const totalSlides = carouselData.slides.length
    const newIndex =
      direction === "next"
        ? Math.min(totalSlides - 1, carouselSelectedSlideIndex + 1)
        : Math.max(0, carouselSelectedSlideIndex - 1)

    if (newIndex !== carouselSelectedSlideIndex) {
      setCarouselSelectedSlideIndex(newIndex)
      setCarouselSelectedLayerId(null)
    }
  }

  const handleDeleteCurrentSlide = (): void => {
    if (!carouselData || carouselViewMode !== "creation" || carouselData.slides.length <= 1) return
    handleDeleteSlide(carouselSelectedSlideIndex)
  }

  const updateCarouselData = (updatedData: CarouselData, statusMessage?: string): void => {
    commitCarouselChange(updatedData, statusMessage)
  }


  useEffect(() => {
    if (!carouselData) {
      setCarouselSelectedSlideIndex(0)
      setCarouselSelectedLayerId(null)
      return
    }

    const maxIndex = Math.max(0, carouselData.slides.length - 1)
    if (carouselSelectedSlideIndex > maxIndex) {
      setCarouselSelectedSlideIndex(maxIndex)
    }

    const slide = carouselData.slides[Math.min(carouselSelectedSlideIndex, maxIndex)]
    if (carouselSelectedLayerId && !slide?.layers.some((layer) => layer.id === carouselSelectedLayerId)) {
      setCarouselSelectedLayerId(null)
    }
  }, [carouselData, carouselSelectedLayerId, carouselSelectedSlideIndex])

  const handleUndo = useCallback(() => {
    setHistory((current) => {
      if (!canUndo(current)) return current

      const next = undoHistory(current)
      return next
    })
  }, [])

  const handleRedo = useCallback(() => {
    setHistory((current) => {
      if (!canRedo(current)) return current

      const next = redoHistory(current)
      return next
    })
  }, [])


  const handleLayerUpdate = (slideIndex: number, layerId: string, content: string): void => {
    if (!carouselData) return
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === slideIndex) {
        return {
          ...slide,
          layers: slide.layers.map((layer) => (layer.id === layerId ? { ...layer, content } : layer))
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData, "Changes saved")
  }

  const handleLayerStyleUpdate = (slideIndex: number, layerId: string, style: Partial<Layer["style"]>): void => {
    if (!carouselData) return
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === slideIndex) {
        const updatedLayers = slide.layers.map((layer) => {
          if (layer.id === layerId) {
            return {
              ...layer,
              style: {
                ...(layer.style || {}),
                ...style
              }
            }
          }
          return layer
        })
        return {
          ...slide,
          layers: updatedLayers
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData, "Changes saved")
  }

  const handleBackgroundUpdate = (slideIndex: number | "all", background: Partial<Slide["background"]>): void => {
    if (!carouselData) return
    const slidesToUpdate = slideIndex === "all" ? carouselData.slides.map((_, i) => i) : [slideIndex]
    
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (slidesToUpdate.includes(index)) {
        return {
          ...slide,
          background: {
            ...(slide.background || {}),
            ...background,
            pattern: background.pattern ? {
              ...(slide.background?.pattern || {}),
              ...background.pattern
            } : slide.background?.pattern
          }
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData, "Changes saved")
  }

  const handleSizeUpdate = (slideIndex: number | "all", size: Slide["size"]): void => {
    if (!carouselData) return
    const slidesToUpdate = slideIndex === "all" ? carouselData.slides.map((_, i) => i) : [slideIndex]
    
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (slidesToUpdate.includes(index)) {
        return {
          ...slide,
          size
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData, "Changes saved")
  }

  const handleLayoutUpdate = (slideIndex: number | "all", layout: Partial<Slide["layout"]>): void => {
    if (!carouselData) return
    const slidesToUpdate = slideIndex === "all" ? carouselData.slides.map((_, i) => i) : [slideIndex]
    
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (slidesToUpdate.includes(index)) {
        return {
          ...slide,
          layout: {
            ...(slide.layout || {
              padding: DEFAULT_PADDING,
              horizontalAlign: DEFAULT_HORIZONTAL_ALIGN,
              verticalAlign: DEFAULT_VERTICAL_ALIGN,
            }),
            ...layout,
          }
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData, "Changes saved")
  }

  const handleCycleHorizontalAlign = (slideIndex: number): void => {
    if (!carouselData) return
    const currentAlign = carouselData.slides[slideIndex]?.layout?.horizontalAlign || DEFAULT_HORIZONTAL_ALIGN
    const alignments: ("left" | "center" | "right")[] = ["left", "center", "right"]
    const currentIndex = alignments.indexOf(currentAlign)
    const nextIndex = (currentIndex + 1) % alignments.length
    handleLayoutUpdate(slideIndex, { horizontalAlign: alignments[nextIndex] })
  }

  const handleCycleVerticalAlign = (slideIndex: number): void => {
    if (!carouselData) return
    const currentAlign = carouselData.slides[slideIndex]?.layout?.verticalAlign || DEFAULT_VERTICAL_ALIGN
    const alignments: ("top" | "center" | "bottom" | "stretch")[] = ["top", "center", "bottom", "stretch"]
    const currentIndex = alignments.indexOf(currentAlign)
    const nextIndex = (currentIndex + 1) % alignments.length
    handleLayoutUpdate(slideIndex, { verticalAlign: alignments[nextIndex] })
  }

  const handleRandomBackgroundColor = (slideIndex: number): void => {
    if (!carouselData) return
    // Generate a random color (darker colors work better for carousels)
    const randomColor = `#${Math.floor(Math.random() * 0x808080 + 0x202020).toString(16).padStart(6, '0')}`
    handleBackgroundUpdate(slideIndex, { color: randomColor })
  }

  const handleHeaderUpdate = (enabled: boolean, text: string): void => {
    if (!carouselData) return
    const updatedData: CarouselData = {
      ...carouselData,
      header: { enabled, text },
    }
    commitCarouselChange(updatedData, "Header updated")
  }

  const handleFooterUpdate = (enabled: boolean, text: string): void => {
    if (!carouselData) return
    const updatedData: CarouselData = {
      ...carouselData,
      footer: { enabled, text },
    }
    commitCarouselChange(updatedData, "Footer updated")
  }

  const handleLayerVisibility = (slideIndex: number, layerId: string): void => {
    if (!carouselData) return
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === slideIndex) {
        return {
          ...slide,
          layers: slide.layers.map((layer) => (layer.id === layerId ? { ...layer, visible: !layer.visible } : layer))
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)
    if (carouselSelectedLayerId === layerId) setCarouselSelectedLayerId(null)
  }

  const handleAddLayer = (slideIndex: number, type: Layer["type"]): void => {
    if (!carouselData) return
    const newLayer: Layer = {
      id: generateLayerId(),
      type,
      content:
        type === "heading"
          ? LAYER_CONTENT_DEFAULTS.heading
          : type === "subheading"
            ? LAYER_CONTENT_DEFAULTS.subheading
            : type === "bullet"
              ? LAYER_CONTENT_DEFAULTS.bullet
              : LAYER_CONTENT_DEFAULTS.body,
      visible: true,
    }
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === slideIndex) {
        return {
          ...slide,
          layers: [...slide.layers, newLayer]
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)
    setCarouselSelectedLayerId(newLayer.id)
  }

  const handleDeleteLayer = (slideIndex: number, layerId: string): void => {
    if (!carouselData) return
    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === slideIndex) {
        return {
          ...slide,
          layers: slide.layers.filter((l) => l.id !== layerId)
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)
    if (carouselSelectedLayerId === layerId) setCarouselSelectedLayerId(null)
  }

  const handleAddSlide = (afterIndex: number): void => {
    if (!carouselData) return
    const newSlide: CarouselData["slides"][0] = {
      index: afterIndex + 1,
      type: "text",
      body: "",
      content: "",
      size: DEFAULT_SIZE,
      layers: [
        {
          id: generateLayerId(),
          type: "heading",
          content: LAYER_CONTENT_DEFAULTS.slideHeading,
          visible: true
        }
      ]
    }
    const updatedSlides = [
      ...carouselData.slides.slice(0, afterIndex + 1),
      newSlide,
      ...carouselData.slides.slice(afterIndex + 1).map((slide, idx) => ({
        ...slide,
        index: afterIndex + 2 + idx
      }))
    ]
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)
    setCarouselSelectedSlideIndex(afterIndex + 1)
    setCarouselSelectedLayerId(null)
  }

  const handleDuplicateSlide = (slideIndex: number): void => {
    if (!carouselData) return
    
    const slideToDuplicate = carouselData.slides[slideIndex]
    if (!slideToDuplicate) return
    
    // Create a deep copy of the slide
    const duplicatedSlide: Slide = {
      ...slideToDuplicate,
      index: slideIndex + 2,
      layers: slideToDuplicate.layers?.map((layer) => ({
        ...layer,
        id: generateLayerId(),
      })) || [],
    }
    
    const updatedSlides = [
      ...carouselData.slides.slice(0, slideIndex + 1),
      duplicatedSlide,
      ...carouselData.slides.slice(slideIndex + 1).map((slide, idx) => ({
        ...slide,
        index: slideIndex + 3 + idx,
      })),
    ]
    
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData, "Slide duplicated")
    setCarouselSelectedSlideIndex(slideIndex + 1)
    setCarouselSelectedLayerId(null)
  }

  const handleDeleteSlide = (slideIndex: number): void => {
    if (!carouselData || carouselData.slides.length <= 1) return
    
    const updatedSlides = carouselData.slides
      .filter((_, index) => index !== slideIndex)
      .map((slide, index) => ({
        ...slide,
        index: index + 1
      }))
    
    // Adjust selected slide index
    let newSelectedIndex = carouselSelectedSlideIndex
    if (slideIndex < carouselSelectedSlideIndex) {
      // If we deleted a slide before the current one, no change needed
      newSelectedIndex = carouselSelectedSlideIndex - 1
    } else if (slideIndex === carouselSelectedSlideIndex) {
      // If we deleted the current slide, go to the previous one (or stay at 0)
      newSelectedIndex = Math.max(0, carouselSelectedSlideIndex - 1)
    }
    // If we deleted a slide after the current one, no change needed
    
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)
    setCarouselSelectedSlideIndex(newSelectedIndex)
    setCarouselSelectedLayerId(null)
  }

  const handleReorderSlides = (fromIndex: number, toIndex: number): void => {
    if (!carouselData) return
    
    const updatedSlides = [...carouselData.slides]
    const [movedSlide] = updatedSlides.splice(fromIndex, 1)
    updatedSlides.splice(toIndex, 0, movedSlide)
    
    // Update indices
    const reindexedSlides = updatedSlides.map((slide, index) => ({
      ...slide,
      index: index + 1
    }))
    
    // Update selected slide index if needed
    let newSelectedIndex = carouselSelectedSlideIndex
    if (fromIndex === carouselSelectedSlideIndex) {
      newSelectedIndex = toIndex
    } else if (fromIndex < carouselSelectedSlideIndex && toIndex >= carouselSelectedSlideIndex) {
      newSelectedIndex = carouselSelectedSlideIndex - 1
    } else if (fromIndex > carouselSelectedSlideIndex && toIndex <= carouselSelectedSlideIndex) {
      newSelectedIndex = carouselSelectedSlideIndex + 1
    }
    
    const updatedData = { ...carouselData, slides: reindexedSlides }
    updateCarouselData(updatedData)
    setCarouselSelectedSlideIndex(newSelectedIndex)
    setCarouselSelectedLayerId(null)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, layerId: string): void => {
    setCarouselDraggedLayerId(layerId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetLayerId: string): void => {
    e.preventDefault()
    if (!carouselData || !carouselDraggedLayerId || carouselDraggedLayerId === targetLayerId) {
      setCarouselDraggedLayerId(null)
      return
    }

    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === carouselSelectedSlideIndex) {
        const layers = [...slide.layers]
        const draggedIndex = layers.findIndex((l) => l.id === carouselDraggedLayerId)
        const targetIndex = layers.findIndex((l) => l.id === targetLayerId)

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedLayer] = layers.splice(draggedIndex, 1)
          layers.splice(targetIndex, 0, draggedLayer)
          return {
            ...slide,
            layers: layers
          }
        }
      }
      return slide
    })
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)

    setCarouselDraggedLayerId(null)
  }

  const handleDragEnd = (): void => {
    setCarouselDraggedLayerId(null)
  }

  const handleSelectLayer = (layerId: string): void => {
    setCarouselSelectedLayerId(layerId)
  }

  const currentSlide = carouselData?.slides[carouselSelectedSlideIndex]
  const selectedLayer = currentSlide?.layers.find((l) => l.id === carouselSelectedLayerId)

  // Dashboard view - show when carouselViewMode is dashboard
  if (carouselViewMode === "dashboard") {
    return (
      <TooltipProvider delayDuration={300} skipDelayDuration={0}>
        <ErrorBoundary componentName="CarouselGenerator">
        <div className={`flex h-screen overflow-hidden ${interTight.variable}`}>
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header subtitle={undefined} onBack={undefined} onLogoClick={() => setCarouselViewMode("dashboard")} />

            <div className="flex flex-1 flex-col overflow-hidden">
            {/* Dashboard Title Section - only show if we have LinkedIn posts */}
            {savedCarousels.length > 0 && (
              <div className="carousel-dashboard-title border-b border-border px-6 py-4 bg-background" data-carousel-section="dashboard-title">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{savedCarousels.length} LinkedIn posts</span>
                  </div>
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
                      aria-label="Create new LinkedIn post"
                      onClick={handleStartNewGeneration}
                      className="relative px-5 py-2 rounded-lg bg-background text-foreground text-sm font-medium cursor-pointer hover:bg-secondary transition-colors"
                    >
                      New generation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <section
              className="flex-1 overflow-auto relative bg-background"
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.15]"
                style={{
                  backgroundImage: "url('/1_2.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 100px hsl(var(--background) / 0.5)",
                }}
              />

              {savedCarousels.length === 0 ? (
                <div 
                  className="relative z-10 flex flex-col items-center justify-center h-full pb-20 bg-background"
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: "url('/bg-texture.png')",
                      backgroundSize: mounted 
                        ? `${Math.max(windowSize.width, windowSize.height) * 0.8}px ${Math.max(windowSize.width, windowSize.height) * 0.8}px`
                        : "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "repeat",
                      opacity: mounted && theme === "dark" ? 0.05 : 0.02,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: mounted && theme === "dark" 
                        ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)"
                        : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 50%)",
                    }}
                  />

                  <div className="relative flex items-center justify-center mb-6 px-6">
                    <img
                      src="/ui-preview.png"
                      alt="UI Elements Preview"
                      className="max-w-full h-auto object-contain"
                      style={{ maxHeight: "160px", width: "auto" }}
                      onError={(e) => {
                        console.error("Failed to load ui-preview.png:", e)
                      }}
                    />
                  </div>

                  <h2
                    className="text-2xl md:text-3xl mb-3 bg-clip-text text-transparent font-semibold text-center"
                    style={{
                      backgroundImage: mounted && theme === "dark"
                        ? "linear-gradient(to bottom, #ffffff, #888888)"
                        : "linear-gradient(to bottom, #1a1a1a, #666666)",
                      fontFamily: "var(--font-lora), serif",
                    }}
                  >
                    High-performing LinkedIn content
                    <br />
                    in just a couple clicks
                  </h2>

                  <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
                    Our LinkedIn specialization helps you create engaging posts that drive results. Optimized for maximum performance.
                  </p>

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
                      aria-label="Start generating a carousel"
                      onClick={handleStartNewGeneration}
                      className="relative px-6 py-2.5 rounded-lg bg-background text-foreground text-sm font-medium cursor-pointer hover:bg-secondary transition-colors"
                    >
                      Start generating
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-xs text-muted-foreground">
                      By continuing, you agree to our{" "}
                      <a href="/terms" className="underline hover:text-foreground transition-colors cursor-pointer text-muted-foreground">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="underline hover:text-foreground transition-colors cursor-pointer text-muted-foreground">
                        Privacy
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 p-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedCarousels.map((carousel) => {
                        const firstSlide = carousel.data.slides?.[0]
                        const savedDate = new Date(carousel.savedAt)
                        const formattedDate = savedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })

                        return (
                          <div
                            key={carousel.id}
                            className="group relative block cursor-pointer"
                          >
                            {/* Animated gradient border - only visible on hover */}
                            <div
                              className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                              style={{
                                background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                                backgroundSize: "300% 100%",
                                animation: "borderRun 3s linear infinite",
                              }}
                            />
                            
                            {/* Card content - always visible */}
                            <div
                              onClick={() => {
                                handleLoadCarouselSelection(carousel)
                              }}
                              className="relative w-full rounded-lg border border-border bg-background group-hover:border-transparent group-hover:bg-secondary transition-colors overflow-hidden cursor-pointer"
                            >
                              {/* Preview thumbnail */}
                              {firstSlide && (
                                <div className="relative h-48 overflow-hidden bg-background">
                                  <div className="absolute inset-0 flex items-center justify-center p-2">
                                    <div className="w-full max-w-[120px]">
                                      <SlideCard
                                        slide={firstSlide}
                                        index={0}
                                        total={carousel.data.slides?.length || 1}
                                        compact={true}
                                        header={carousel.data.header}
                                        footer={carousel.data.footer}
                                      />
                                    </div>
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
                                </div>
                              )}
                              
                              {/* Card info */}
                              <div className="relative p-4 border-t border-border bg-background/95 backdrop-blur-sm">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-medium text-sm line-clamp-2 flex-1">{carousel.data.topic}</h3>
                                  <button
                                    aria-label={`Delete LinkedIn post ${carousel.data.topic}`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleDeleteCarousel(carousel, e)
                                    }}
                                    className="flex-shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer relative z-10"
                                    type="button"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{formattedDate}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete LinkedIn post</DialogTitle>
            <DialogDescription>
              {carouselToDelete && (
                <>Are you sure you want to delete your LinkedIn post "{carouselToDelete.data.topic}"? This action cannot be undone.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false)
                setCarouselToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCarousel}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </ErrorBoundary>
      </TooltipProvider>
    )
  }

  // Creation view - show when carouselViewMode is creation
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={0}>
      <ErrorBoundary componentName="CarouselGenerator">
      <div className={`flex h-screen overflow-hidden ${interTight.variable}`}>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            topic={carouselData?.topic}
            onBack={() => setCarouselViewMode("dashboard")}
            onLogoClick={() => setCarouselViewMode("dashboard")}
            carouselSaveStatus={carouselSaveStatus}
          />

          <div className="flex flex-1 overflow-hidden">
            <section
              className="flex-1 overflow-auto relative bg-background"
            >
              {carouselData && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "url('/bg-texture.png')",
                    backgroundSize: mounted 
                      ? `${Math.max(windowSize.width, windowSize.height) * 0.8}px ${Math.max(windowSize.width, windowSize.height) * 0.8}px`
                      : "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "repeat",
                    opacity: mounted && theme === "dark" ? 0.05 : 0.02,
                  }}
                />
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 100px hsl(var(--background) / 0.5)",
                }}
              />

              {carouselData && creationStep === "results" ? (
                <>
                  <div className="relative z-10 flex items-center justify-center min-h-full pb-24">
                    <ErrorBoundary componentName="CarouselPreview">
                      <CarouselPreview
                        data={carouselData}
                        carouselIsLoading={carouselIsLoading}
                        currentSlide={carouselSelectedSlideIndex}
                        onSlideChange={(index) => {
                          setCarouselSelectedSlideIndex(index)
                          setCarouselSelectedLayerId(null)
                        }}
                        onAddSlide={handleAddSlide}
                        onDeleteSlide={handleDeleteSlide}
                        onDuplicateSlide={handleDuplicateSlide}
                        onReorderSlides={handleReorderSlides}
                        onCycleHorizontalAlign={handleCycleHorizontalAlign}
                        onCycleVerticalAlign={handleCycleVerticalAlign}
                        onRandomBackgroundColor={handleRandomBackgroundColor}
                      />
                    </ErrorBoundary>
                  </div>
                
                {/* Fixed Bottom Action Panel */}
                <div className="fixed bottom-0 left-0 right-[380px] z-20 border-t border-border bg-background/95 backdrop-blur-sm">
                  <div className="px-4 py-2">
                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        aria-label="Open template settings"
                        onClick={() => setCarouselSelectedAction(carouselSelectedAction === "template" ? null : "template")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          carouselSelectedAction === "template"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <Grid3x3 className="w-4 h-4" />
                        <span className="text-[10px]">Template</span>
                      </button>
                      <button
                        aria-label="Open background settings"
                        onClick={() => {
                          setCarouselSelectedAction("background")
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          carouselSelectedAction === "background"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <PaintBucket className="w-4 h-4" />
                        <span className="text-[10px]">Background</span>
                      </button>
                      <button
                        aria-label="Open text styling"
                        onClick={() => {
                          if (selectedLayer) {
                            setCarouselSelectedAction(carouselSelectedAction === "text" ? null : "text")
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          carouselSelectedAction === "text" && selectedLayer
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                        disabled={!selectedLayer}
                      >
                        <Type className="w-4 h-4" />
                        <span className="text-[10px]">Text</span>
                      </button>
                      <button
                        aria-label="Open layout settings"
                        onClick={() => setCarouselSelectedAction(carouselSelectedAction === "layout" ? null : "layout")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          carouselSelectedAction === "layout"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <Layout className="w-4 h-4" />
                        <span className="text-[10px]">Layout</span>
                      </button>
                      <button
                        aria-label="Open size settings"
                        onClick={() => setCarouselSelectedAction(carouselSelectedAction === "size" ? null : "size")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          carouselSelectedAction === "size"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-[10px]">Size</span>
                      </button>
                      <button
                        aria-label="Open info settings"
                        onClick={() => setCarouselSelectedAction(carouselSelectedAction === "info" ? null : "info")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          carouselSelectedAction === "info"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <Info className="w-4 h-4" />
                        <span className="text-[10px]">Info</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                          aria-label="Toggle export options"
                          onClick={() => setCarouselSelectedAction(carouselSelectedAction === "export" ? null : "export")}
                          className={cn(
                            "px-4 py-2 rounded-lg border border-border bg-background hover:bg-secondary text-foreground text-sm font-medium transition-colors",
                            carouselSelectedAction === "export"
                              ? "bg-primary text-primary-foreground border-primary"
                              : ""
                          )}
                        >
                          Export
                        </button>
                        <button
                          aria-label="Save and exit to dashboard"
                          onClick={handleSaveAndExit}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          Save & Exit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </>
            ) : !carouselIsLoading && !(carouselData && creationStep === "results") ? (
              <div className="relative z-10 flex items-center justify-center min-h-full">
                <div className="w-full max-w-2xl mx-auto px-6 py-12">
                  {/* Common header section - always visible to prevent jumping */}
                  <div className="text-center mb-8 min-h-[200px] flex flex-col justify-start">
                    <h1
                      className="text-2xl md:text-3xl mb-4 bg-clip-text text-transparent font-semibold"
                      style={{
                        backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
                        fontFamily: "var(--font-lora), serif",
                      }}
                    >
                      Create High-Performing LinkedIn Content
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                      Our LinkedIn specialization helps you create engaging posts that drive results. Optimized for maximum performance.
                    </p>
                    
                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                          {/* Step 1 */}
                          <button
                            type="button"
                            onClick={() => {
                              if (creationStep === "form" || creationStep === "results") {
                                setCreationStep("select-type")
                                setContentType(null)
                              }
                            }}
                            disabled={creationStep === "select-type"}
                            className={cn(
                              "flex items-center transition-opacity",
                              creationStep === "select-type" ? "cursor-default opacity-100" : "cursor-pointer hover:opacity-80"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                              creationStep === "select-type" 
                                ? "bg-primary text-primary-foreground" 
                                : creationStep === "form" || creationStep === "results"
                                ? "bg-primary/20 text-primary border-2 border-primary"
                                : "bg-secondary text-muted-foreground"
                            )}>
                              {creationStep === "select-type" ? "1" : "✓"}
                            </div>
                            <div className={cn(
                              "ml-2 text-sm font-medium",
                              creationStep === "select-type" ? "text-foreground" : "text-muted-foreground"
                            )}>
                              Choose Type
                            </div>
                          </button>
                          
                          {/* Connector */}
                          <div className={cn(
                            "w-12 h-0.5 mx-4 transition-colors",
                            creationStep === "form" || creationStep === "results" ? "bg-primary" : "bg-border"
                          )} />
                          
                          {/* Step 2 */}
                          <button
                            type="button"
                            onClick={() => {
                              if (creationStep === "results" && contentType) {
                                setCreationStep("form")
                              }
                            }}
                            disabled={creationStep !== "results"}
                            className={cn(
                              "flex items-center transition-opacity",
                              creationStep === "results" ? "cursor-pointer hover:opacity-80" : "cursor-default opacity-100"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                              creationStep === "form"
                                ? "bg-primary text-primary-foreground"
                                : creationStep === "results"
                                ? "bg-primary/20 text-primary border-2 border-primary"
                                : "bg-secondary text-muted-foreground"
                            )}>
                              {creationStep === "results" ? "✓" : "2"}
                            </div>
                            <div className={cn(
                              "ml-2 text-sm font-medium",
                              creationStep === "form" ? "text-foreground" : "text-muted-foreground"
                            )}>
                              Details
                            </div>
                          </button>
                          
                          {/* Connector */}
                          <div className={cn(
                            "w-12 h-0.5 mx-4 transition-colors",
                            creationStep === "results" ? "bg-primary" : "bg-border"
                          )} />
                          
                          {/* Step 3 */}
                          <div className="flex items-center">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                              creationStep === "results"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
                            )}>
                              3
                            </div>
                            <div className={cn(
                              "ml-2 text-sm font-medium",
                              creationStep === "results" ? "text-foreground" : "text-muted-foreground"
                            )}>
                              Results
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  
                  {creationStep === "select-type" ? (
                    <div className="text-center min-h-[300px] flex flex-col justify-center">
                      {/* Content Type Selector - Step 1 */}
                      <div className="flex items-stretch justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setContentType("carousel")
                            setCreationStep("form")
                          }}
                          className="flex-1 max-w-xs px-8 py-6 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-left group"
                        >
                          <div className="text-lg font-semibold mb-2">Carousel</div>
                          <div className="text-sm text-muted-foreground">
                            Create multi-slide carousels with AI-powered content
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setContentType("post")
                            setCreationStep("form")
                          }}
                          className="flex-1 max-w-xs px-8 py-6 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-left group"
                        >
                          <div className="text-lg font-semibold mb-2">Text Post</div>
                          <div className="text-sm text-muted-foreground">
                            Generate engaging LinkedIn text posts
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : creationStep === "form" && contentType ? (
                    <div className="min-h-[300px]">
                      <ErrorBoundary componentName={contentType === "carousel" ? "CarouselForm" : "PostForm"}>
                        {contentType === "carousel" ? (
                          <CarouselForm onGenerate={handleGenerate} isLoading={carouselIsLoading} setIsLoading={setCarouselIsLoading} />
                        ) : (
                          <PostForm 
                            onGenerate={(data: PostGenerationResponse) => {
                              // Store post data and redirect to post view
                              if (typeof window !== "undefined") {
                                localStorage.setItem("generatedPostData", JSON.stringify(data))
                                router.push("/dashboard/post")
                              }
                            }} 
                            isLoading={postIsLoading}
                            setIsLoading={setPostIsLoading} 
                            setCarouselIsLoading={setCarouselIsLoading} 
                          />
                        )}
                      </ErrorBoundary>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center" role="status" aria-live="assertive">
                  <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Generating your carousel...</p>
                </div>
              </div>
            )}
          </section>

          {carouselData && (
            <aside className="w-[380px] border-l border-border flex flex-col bg-background">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    {carouselSelectedAction && (
                      <button
                        aria-label="Close settings"
                        onClick={() => {
                          setCarouselSelectedAction(null)
                        }}
                        className="p-1 rounded hover:bg-secondary transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    <span className="text-sm font-medium">
                      {carouselSelectedAction === "text" ? "Text Styling" :
                       carouselSelectedAction === "background" ? "Background Settings" :
                       carouselSelectedAction === "template" ? "Template" :
                       carouselSelectedAction === "layout" ? "Layout" :
                       carouselSelectedAction === "size" ? "Size" :
                       carouselSelectedAction === "info" ? "Info" :
                       "Edit slide"}
                    </span>
                  </div>
                    <div className="flex items-center gap-2">
                      {!carouselSelectedAction && (
                        <span className="text-xs text-muted-foreground">
                          {carouselSelectedSlideIndex + 1} / {carouselData.slides.length}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleUndo}
                              disabled={!canUndo(history)}
                              className="h-8 w-8"
                            >
                              <Undo2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Undo</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleRedo}
                              disabled={!canRedo(history)}
                              className="h-8 w-8"
                            >
                              <Redo2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Redo</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                <div className="flex-1 overflow-auto" ref={actionPanelRef}>
                  {/* Text Styling View */}
                  {carouselSelectedAction === "text" && selectedLayer ? (
                    <div className="p-4 space-y-4">
                      {/* Text Formatting Toolbar */}
                      <div className="p-3 rounded-lg bg-secondary border border-border">
                        <div className="flex items-center gap-1">
                          {/* Bold */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="Toggle bold"
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { 
                                  bold: !selectedLayer.style?.bold 
                                })}
                                className={cn(
                                  "p-2 rounded transition-colors",
                                  selectedLayer.style?.bold
                                    ? "bg-accent/20 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <Bold className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Bold</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Italic */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="Toggle italic"
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { 
                                  italic: !selectedLayer.style?.italic 
                                })}
                                className={cn(
                                  "p-2 rounded transition-colors",
                                  selectedLayer.style?.italic
                                    ? "bg-accent/20 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <Italic className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Italic</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Underline */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="Toggle underline"
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { 
                                  underline: !selectedLayer.style?.underline 
                                })}
                                className={cn(
                                  "p-2 rounded transition-colors",
                                  selectedLayer.style?.underline
                                    ? "bg-accent/20 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <Underline className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Underline</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Strikethrough */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="Toggle strikethrough"
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { 
                                  strikethrough: !selectedLayer.style?.strikethrough 
                                })}
                                className={cn(
                                  "p-2 rounded transition-colors",
                                  selectedLayer.style?.strikethrough
                                    ? "bg-accent/20 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <Strikethrough className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Strikethrough</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Separator */}
                          <div className="w-px h-6 bg-border mx-1" />
                          
                          {/* Numbered List */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="Toggle numbered list"
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { 
                                  listType: selectedLayer.style?.listType === "ordered" ? null : "ordered"
                                })}
                                className={cn(
                                  "p-2 rounded transition-colors",
                                  selectedLayer.style?.listType === "ordered"
                                    ? "bg-accent/20 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <ListOrdered className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Numbered list</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Bulleted List */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                aria-label="Toggle bulleted list"
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { 
                                  listType: selectedLayer.style?.listType === "unordered" ? null : "unordered"
                                })}
                                className={cn(
                                  "p-2 rounded transition-colors",
                                  selectedLayer.style?.listType === "unordered"
                                    ? "bg-accent/20 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                              >
                                <List className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Bulleted list</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Highlight Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedLayer.style?.highlightColor || DEFAULT_HIGHLIGHT_COLOR}
                            onChange={(e) => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { highlightColor: e.target.value })}
                            className="w-12 h-10 rounded border border-border bg-secondary cursor-pointer"
                            aria-label="Select highlight color"
                          />
                          <input
                            type="text"
                            value={selectedLayer.style?.highlightColor || DEFAULT_HIGHLIGHT_COLOR}
                            onChange={(e) => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { highlightColor: e.target.value })}
                              className="flex-1 px-3 py-2 rounded bg-secondary border border-border text-sm focus:outline-none focus:border-ring"
                            placeholder={DEFAULT_HIGHLIGHT_COLOR}
                            aria-label="Highlight color value"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Font Family</label>
                        <div className="grid grid-cols-3 gap-2">
                          {FONT_FAMILY_OPTIONS.map((font) => {
                            const isSelected = (selectedLayer.style?.fontFamily || DEFAULT_FONT_FAMILY) === font
                            return (
                              <button
                                aria-label={`Set font family ${font}`}
                                key={font}
                                onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { fontFamily: font })}
                                className={cn(
                                  "px-3 py-3 rounded-lg border transition-all text-center flex items-center justify-center",
                                  isSelected
                                    ? "bg-accent/20 border-accent text-accent"
                                    : "bg-secondary border-border hover:bg-muted"
                                )}
                              >
                                <div 
                                  className="text-base font-medium"
                                  style={{ fontFamily: font }}
                                >
                                  {font}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Font Size</label>
                          <select
                            value={selectedLayer.style?.fontSize || DEFAULT_FONT_SIZE}
                            onChange={(e) => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { fontSize: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-secondary border border-border text-sm focus:outline-none focus:border-ring cursor-pointer"
                          >
                            {FONT_SIZE_OPTIONS.map((size) => (
                              <option key={size} value={size}>
                                {size === "xs"
                                  ? "Extra Small"
                                  : size === "sm"
                                    ? "Small"
                                    : size === "base"
                                      ? "Base"
                                      : size === "lg"
                                        ? "Large"
                                        : size === "xl"
                                          ? "Extra Large"
                                          : size === "2xl"
                                            ? "2X Large"
                                            : "3X Large"}
                              </option>
                            ))}
                          </select>
                        </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Text Transform</label>
                        <div className="flex items-center gap-2">
                          <button
                            aria-label="Capitalize text"
                            onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { textTransform: "capitalize" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              selectedLayer.style?.textTransform === "capitalize"
                                ? "bg-secondary border-border text-foreground"
                                : "bg-secondary border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                            Aa
                          </button>
                          <button
                            aria-label="Uppercase text"
                            onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { textTransform: "uppercase" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              selectedLayer.style?.textTransform === "uppercase"
                                ? "bg-secondary border-border text-foreground"
                                : "bg-secondary border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                            AA
                          </button>
                          <button
                            aria-label="Lowercase text"
                            onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { textTransform: "lowercase" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              selectedLayer.style?.textTransform === "lowercase"
                                ? "bg-secondary border-border text-foreground"
                                : "bg-secondary border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                            aa
                          </button>
                          <button
                            aria-label="Remove text transformation"
                            onClick={() => handleLayerStyleUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, { textTransform: "none" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              !selectedLayer.style?.textTransform || selectedLayer.style?.textTransform === "none"
                                ? "bg-secondary border-border text-foreground"
                                : "bg-secondary border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                            None
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : carouselSelectedAction === "background" ? (
                    /* Background Settings View */
                    <div className="p-4 space-y-4 overflow-y-auto">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply these settings to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply background to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-secondary"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform",
                              applyToAllSlides ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      {/* Background Type */}
                      <div className="px-4 py-3 border-b border-border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Background Type</span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {BACKGROUND_TYPES.map((type) => {
                            const currentType = carouselData.slides[carouselSelectedSlideIndex]?.background?.type || DEFAULT_BACKGROUND_TYPE
                            const isSelected = currentType === type
                            return (
                              <button
                                key={type}
                                onClick={() => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { type })}
                                className={cn(
                                  "px-4 py-2.5 rounded-lg border transition-all text-sm capitalize",
                                  isSelected
                                    ? "bg-accent/20 border-accent text-accent"
                                    : "bg-secondary border-border hover:bg-muted"
                                )}
                              >
                                {type}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Background Color */}
                      {carouselData.slides[carouselSelectedSlideIndex]?.background?.type !== "photo" && (
                        <>
                          <div className="px-4 py-3 border-b border-border">
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Background Color</span>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                            <input
                              ref={backgroundColorPickerRef}
                              type="color"
                              value={carouselData.slides[carouselSelectedSlideIndex]?.background?.color || DEFAULT_BACKGROUND_COLOR}
                              onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { color: e.target.value })}
                              className="hidden"
                              aria-label="Select background color"
                            />
                            <div className="flex-1 relative">
                              <button
                                type="button"
                                onClick={() => backgroundColorPickerRef.current?.click()}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-border cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: carouselData.slides[carouselSelectedSlideIndex]?.background?.color || DEFAULT_BACKGROUND_COLOR }}
                                aria-label="Open color picker"
                              />
                              <input
                                type="text"
                                value={carouselData.slides[carouselSelectedSlideIndex]?.background?.color || DEFAULT_BACKGROUND_COLOR}
                                onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { color: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 rounded bg-secondary border border-border text-sm focus:outline-none focus:border-ring"
                                placeholder={DEFAULT_BACKGROUND_COLOR}
                                aria-label="Background color value"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Photo Upload */}
                      {carouselData.slides[carouselSelectedSlideIndex]?.background?.type === "photo" && (
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Upload Photo</label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (event) => {
                                    const result = event.target?.result as string
                                    if (result) {
                                      handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { photoUrl: result })
                                    }
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                              className="w-full px-3 py-2 rounded bg-secondary border border-border text-sm focus:outline-none focus:border-ring file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-foreground hover:file:bg-muted cursor-pointer"
                              aria-label="Upload background photo"
                            />
                          </div>
                          {carouselData.slides[carouselSelectedSlideIndex]?.background?.photoUrl && (
                            <>
                              <div className="mt-2 relative group">
                                <img 
                                  src={carouselData.slides[carouselSelectedSlideIndex]?.background?.photoUrl} 
                                  alt="Preview" 
                                  className="w-full h-32 object-cover rounded border border-border"
                                />
                                {carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayEnabled && (
                                  <div 
                                    className="absolute inset-0 bg-black rounded"
                                    style={{
                                      opacity: carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayOpacity ?? 0.5
                                    }}
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleBackgroundUpdate(
                                      applyToAllSlides ? "all" : carouselSelectedSlideIndex,
                                      { 
                                        photoUrl: undefined,
                                        overlayEnabled: false,
                                        overlayOpacity: undefined
                                      }
                                    )
                                  }}
                                  className="absolute top-2 right-2 p-1.5 rounded bg-background/90 backdrop-blur-sm border border-border hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Remove photo"
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </button>
                              </div>
                              <div className="mt-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm text-muted-foreground">Enable Overlay</label>
                                  <Switch
                                    checked={carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayEnabled ?? false}
                                    onCheckedChange={(checked) => {
                                      handleBackgroundUpdate(
                                        applyToAllSlides ? "all" : carouselSelectedSlideIndex,
                                        { 
                                          overlayEnabled: checked,
                                          overlayOpacity: checked ? (carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayOpacity ?? 0.5) : undefined
                                        }
                                      )
                                    }}
                                  />
                                </div>
                                {carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayEnabled && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm text-muted-foreground">Overlay Opacity</label>
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round((carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayOpacity ?? 0.5) * 100)}%
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="1"
                                      step="0.01"
                                      value={carouselData.slides[carouselSelectedSlideIndex]?.background?.overlayOpacity ?? 0.5}
                                      onChange={(e) => {
                                        handleBackgroundUpdate(
                                          applyToAllSlides ? "all" : carouselSelectedSlideIndex,
                                          { overlayOpacity: parseFloat(e.target.value) }
                                        )
                                      }}
                                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      <div className="border-t border-border" />

                      {/* Accent Color */}
                      <div className="px-4 py-3 border-b border-border">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Accent Color</span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            ref={accentColorPickerRef}
                            type="color"
                            value={carouselData.slides[carouselSelectedSlideIndex]?.background?.accentColor || DEFAULT_ACCENT_COLOR}
                            onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { accentColor: e.target.value })}
                            className="hidden"
                            aria-label="Select accent color"
                          />
                          <div className="flex-1 relative">
                            <button
                              type="button"
                              onClick={() => accentColorPickerRef.current?.click()}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-border cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: carouselData.slides[carouselSelectedSlideIndex]?.background?.accentColor || DEFAULT_ACCENT_COLOR }}
                              aria-label="Open color picker"
                            />
                            <input
                              type="text"
                              value={carouselData.slides[carouselSelectedSlideIndex]?.background?.accentColor || DEFAULT_ACCENT_COLOR}
                              onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { accentColor: e.target.value })}
                              className="w-full pl-10 pr-3 py-2 rounded bg-secondary border border-border text-sm focus:outline-none focus:border-ring"
                              placeholder={DEFAULT_ACCENT_COLOR}
                              aria-label="Accent color value"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border" />

                      {/* Pattern Settings */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Pattern</span>
                          <Switch
                            checked={carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.enabled ?? false}
                            onCheckedChange={(checked) => {
                              handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                pattern: { enabled: checked }
                              })
                            }}
                          />
                        </div>

                        {carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.enabled && (
                          <>
                            {/* Pattern Type */}
                            <div className="px-4 py-3 border-b border-border">
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Pattern Type</span>
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                {PATTERN_TYPES.map((patternType) => {
                                  const currentPattern = carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.type
                                  const isSelected = currentPattern === patternType
                                  return (
                                    <button
                                      aria-label={`Select ${patternType} pattern`}
                                      key={patternType}
                                      onClick={() => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                        pattern: { type: patternType }
                                      })}
                                      className={cn(
                                        "px-2 py-1.5 rounded text-xs border transition-all capitalize",
                                        isSelected
                                          ? "bg-accent/20 border-accent text-accent"
                                          : "bg-secondary border-border hover:bg-muted"
                                      )}
                                    >
                                      {patternType}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                            </div>

                            {/* Pattern Opacity */}
                            <div className="px-4 py-3 border-b border-border">
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Opacity</span>
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <button
                                  aria-label="Toggle pattern opacity adjustment"
                                  onClick={() => {
                                    const currentEnabled = carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.opacityEnabled || false
                                    handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                      pattern: { opacityEnabled: !currentEnabled }
                                    })
                                  }}
                                  className={cn(
                                    "relative w-9 h-5 rounded-full transition-colors",
                                    carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.opacityEnabled ? "bg-accent" : "bg-secondary"
                                  )}
                                  aria-pressed={carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.opacityEnabled}
                                >
                                  <span
                                    className={cn(
                                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform",
                                      carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.opacityEnabled ? "translate-x-4" : "translate-x-0"
                                    )}
                                  />
                                </button>
                              </div>
                              {carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.opacityEnabled && (
                                  <input
                                    type="range"
                                    min={PATTERN_OPACITY_RANGE.min}
                                    max={PATTERN_OPACITY_RANGE.max}
                                    step={PATTERN_OPACITY_RANGE.step}
                                    value={carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.opacity || DEFAULT_PATTERN_OPACITY}
                                    onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                      pattern: { opacity: parseFloat(e.target.value) }
                                    })}
                                    className="w-full"
                                    aria-label="Pattern opacity"
                                  />
                              )}
                            </div>

                            {/* Pattern Scale */}
                            <div className="px-4 py-3 border-b border-border">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Scale</span>
                                <button
                                  aria-label="Toggle pattern scale adjustment"
                                  onClick={() => {
                                    const currentEnabled = carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.scaleEnabled || false
                                    handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                      pattern: { scaleEnabled: !currentEnabled }
                                    })
                                  }}
                                  className={cn(
                                    "relative w-9 h-5 rounded-full transition-colors",
                                    carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.scaleEnabled ? "bg-accent" : "bg-secondary"
                                  )}
                                  aria-pressed={carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.scaleEnabled}
                                >
                                  <span
                                    className={cn(
                                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform",
                                      carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.scaleEnabled ? "translate-x-4" : "translate-x-0"
                                    )}
                                  />
                                </button>
                              </div>
                            </div>
                            {carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.scaleEnabled && (
                              <div className="p-4 space-y-2">
                                <input
                                  type="range"
                                  min={PATTERN_SCALE_RANGE.min}
                                  max={PATTERN_SCALE_RANGE.max}
                                  step={PATTERN_SCALE_RANGE.step}
                                  value={carouselData.slides[carouselSelectedSlideIndex]?.background?.pattern?.scale || DEFAULT_PATTERN_SCALE}
                                  onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                    pattern: { scale: parseFloat(e.target.value) }
                                  })}
                                  className="w-full"
                                  aria-label="Pattern scale"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ) : carouselSelectedAction === "size" ? (
                    /* Size Settings View */
                    <div className="p-4 space-y-4">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply this size to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply size to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-secondary"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform",
                              applyToAllSlides ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      {/* Size Options */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Aspect Ratio</label>
                          <div className="flex gap-3">
                            {SIZE_OPTIONS.map((option) => {
                              const currentSize = carouselData.slides[carouselSelectedSlideIndex]?.size || DEFAULT_SIZE
                              const isSelected = currentSize === option.value
                            return (
                              <button
                                aria-label={`Select ${option.label} aspect ratio`}
                                key={option.value}
                                onClick={() => handleSizeUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, option.value)}
                                className={cn(
                                  "flex-1 flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                  isSelected
                                    ? "bg-secondary border-accent"
                                    : "bg-secondary border-border hover:border-ring"
                                )}
                              >
                                <span className={cn(
                                  "text-2xl font-bold mb-1.5",
                                  isSelected ? "text-accent" : "text-muted-foreground"
                                )}>
                                  {option.value}
                                </span>
                                <span className={cn(
                                  "text-xs",
                                  isSelected ? "text-foreground" : "text-muted-foreground"
                                )}>
                                  {option.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : carouselSelectedAction === "template" ? (
                    /* Template Selection View */
                    <div className="p-4 space-y-4">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply this template to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply template to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-secondary"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform",
                              applyToAllSlides ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      {/* Template Grid */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Choose Template</label>
                        <div className="grid grid-cols-2 gap-3">
                          {templates.map((template) => (
                            <button
                              aria-label={`Apply ${template.name} template`}
                              key={template.id}
                              onClick={() => {
                                if (!carouselData) return
                                const slidesToUpdate = applyToAllSlides 
                                  ? carouselData.slides.map((_, i) => i) 
                                  : [carouselSelectedSlideIndex]
                                
                                const updatedSlides = carouselData.slides.map((slide, index) => {
                                  if (slidesToUpdate.includes(index)) {
                                    return template.apply(slide)
                                  }
                                  return slide
                                })
                                const updatedData = { ...carouselData, slides: updatedSlides }
                                updateCarouselData(updatedData, "Template applied")
                              }}
                              className="group relative overflow-hidden rounded-lg border-2 border-border hover:border-accent/50 transition-all bg-secondary hover:bg-muted"
                            >
                              {/* Template Preview */}
                              <div 
                                className="aspect-[4/5] relative overflow-hidden"
                                style={{
                                  backgroundColor: template.preview.backgroundColor,
                                  backgroundImage: template.preview.pattern 
                                    ? getPatternBackground(
                                        template.preview.pattern,
                                        template.preview.accentColor,
                                        0.2
                                      )
                                    : undefined,
                                  backgroundSize: template.preview.pattern ? "20px 20px" : undefined,
                                }}
                              >
                                {/* Layout Preview */}
                                {template.preview.layout === "centered" && (
                                  <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="w-3/4 space-y-2">
                                      <div className="h-2 bg-muted rounded" style={{ width: "80%" }} />
                                      <div className="h-2 bg-muted/80 rounded" style={{ width: "60%" }} />
                                    </div>
                                  </div>
                                )}
                                {template.preview.layout === "top" && (
                                  <div className="absolute top-8 left-8 right-8 space-y-2">
                                    <div className="h-2 bg-muted rounded" style={{ width: "90%" }} />
                                    <div className="h-2 bg-muted/80 rounded" style={{ width: "70%" }} />
                                  </div>
                                )}
                                {template.preview.layout === "split" && (
                                  <div className="absolute inset-0 flex">
                                    <div className="flex-1 p-4 space-y-2">
                                      <div className="h-2 bg-muted rounded" />
                                      <div className="h-2 bg-muted/80 rounded" />
                                    </div>
                                    <div className="w-px bg-border" />
                                    <div className="flex-1 p-4 space-y-2">
                                      <div className="h-2 bg-muted/80 rounded" />
                                      <div className="h-2 bg-muted rounded" />
                                    </div>
                                  </div>
                                )}
                                {template.preview.layout === "minimal" && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2/3 h-1 bg-muted/80 rounded" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Template Info */}
                              <div className="p-3 border-t border-border bg-background/80 backdrop-blur-sm">
                                <div className="font-medium text-sm mb-0.5">{template.name}</div>
                                <div className="text-xs text-muted-foreground">{template.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : carouselSelectedAction === "layout" ? (
                    /* Layout Settings View */
                    <div className="p-4 space-y-6">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply these settings to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply layout to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-secondary"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform",
                              applyToAllSlides ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      {/* Padding Section */}
                      <div className="space-y-3 p-4 rounded-lg bg-secondary border border-border">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">PADDING</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-secondary border border-border">
                              <Layout className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Content Padding</span>
                                <span className="text-sm font-medium">
                                  {carouselData.slides[carouselSelectedSlideIndex]?.layout?.padding || DEFAULT_PADDING}px
                                </span>
                              </div>
                              <input
                                  type="range"
                                  min={PADDING_RANGE.min}
                                  max={PADDING_RANGE.max}
                                  step={PADDING_RANGE.step}
                                value={carouselData.slides[carouselSelectedSlideIndex]?.layout?.padding || DEFAULT_PADDING}
                                onChange={(e) => handleLayoutUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, { 
                                  padding: parseInt(e.target.value) 
                                })}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alignment Section */}
                      <div className="space-y-4 p-4 rounded-lg bg-secondary border border-border">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ALIGNMENT</label>
                        
                        {/* Horizontal Alignment */}
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Horizontal</label>
                          <div className="flex gap-2">
                              {([
                                { value: "left" as const, icon: AlignLeft },
                                { value: "center" as const, icon: AlignCenter },
                                { value: "right" as const, icon: AlignRight },
                              ]).map(({ value, icon: Icon }) => {
                                const currentAlign = carouselData.slides[carouselSelectedSlideIndex]?.layout?.horizontalAlign || DEFAULT_HORIZONTAL_ALIGN
                              const isSelected = currentAlign === value
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleLayoutUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                    horizontalAlign: value
                                  })}
                                  className={cn(
                                    "flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all",
                                    isSelected
                                      ? "bg-accent border-accent"
                                      : "bg-secondary border-border hover:border-ring"
                                  )}
                                  aria-label={`Align text ${value}`}
                                >
                                  <Icon className={cn(
                                    "w-5 h-5",
                                    isSelected ? "text-foreground" : "text-muted-foreground"
                                  )} />
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Vertical Alignment */}
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">Vertical</label>
                          <div className="flex gap-2">
                              {([
                                { value: "top" as const, icon: AlignVerticalJustifyStart },
                                { value: "center" as const, icon: AlignVerticalJustifyCenter },
                                { value: "bottom" as const, icon: AlignVerticalJustifyEnd },
                                { value: "stretch" as const, icon: AlignVerticalDistributeCenter },
                              ]).map(({ value, icon: Icon }) => {
                                const currentAlign = carouselData.slides[carouselSelectedSlideIndex]?.layout?.verticalAlign || DEFAULT_VERTICAL_ALIGN
                              const isSelected = currentAlign === value
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleLayoutUpdate(applyToAllSlides ? "all" : carouselSelectedSlideIndex, {
                                    verticalAlign: value
                                  })}
                                  className={cn(
                                    "flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all",
                                    isSelected
                                      ? "bg-accent border-accent"
                                      : "bg-secondary border-border hover:border-ring"
                                  )}
                                  aria-label={`Align content ${value}`}
                                >
                                  <Icon className={cn(
                                    "w-5 h-5",
                                    isSelected ? "text-foreground" : "text-muted-foreground"
                                  )} />
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : carouselSelectedAction === "info" ? (
                    /* Info Settings View */
                    <div className="p-4 space-y-4">
                      {/* Show Header */}
                      <div className="p-4 rounded-lg bg-secondary border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Show header</label>
                          <Switch
                            checked={carouselData.header?.enabled || false}
                            onCheckedChange={(checked) => handleHeaderUpdate(checked, carouselData.header?.text || "")}
                            aria-label="Toggle header visibility"
                          />
                        </div>
                        {carouselData.header?.enabled && (
                          <input
                            type="text"
                            value={carouselData.header?.text || ""}
                            onChange={(e) => handleHeaderUpdate(true, e.target.value)}
                            placeholder="Enter header text..."
                            className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-ring transition-colors"
                            aria-label="Header text"
                          />
                        )}
                      </div>

                      {/* Show Footer */}
                      <div className="p-4 rounded-lg bg-secondary border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Show footer</label>
                          <Switch
                            checked={carouselData.footer?.enabled || false}
                            onCheckedChange={(checked) => handleFooterUpdate(checked, carouselData.footer?.text || "")}
                            aria-label="Toggle footer visibility"
                          />
                        </div>
                        {carouselData.footer?.enabled && (
                          <input
                            type="text"
                            value={carouselData.footer?.text || ""}
                            onChange={(e) => handleFooterUpdate(true, e.target.value)}
                            placeholder="Enter footer text..."
                            className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-sm outline-none focus:border-ring transition-colors"
                            aria-label="Footer text"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Default Edit Panel View */
                    <>
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Layers</span>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {currentSlide?.layers.map((layer) => (
                      <div
                        key={layer.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, layer.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, layer.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleSelectLayer(layer.id)}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          carouselSelectedLayerId === layer.id ? "bg-secondary" : "hover:bg-muted"
                        } ${carouselDraggedLayerId === layer.id ? "opacity-50" : ""}`}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleSelectLayer(layer.id)
                          }
                        }}
                        aria-pressed={carouselSelectedLayerId === layer.id}
                        aria-label={`Select ${layer.type} layer`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                                {layer.type}
                              </span>
                              {!layer.visible && <span className="text-[10px] text-muted-foreground">(hidden)</span>}
                            </div>
                            <p className={`text-sm truncate ${!layer.visible ? "text-muted-foreground" : ""}`}>
                              {layer.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  aria-label={layer.visible ? "Hide layer" : "Show layer"}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLayerVisibility(carouselSelectedSlideIndex, layer.id)
                                  }}
                                  className="p-1 rounded hover:bg-secondary transition-colors"
                                >
                                  {layer.visible ? (
                                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{layer.visible ? "Hide layer" : "Show layer"}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  aria-label="Delete layer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteLayer(carouselSelectedSlideIndex, layer.id)
                                  }}
                                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete layer</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedLayer && (
                    <div className="p-4 border-t border-border bg-secondary">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">Edit layer</span>
                        <select
                          value={selectedLayer.type}
                          onChange={(e) => {
                            if (!carouselData) return
                            const updatedSlides = carouselData.slides.map((slide, index) => {
                              if (index === carouselSelectedSlideIndex) {
                                return {
                                  ...slide,
                                  layers: slide.layers.map((l) =>
                                    l.id === carouselSelectedLayerId ? { ...l, type: e.target.value as Layer["type"] } : l,
                                  )
                                }
                              }
                              return slide
                            })
                              const updatedData = { ...carouselData, slides: updatedSlides }
                              updateCarouselData(updatedData, "Changes saved")
                            }}
                          className="text-xs bg-secondary border border-border rounded px-2 py-1 cursor-pointer"
                        >
                          <option value="heading">Heading</option>
                          <option value="subheading">Subheading</option>
                          <option value="body">Body</option>
                        </select>
                      </div>
                      <textarea
                        value={selectedLayer.content}
                        onChange={(e) => handleLayerUpdate(carouselSelectedSlideIndex, carouselSelectedLayerId!, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-ring transition-colors resize-none"
                        placeholder="Enter text..."
                        aria-label="Layer content"
                      />
                      <div className="flex items-center justify-end mt-3">
                        <div aria-live="polite" className="sr-only">
                          {carouselSavedStatus || ""}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Add layer</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAddLayer(carouselSelectedSlideIndex, "heading")}
                        className="px-3 py-1.5 text-xs rounded-md bg-secondary hover:bg-muted transition-colors cursor-pointer"
                      >
                        Heading
                      </button>
                      <button
                        onClick={() => handleAddLayer(carouselSelectedSlideIndex, "subheading")}
                        className="px-3 py-1.5 text-xs rounded-md bg-secondary hover:bg-muted transition-colors cursor-pointer"
                      >
                        Subheading
                      </button>
                      <button
                        onClick={() => handleAddLayer(carouselSelectedSlideIndex, "body")}
                        className="px-3 py-1.5 text-xs rounded-md bg-secondary hover:bg-muted transition-colors cursor-pointer"
                      >
                        Body
                      </button>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
        
      </div>
    </div>

    {isLoadModalOpen && (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 py-6">
        <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Load saved LinkedIn post</p>
              <p className="text-xs text-muted-foreground">Select a LinkedIn post saved in your browser.</p>
            </div>
            <button
              onClick={() => setIsLoadModalOpen(false)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-auto divide-y divide-border">
            {savedCarousels.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No saved LinkedIn posts yet. Try saving your current work.</div>
            ) : (
              savedCarousels.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleLoadCarouselSelection(entry)}
                  className="w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.data.topic}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(entry.savedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{entry.data.summary}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    )}
      </ErrorBoundary>
    </TooltipProvider>
  )
}
