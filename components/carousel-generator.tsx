"use client"

import type React from "react"
<<<<<<< HEAD
import { useCallback, useEffect, useRef, useState } from "react"
import { Inter_Tight } from "next/font/google"
import { Eye, EyeOff, GripVertical, Trash2, Plus, Check, Sparkles, ChevronLeft, ChevronRight, Upload, Grid3x3, PaintBucket, Type, Layout, Maximize2, ArrowLeft, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, AlignVerticalDistributeCenter, MoveVertical, Save, FilePlus, Keyboard, Undo2, Redo2 } from "lucide-react"
import type { CarouselData, Layer, Slide } from "@/lib/carousel-types"
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
=======
import { useEffect, useState } from "react"
import { Inter_Tight } from "next/font/google"
import { Eye, EyeOff, GripVertical, Trash2, Plus, Check, Sparkles, ChevronLeft, ChevronRight, Upload, Grid3x3, PaintBucket, Type, Layout, Maximize2, ArrowLeft, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, AlignVerticalDistributeCenter, MoveVertical, Save, FolderOpen, X } from "lucide-react"
import type { CarouselData, Layer, Slide } from "@/lib/carousel-types"
import { templates, type Template } from "@/lib/templates"
import { loadCarousel, saveCarousel, type StoredCarousel } from "@/lib/storage"
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage
import { CarouselForm } from "./carousel-form"
import { CarouselPreview } from "./carousel-preview"
import { Header } from "./header"
import { ErrorBoundary } from "./error-boundary"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
<<<<<<< HEAD
import { registerKeyboardShortcuts, type ShortcutConfig } from "@/lib/keyboard"
import { toast } from "@/hooks/use-toast"
import { canRedo, canUndo, createHistory, pushState, redo as redoHistory, undo as undoHistory, type HistoryState } from "@/lib/history"
=======
import { toast } from "@/hooks/use-toast"
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
})

<<<<<<< HEAD
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
  const [history, setHistory] = useState<HistoryState<CarouselData | null>>(() => createHistory<CarouselData | null>(null, 50))
  const carouselData = history.present
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"dashboard" | "creation">("dashboard")
  const [savedCarousels, setSavedCarousels] = useState<StoredCarousel[]>([])
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null)
  const [savedStatus, setSavedStatus] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<"export" | "template" | "background" | "text" | "layout" | "size" | null>(null)
  const [applyToAllSlides, setApplyToAllSlides] = useState(false)
<<<<<<< HEAD
  const actionPanelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

<<<<<<< HEAD
  const shortcutDefinitions = [
    { label: "Save carousel", keys: ["Cmd/Ctrl", "S"] },
    { label: "New carousel", keys: ["Cmd/Ctrl", "N"] },
    { label: "Delete slide", keys: ["Delete", "Backspace"] },
    { label: "Previous slide", keys: ["←"] },
    { label: "Next slide", keys: ["→"] },
  ]

  useEffect(() => {
    if (!selectedAction) return

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
  }, [selectedAction])

  const handleGenerate = (data: CarouselData): void => {
=======
  const commitCarouselChange = useCallback(
    (updatedData: CarouselData, statusMessage?: string) => {
      setHistory((current) => pushState(current, updatedData))

      if (statusMessage) {
        setSavedStatus(statusMessage)
        setTimeout(() => setSavedStatus(null), 1500)
      }
    },
    [],
  )
=======
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)

  useEffect(() => {
    setSavedCarousels(loadCarousel())
  }, [])
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage

  const handleGenerate = (data: CarouselData) => {
>>>>>>> origin/codex/add-undo/redo-functionality-to-carousel-generator
    const dataWithLayers = {
      ...data,
      slides: data.slides.map((slide) => ({
        ...slide,
        layers: slide.layers?.length ? slide.layers : slideToLayers(slide),
      })),
    }
<<<<<<< HEAD

    setHistory(createHistory(dataWithLayers, 50))
    setSavedCarousels((prev) => {
      const index = prev.findIndex((c) => c.topic === dataWithLayers.topic && c.platform === dataWithLayers.platform)
      if (index !== -1) {
        const updated = [...prev]
        updated[index] = dataWithLayers
        return updated
      }
      return [...prev, dataWithLayers]
    })
=======
    setHistory(createHistory(dataWithLayers, 50))
    setSelectedSlideIndex(0)
    setSelectedLayerId(null)
    setViewMode("creation")
  }

<<<<<<< HEAD
<<<<<<< HEAD
  const handleSelectSlide = (index: number): void => {
    setSelectedSlideIndex(index)
    setSelectedLayerId(null)
=======
  const handleSaveCarousel = (): void => {
    if (!carouselData) return

    try {
      const savedEntry = saveCarousel(carouselData)
      setSavedCarousels((prev) => [savedEntry, ...prev])
      toast({
        title: "Carousel saved",
        description: "Your carousel was stored in the browser.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save carousel."
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      })
    }
  }

  const handleLoadCarouselSelection = (entry: StoredCarousel): void => {
    setHistory(createHistory(entry.data, 50))
    setSelectedSlideIndex(0)
    setSelectedLayerId(null)
    setViewMode("creation")
    setIsLoadModalOpen(false)

    toast({
      title: "Carousel loaded",
      description: `Loaded ${entry.data.topic}`,
    })
  }

  const handleSaveCarousel = (): void => {
    if (!carouselData) return

    setSavedCarousels((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.topic === carouselData.topic && c.platform === carouselData.platform,
      )

      if (existingIndex === -1) {
        return [...prev, carouselData]
      }

      const updated = [...prev]
      updated[existingIndex] = carouselData
      return updated
    })

    setSavedStatus("Carousel saved")
    setTimeout(() => setSavedStatus(null), 1500)
  }

  const handleNewCarousel = (): void => {
    setViewMode("dashboard")
    setHistory(createHistory(null, 50))
    setSelectedSlideIndex(0)
    setSelectedLayerId(null)
    setSelectedAction(null)
  }

  const handleNavigateSlide = (direction: "next" | "previous"): void => {
    if (!carouselData || viewMode !== "creation") return

    const totalSlides = carouselData.slides.length
    const newIndex =
      direction === "next"
        ? Math.min(totalSlides - 1, selectedSlideIndex + 1)
        : Math.max(0, selectedSlideIndex - 1)

    if (newIndex !== selectedSlideIndex) {
      setSelectedSlideIndex(newIndex)
      setSelectedLayerId(null)
    }
  }

  const handleDeleteCurrentSlide = (): void => {
    if (!carouselData || viewMode !== "creation" || carouselData.slides.length <= 1) return
    handleDeleteSlide(selectedSlideIndex)
  }

  const updateCarouselData = (updatedData: CarouselData, statusMessage?: string): void => {
    commitCarouselChange(updatedData, statusMessage)
  }

  useEffect(() => {
    const shortcuts: ShortcutConfig[] = [
      {
        key: "s",
        metaOrCtrl: true,
        allowInInputs: true,
        handler: () => handleSaveCarousel(),
      },
      {
        key: "n",
        metaOrCtrl: true,
        allowInInputs: true,
        handler: () => handleNewCarousel(),
      },
      {
        key: "delete",
        handler: () => handleDeleteCurrentSlide(),
      },
      {
        key: "backspace",
        handler: () => handleDeleteCurrentSlide(),
      },
      {
        key: "arrowleft",
        handler: () => handleNavigateSlide("previous"),
      },
      {
        key: "arrowright",
        handler: () => handleNavigateSlide("next"),
      },
    ]

    const unregister = registerKeyboardShortcuts(shortcuts)
    return unregister
  }, [
    carouselData,
    handleDeleteCurrentSlide,
    handleNavigateSlide,
    handleNewCarousel,
    handleSaveCarousel,
    selectedSlideIndex,
    viewMode,
  ])

  const updateCarouselData = (updatedData: CarouselData, statusMessage?: string): void => {
    commitCarouselChange(updatedData, statusMessage)
  }

  useEffect(() => {
    if (!carouselData) {
      setSelectedSlideIndex(0)
      setSelectedLayerId(null)
      return
    }

    const maxIndex = Math.max(0, carouselData.slides.length - 1)
    if (selectedSlideIndex > maxIndex) {
      setSelectedSlideIndex(maxIndex)
    }

    const slide = carouselData.slides[Math.min(selectedSlideIndex, maxIndex)]
    if (selectedLayerId && !slide?.layers.some((layer) => layer.id === selectedLayerId)) {
      setSelectedLayerId(null)
    }
  }, [carouselData, selectedLayerId, selectedSlideIndex])

  const handleUndo = useCallback(() => {
    setHistory((current) => {
      if (!canUndo(current)) return current

      const next = undoHistory(current)
      toast({ title: "Undo", description: "Reverted to the previous change." })
      return next
    })
  }, [])

  const handleRedo = useCallback(() => {
    setHistory((current) => {
      if (!canRedo(current)) return current

      const next = redoHistory(current)
      toast({ title: "Redo", description: "Reapplied the last change." })
      return next
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isUndoShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !event.shiftKey
      const isRedoShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && event.shiftKey

      if (!carouselData || viewMode !== "creation") return

      if (isUndoShortcut) {
        event.preventDefault()
        handleUndo()
      } else if (isRedoShortcut) {
        event.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [carouselData, handleRedo, handleUndo, viewMode])

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
    if (selectedLayerId === layerId) setSelectedLayerId(null)
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
    setSelectedLayerId(newLayer.id)
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
    if (selectedLayerId === layerId) setSelectedLayerId(null)
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
    setSelectedSlideIndex(afterIndex + 1)
    setSelectedLayerId(null)
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
    let newSelectedIndex = selectedSlideIndex
    if (slideIndex < selectedSlideIndex) {
      // If we deleted a slide before the current one, no change needed
      newSelectedIndex = selectedSlideIndex - 1
    } else if (slideIndex === selectedSlideIndex) {
      // If we deleted the current slide, go to the previous one (or stay at 0)
      newSelectedIndex = Math.max(0, selectedSlideIndex - 1)
    }
    // If we deleted a slide after the current one, no change needed
    
    const updatedData = { ...carouselData, slides: updatedSlides }
    updateCarouselData(updatedData)
    setSelectedSlideIndex(newSelectedIndex)
    setSelectedLayerId(null)
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
    let newSelectedIndex = selectedSlideIndex
    if (fromIndex === selectedSlideIndex) {
      newSelectedIndex = toIndex
    } else if (fromIndex < selectedSlideIndex && toIndex >= selectedSlideIndex) {
      newSelectedIndex = selectedSlideIndex - 1
    } else if (fromIndex > selectedSlideIndex && toIndex <= selectedSlideIndex) {
      newSelectedIndex = selectedSlideIndex + 1
    }
    
    const updatedData = { ...carouselData, slides: reindexedSlides }
    updateCarouselData(updatedData)
    setSelectedSlideIndex(newSelectedIndex)
    setSelectedLayerId(null)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, layerId: string): void => {
    setDraggedLayerId(layerId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetLayerId: string): void => {
    e.preventDefault()
    if (!carouselData || !draggedLayerId || draggedLayerId === targetLayerId) {
      setDraggedLayerId(null)
      return
    }

    const updatedSlides = carouselData.slides.map((slide, index) => {
      if (index === selectedSlideIndex) {
        const layers = [...slide.layers]
        const draggedIndex = layers.findIndex((l) => l.id === draggedLayerId)
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

    setDraggedLayerId(null)
  }

  const handleDragEnd = (): void => {
    setDraggedLayerId(null)
  }

  const handleSelectLayer = (layerId: string): void => {
    setSelectedLayerId(layerId)
  }

  const currentSlide = carouselData?.slides[selectedSlideIndex]
  const selectedLayer = currentSlide?.layers.find((l) => l.id === selectedLayerId)

  // Dashboard view - show when viewMode is dashboard
  if (viewMode === "dashboard") {
    return (
      <ErrorBoundary componentName="CarouselGenerator">
        <div className={`flex h-screen overflow-hidden bg-background ${interTight.variable}`}>
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header subtitle={undefined} onBack={undefined} onLogoClick={() => setViewMode("dashboard")} />

            <div className="flex flex-1 flex-col overflow-hidden">
            {/* Dashboard Title Section */}
            <div className="border-b border-border px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                  <span className="text-sm text-muted-foreground">{savedCarousels.length} generations</span>
                </div>
                <button
                  aria-label="Create new carousel generation"
                  onClick={() => setViewMode("creation")}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-border text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New generation
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <section
              className="flex-1 overflow-auto relative"
              style={{
                backgroundColor: "#0a0a0a",
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
                }}
              />

              {savedCarousels.length === 0 ? (
                <div className="relative z-10 flex flex-col items-center justify-center h-full pb-20">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)",
                    }}
                  />

                  <div className="relative flex items-center justify-center mb-6">
                    <div
                      className="w-12 h-16 rounded-lg -rotate-12 absolute -left-6"
                      style={{ backgroundColor: "#8b4a5e" }}
                    >
                      <div className="p-2 pt-3 space-y-1">
                        <div className="h-0.5 bg-white/20 rounded w-full" />
                        <div className="h-0.5 bg-white/20 rounded w-3/4" />
                        <div className="h-0.5 bg-white/20 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="w-12 h-16 rounded-lg z-10 relative" style={{ backgroundColor: "#4a4a4a" }}>
                      <div className="p-2 pt-3 space-y-1">
                        <div className="h-0.5 bg-white/30 rounded w-full" />
                        <div className="h-0.5 bg-white/30 rounded w-3/4" />
                        <div className="h-0.5 bg-white/30 rounded w-1/2" />
                      </div>
                    </div>
                    <div
                      className="w-12 h-16 rounded-lg rotate-12 absolute -right-6"
                      style={{ backgroundColor: "#6b4a3a" }}
                    >
                      <div className="p-2 pt-3 space-y-1">
                        <div className="h-0.5 bg-white/20 rounded w-full" />
                        <div className="h-0.5 bg-white/20 rounded w-3/4" />
                        <div className="h-0.5 bg-white/20 rounded w-1/2" />
                      </div>
                    </div>
                  </div>

                  <h2
                    className="text-xl md:text-2xl mb-3 bg-clip-text text-transparent font-semibold text-center"
                    style={{
                      backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
                      fontFamily: "var(--font-inter-tight)",
                    }}
                  >
                    Professional carousels
                    <br />
                    with a single prompt
                  </h2>

                  <p className="text-sm text-white/50 text-center max-w-md mb-8">
                    Create engaging carousel posts for LinkedIn,
                    <br />
                    Instagram, Telegram in less than 1 minute.
                  </p>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl animate-pulse" />
                    <button
                      aria-label="Start generating a carousel"
                      onClick={() => setViewMode("creation")}
                      className="relative px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors cursor-pointer"
                    >
                      Start generating
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-xs text-muted-foreground">
                      By continuing, you agree to our{" "}
                      <a href="/terms" className="underline hover:text-white transition-colors cursor-pointer">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="underline hover:text-white transition-colors cursor-pointer">
                        Privacy
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 p-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedCarousels.map((carousel) => (
                        <button
<<<<<<< HEAD
                          aria-label={`Open carousel ${carousel.topic}`}
                          key={index}
                          onClick={() => {
                            setHistory(createHistory(carousel, 50))
                            setSelectedSlideIndex(0)
                            setSelectedLayerId(null)
=======
                          key={carousel.id}
                          onClick={() => {
                            setCarouselData(carousel.data)
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage
                            setViewMode("creation")
                            setSelectedSlideIndex(0)
                            setSelectedLayerId(null)
                          }}
                          className="p-4 rounded-lg border border-border bg-background hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer text-left"
                        >
                          <h3 className="font-medium mb-2">{carousel.data.topic}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{carousel.data.platform}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{carousel.data.summary}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      </ErrorBoundary>
    )
  }

  // Creation view - show when viewMode is creation
  return (
    <ErrorBoundary componentName="CarouselGenerator">
      <div className={`flex h-screen overflow-hidden bg-background ${interTight.variable}`}>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            topic={carouselData?.topic}
            platform={carouselData?.platform}
            onBack={() => setViewMode("dashboard")}
            onLogoClick={() => setViewMode("dashboard")}
          />

          <div className="flex flex-1 overflow-hidden">
            <section
              className="flex-1 overflow-auto relative"
              style={{
                backgroundColor: "#0a0a0a",
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
                }}
              />

<<<<<<< HEAD
              {carouselData ? (
                <>
                  <div className="relative z-10 flex items-center justify-center min-h-full pb-24">
                    <ErrorBoundary componentName="CarouselPreview">
                      <CarouselPreview
                        data={carouselData}
                        isLoading={isLoading}
                        currentSlide={selectedSlideIndex}
                        onSlideChange={(index) => {
                          setSelectedSlideIndex(index)
                          setSelectedLayerId(null)
                        }}
                        onAddSlide={handleAddSlide}
                        onDeleteSlide={handleDeleteSlide}
                        onReorderSlides={handleReorderSlides}
                      />
                    </ErrorBoundary>
                  </div>
>>>>>>> origin/codex/add-keyboard-shortcuts-for-carousel-generator
                
                {/* Fixed Bottom Action Panel */}
                <div className="fixed bottom-0 left-0 right-[380px] z-20 border-t border-border bg-background/95 backdrop-blur-sm">
                  <div className="px-4 py-2">
                    {/* Action buttons */}
<<<<<<< HEAD
<<<<<<< HEAD
                    <div className="flex items-center gap-1">
=======
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage
                      <button
                        aria-label="Toggle export options"
                        onClick={() => setSelectedAction(selectedAction === "export" ? null : "export")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          selectedAction === "export"
                            ? "bg-accent/20 text-accent"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-[10px]">Export</span>
                      </button>
                      <button
                        aria-label="Open template settings"
                        onClick={() => setSelectedAction(selectedAction === "template" ? null : "template")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          selectedAction === "template"
                            ? "bg-accent/20 text-accent"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Grid3x3 className="w-4 h-4" />
                        <span className="text-[10px]">Template</span>
                      </button>
                      <button
                        aria-label="Open background settings"
                        onClick={() => {
                          setSelectedAction("background")
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          selectedAction === "background"
                            ? "bg-accent/20 text-accent"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                      >
                        <PaintBucket className="w-4 h-4" />
                        <span className="text-[10px]">Background</span>
                      </button>
                      <button
                        aria-label="Open text styling"
                        onClick={() => {
                          if (selectedLayer) {
                            setSelectedAction("text")
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          selectedAction === "text" && selectedLayer
                            ? "bg-accent/20 text-accent"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                        disabled={!selectedLayer}
                      >
                        <Type className="w-4 h-4" />
                        <span className="text-[10px]">Text</span>
                      </button>
                      <button
                        aria-label="Open layout settings"
                        onClick={() => setSelectedAction(selectedAction === "layout" ? null : "layout")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          selectedAction === "layout"
                            ? "bg-accent/20 text-accent"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Layout className="w-4 h-4" />
                        <span className="text-[10px]">Layout</span>
                      </button>
                      <button
                        aria-label="Open size settings"
                        onClick={() => setSelectedAction(selectedAction === "size" ? null : "size")}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                          selectedAction === "size"
                            ? "bg-accent/20 text-accent"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-[10px]">Size</span>
                      </button>
<<<<<<< HEAD
=======
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedAction(selectedAction === "export" ? null : "export")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                            selectedAction === "export"
                              ? "bg-accent/20 text-accent"
                              : "text-muted-foreground hover:text-white hover:bg-white/5",
                          )}
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-[10px]">Export</span>
                        </button>
                        <button
                          onClick={() => setSelectedAction(selectedAction === "template" ? null : "template")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                            selectedAction === "template"
                              ? "bg-accent/20 text-accent"
                              : "text-muted-foreground hover:text-white hover:bg-white/5",
                          )}
                        >
                          <Grid3x3 className="w-4 h-4" />
                          <span className="text-[10px]">Template</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAction("background")
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                            selectedAction === "background"
                              ? "bg-accent/20 text-accent"
                              : "text-muted-foreground hover:text-white hover:bg-white/5",
                          )}
                        >
                          <PaintBucket className="w-4 h-4" />
                          <span className="text-[10px]">Background</span>
                        </button>
                        <button
                          onClick={() => {
                            if (selectedLayer) {
                              setSelectedAction("text")
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                            selectedAction === "text" && selectedLayer
                              ? "bg-accent/20 text-accent"
                              : "text-muted-foreground hover:text-white hover:bg-white/5",
                          )}
                          disabled={!selectedLayer}
                        >
                          <Type className="w-4 h-4" />
                          <span className="text-[10px]">Text</span>
                        </button>
                        <button
                          onClick={() => setSelectedAction(selectedAction === "layout" ? null : "layout")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                            selectedAction === "layout"
                              ? "bg-accent/20 text-accent"
                              : "text-muted-foreground hover:text-white hover:bg-white/5",
                          )}
                        >
                          <Layout className="w-4 h-4" />
                          <span className="text-[10px]">Layout</span>
                        </button>
                        <button
                          onClick={() => setSelectedAction(selectedAction === "size" ? null : "size")}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded transition-colors",
                            selectedAction === "size"
                              ? "bg-accent/20 text-accent"
                              : "text-muted-foreground hover:text-white hover:bg-white/5",
                          )}
                        >
                          <Maximize2 className="w-4 h-4" />
                          <span className="text-[10px]">Size</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {savedStatus && (
                          <span className="flex items-center gap-1.5 text-xs text-green-400">
                            <Check className="w-3 h-3" />
                            {savedStatus}
                          </span>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveCarousel}>
                              <Save className="w-4 h-4" />
                              Save
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Save carousel</span>
                              <KbdGroup>
                                <Kbd>Cmd/Ctrl</Kbd>
                                <Kbd>S</Kbd>
                              </KbdGroup>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2" onClick={handleNewCarousel}>
                              <FilePlus className="w-4 h-4" />
                              New
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Start a new carousel</span>
                              <KbdGroup>
                                <Kbd>Cmd/Ctrl</Kbd>
                                <Kbd>N</Kbd>
                              </KbdGroup>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsShortcutsOpen(true)}
                              aria-label="Keyboard shortcuts"
                            >
                              <Keyboard className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Keyboard shortcuts</span>
                              <Kbd>?</Kbd>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
>>>>>>> origin/codex/add-keyboard-shortcuts-for-carousel-generator
=======
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveCarousel}
                          disabled={!carouselData}
                          className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setSavedCarousels(loadCarousel())
                            setIsLoadModalOpen(true)
                          }}
                          className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
                        >
                          <FolderOpen className="h-4 w-4" />
                          Load
                        </button>
                      </div>
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage
                    </div>
                  </div>
                </div>

              </>
            ) : !isLoading ? (
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)",
                  }}
                />

                <div className="relative flex items-center justify-center mb-6">
                  <div
                    className="w-12 h-16 rounded-lg -rotate-12 absolute -left-6"
                    style={{ backgroundColor: "#8b4a5e" }}
                  >
                    <div className="p-2 pt-3 space-y-1">
                      <div className="h-0.5 bg-white/20 rounded w-full" />
                      <div className="h-0.5 bg-white/20 rounded w-3/4" />
                      <div className="h-0.5 bg-white/20 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="w-12 h-16 rounded-lg z-10 relative" style={{ backgroundColor: "#4a4a4a" }}>
                    <div className="p-2 pt-3 space-y-1">
                      <div className="h-0.5 bg-white/30 rounded w-full" />
                      <div className="h-0.5 bg-white/30 rounded w-3/4" />
                      <div className="h-0.5 bg-white/30 rounded w-1/2" />
                    </div>
                  </div>
                  <div
                    className="w-12 h-16 rounded-lg rotate-12 absolute -right-6"
                    style={{ backgroundColor: "#6b4a3a" }}
                  >
                    <div className="p-2 pt-3 space-y-1">
                      <div className="h-0.5 bg-white/20 rounded w-full" />
                      <div className="h-0.5 bg-white/20 rounded w-3/4" />
                      <div className="h-0.5 bg-white/20 rounded w-1/2" />
                    </div>
                  </div>
                </div>

                <h2
                  className="text-xl md:text-2xl mb-3 bg-clip-text text-transparent font-semibold text-center"
                  style={{
                    backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
                    fontFamily: "var(--font-inter-tight)",
                  }}
                >
                  Professional carousels
                  <br />
                  with a single prompt
                </h2>

                <p className="text-sm text-white/50 text-center max-w-md">
                  Create engaging carousel posts for LinkedIn,
                  <br />
                  Instagram, Telegram in less than 1 minute.
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center" role="status" aria-live="assertive">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-white/50">Generating your carousel...</p>
                </div>
              </div>
            )}
          </section>

          <aside className="w-[380px] border-l border-border flex flex-col bg-background">
            {carouselData ? (
              <div className="flex flex-col h-full">
<<<<<<< HEAD
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    {selectedAction && (
                      <button
                        aria-label="Close settings"
                        onClick={() => {
                          setSelectedAction(null)
                        }}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    <span className="text-sm font-medium">
                      {selectedAction === "text" ? "Text Styling" :
                       selectedAction === "background" ? "Background Settings" :
                       selectedAction === "template" ? "Template" :
                       selectedAction === "layout" ? "Layout" :
                       selectedAction === "size" ? "Size" :
                       "Edit slide"}
                    </span>
=======
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2">
                      {selectedAction && (
                        <button
                          onClick={() => {
                            setSelectedAction(null)
                          }}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <span className="text-sm font-medium">
                        {selectedAction === "text" ? "Text Styling" :
                         selectedAction === "background" ? "Background Settings" :
                         selectedAction === "template" ? "Template" :
                         selectedAction === "layout" ? "Layout" :
                         selectedAction === "size" ? "Size" :
                         "Edit slide"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!selectedAction && (
                        <span className="text-xs text-muted-foreground">
                          {selectedSlideIndex + 1} / {carouselData.slides.length}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleUndo}
                          disabled={!canUndo(history)}
                          className="h-8 w-8"
                        >
                          <Undo2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRedo}
                          disabled={!canRedo(history)}
                          className="h-8 w-8"
                        >
                          <Redo2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
>>>>>>> origin/codex/add-undo/redo-functionality-to-carousel-generator
                  </div>

                <div className="flex-1 overflow-auto" ref={actionPanelRef}>
                  {/* Text Styling View */}
                  {selectedAction === "text" && selectedLayer ? (
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Highlight Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedLayer.style?.highlightColor || DEFAULT_HIGHLIGHT_COLOR}
                            onChange={(e) => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { highlightColor: e.target.value })}
                            className="w-12 h-10 rounded border border-white/10 bg-white/5 cursor-pointer"
                            aria-label="Select highlight color"
                          />
                          <input
                            type="text"
                            value={selectedLayer.style?.highlightColor || DEFAULT_HIGHLIGHT_COLOR}
                            onChange={(e) => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { highlightColor: e.target.value })}
                            className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20"
<<<<<<< HEAD
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
                                onClick={() => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { fontFamily: font })}
                                className={cn(
                                  "px-3 py-3 rounded-lg border transition-all text-center flex items-center justify-center",
                                  isSelected
                                    ? "bg-accent/20 border-accent text-accent"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
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
                            onChange={(e) => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { fontSize: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20 cursor-pointer"
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
                            onClick={() => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { textTransform: "capitalize" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              selectedLayer.style?.textTransform === "capitalize"
                                ? "bg-white/10 border-white/30 text-white"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            )}
                          >
                            Aa
                          </button>
                          <button
                            aria-label="Uppercase text"
                            onClick={() => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { textTransform: "uppercase" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              selectedLayer.style?.textTransform === "uppercase"
                                ? "bg-white/10 border-white/30 text-white"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            )}
                          >
                            AA
                          </button>
                          <button
                            aria-label="Lowercase text"
                            onClick={() => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { textTransform: "lowercase" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              selectedLayer.style?.textTransform === "lowercase"
                                ? "bg-white/10 border-white/30 text-white"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            )}
                          >
                            aa
                          </button>
                          <button
                            aria-label="Remove text transformation"
                            onClick={() => handleLayerStyleUpdate(selectedSlideIndex, selectedLayerId!, { textTransform: "none" })}
                            className={cn(
                              "flex-1 px-4 py-2 rounded text-sm border transition-colors",
                              !selectedLayer.style?.textTransform || selectedLayer.style?.textTransform === "none"
                                ? "bg-white/10 border-white/30 text-white"
                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            )}
                          >
                            None
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : selectedAction === "background" ? (
                    /* Background Settings View */
                    <div className="p-4 space-y-4 overflow-y-auto">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply these settings to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply background to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-white/10"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                              applyToAllSlides ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      {/* Background Type */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Background Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {BACKGROUND_TYPES.map((type) => {
                            const currentType = carouselData.slides[selectedSlideIndex]?.background?.type || DEFAULT_BACKGROUND_TYPE
                            const isSelected = currentType === type
                            return (
                              <button
                                key={type}
                                onClick={() => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { type })}
                                className={cn(
                                  "px-4 py-2.5 rounded-lg border transition-all text-sm capitalize",
                                  isSelected
                                    ? "bg-accent/20 border-accent text-accent"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                              >
                                {type}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Background Color */}
                      {carouselData.slides[selectedSlideIndex]?.background?.type !== "photo" && (
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Background Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={carouselData.slides[selectedSlideIndex]?.background?.color || DEFAULT_BACKGROUND_COLOR}
                              onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { color: e.target.value })}
                              className="w-12 h-10 rounded border border-white/10 bg-white/5 cursor-pointer"
                              aria-label="Select background color"
                            />
                            <input
                              type="text"
                              value={carouselData.slides[selectedSlideIndex]?.background?.color || DEFAULT_BACKGROUND_COLOR}
                              onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { color: e.target.value })}
                              className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20"
<<<<<<< HEAD
                              placeholder={DEFAULT_BACKGROUND_COLOR}
                              aria-label="Background color value"
                            />
                          </div>
                        </div>
                      )}

                      {/* Photo URL */}
                      {carouselData.slides[selectedSlideIndex]?.background?.type === "photo" && (
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Photo URL</label>
                          <input
                            type="text"
                            value={carouselData.slides[selectedSlideIndex]?.background?.photoUrl || ""}
                            onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { photoUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20"
                            placeholder="https://example.com/image.jpg"
                            aria-label="Background photo URL"
                          />
                        </div>
                      )}

                      {/* Accent Color */}
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Accent Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={carouselData.slides[selectedSlideIndex]?.background?.accentColor || DEFAULT_ACCENT_COLOR}
                            onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { accentColor: e.target.value })}
                            className="w-12 h-10 rounded border border-white/10 bg-white/5 cursor-pointer"
                            aria-label="Select accent color"
                          />
                          <input
                            type="text"
                            value={carouselData.slides[selectedSlideIndex]?.background?.accentColor || DEFAULT_ACCENT_COLOR}
                            onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { accentColor: e.target.value })}
                            className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20"
<<<<<<< HEAD
                            placeholder={DEFAULT_ACCENT_COLOR}
                            aria-label="Accent color value"
                          />
                        </div>
                      </div>

                      {/* Pattern Settings */}
                      <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Pattern</label>
                          <button
                            aria-label="Toggle background pattern"
                            onClick={() => {
                              const currentEnabled = carouselData.slides[selectedSlideIndex]?.background?.pattern?.enabled || false
                              handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                pattern: { enabled: !currentEnabled }
                              })
                            }}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors",
                              carouselData.slides[selectedSlideIndex]?.background?.pattern?.enabled ? "bg-accent" : "bg-white/10"
                            )}
                            aria-pressed={carouselData.slides[selectedSlideIndex]?.background?.pattern?.enabled}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                                carouselData.slides[selectedSlideIndex]?.background?.pattern?.enabled ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        {carouselData.slides[selectedSlideIndex]?.background?.pattern?.enabled && (
                          <>
                            {/* Pattern Type */}
                            <div className="space-y-2">
                              <label className="text-xs text-muted-foreground">Pattern Type</label>
                              <div className="grid grid-cols-3 gap-2">
                                {PATTERN_TYPES.map((patternType) => {
                                  const currentPattern = carouselData.slides[selectedSlideIndex]?.background?.pattern?.type
                                  const isSelected = currentPattern === patternType
                                  return (
                                    <button
                                      aria-label={`Select ${patternType} pattern`}
                                      key={patternType}
                                      onClick={() => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                        pattern: { type: patternType }
                                      })}
                                      className={cn(
                                        "px-2 py-1.5 rounded text-xs border transition-all capitalize",
                                        isSelected
                                          ? "bg-accent/20 border-accent text-accent"
                                          : "bg-white/5 border-white/10 hover:bg-white/10"
                                      )}
                                    >
                                      {patternType}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Pattern Opacity */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground">Opacity</label>
                                <button
                                  aria-label="Toggle pattern opacity adjustment"
                                  onClick={() => {
                                    const currentEnabled = carouselData.slides[selectedSlideIndex]?.background?.pattern?.opacityEnabled || false
                                    handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                      pattern: { opacityEnabled: !currentEnabled }
                                    })
                                  }}
                                  className={cn(
                                    "relative w-9 h-5 rounded-full transition-colors",
                                    carouselData.slides[selectedSlideIndex]?.background?.pattern?.opacityEnabled ? "bg-accent" : "bg-white/10"
                                  )}
                                  aria-pressed={carouselData.slides[selectedSlideIndex]?.background?.pattern?.opacityEnabled}
                                >
                                  <span
                                    className={cn(
                                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                                      carouselData.slides[selectedSlideIndex]?.background?.pattern?.opacityEnabled ? "translate-x-4" : "translate-x-0"
                                    )}
                                  />
                                </button>
                              </div>
                              {carouselData.slides[selectedSlideIndex]?.background?.pattern?.opacityEnabled && (
                                  <input
                                    type="range"
                                    min={PATTERN_OPACITY_RANGE.min}
                                    max={PATTERN_OPACITY_RANGE.max}
                                    step={PATTERN_OPACITY_RANGE.step}
                                    value={carouselData.slides[selectedSlideIndex]?.background?.pattern?.opacity || DEFAULT_PATTERN_OPACITY}
                                    onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                      pattern: { opacity: parseFloat(e.target.value) }
                                    })}
                                    className="w-full"
                                    aria-label="Pattern opacity"
                                  />
                                  aria-label="Pattern opacity"
                                />
>>>>>>> origin/codex/add-accessibility-features-to-carousel-components
                              )}
                            </div>

                            {/* Pattern Scale */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground">Scale</label>
                                <button
                                  aria-label="Toggle pattern scale adjustment"
                                  onClick={() => {
                                    const currentEnabled = carouselData.slides[selectedSlideIndex]?.background?.pattern?.scaleEnabled || false
                                    handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                      pattern: { scaleEnabled: !currentEnabled }
                                    })
                                  }}
                                  className={cn(
                                    "relative w-9 h-5 rounded-full transition-colors",
                                    carouselData.slides[selectedSlideIndex]?.background?.pattern?.scaleEnabled ? "bg-accent" : "bg-white/10"
                                  )}
                                  aria-pressed={carouselData.slides[selectedSlideIndex]?.background?.pattern?.scaleEnabled}
                                >
                                  <span
                                    className={cn(
                                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                                      carouselData.slides[selectedSlideIndex]?.background?.pattern?.scaleEnabled ? "translate-x-4" : "translate-x-0"
                                    )}
                                  />
                                </button>
                              </div>
                              {carouselData.slides[selectedSlideIndex]?.background?.pattern?.scaleEnabled && (
                                  <input
                                    type="range"
                                    min={PATTERN_SCALE_RANGE.min}
                                    max={PATTERN_SCALE_RANGE.max}
                                    step={PATTERN_SCALE_RANGE.step}
                                    value={carouselData.slides[selectedSlideIndex]?.background?.pattern?.scale || DEFAULT_PATTERN_SCALE}
                                    onChange={(e) => handleBackgroundUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                      pattern: { scale: parseFloat(e.target.value) }
                                    })}
                                    className="w-full"
                                    aria-label="Pattern scale"
                                  />
                                  aria-label="Pattern scale"
                                />
>>>>>>> origin/codex/add-accessibility-features-to-carousel-components
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : selectedAction === "size" ? (
                    /* Size Settings View */
                    <div className="p-4 space-y-4">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply this size to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply size to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-white/10"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
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
                              const currentSize = carouselData.slides[selectedSlideIndex]?.size || DEFAULT_SIZE
                              const isSelected = currentSize === option.value
                            return (
                              <button
                                aria-label={`Select ${option.label} aspect ratio`}
                                key={option.value}
                                onClick={() => handleSizeUpdate(applyToAllSlides ? "all" : selectedSlideIndex, option.value)}
                                className={cn(
                                  "flex-1 flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                  isSelected
                                    ? "bg-white/5 border-accent"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
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
                  ) : selectedAction === "template" ? (
                    /* Template Selection View */
                    <div className="p-4 space-y-4">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply this template to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply template to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-white/10"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
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
                                  : [selectedSlideIndex]
                                
                                const updatedSlides = carouselData.slides.map((slide, index) => {
                                  if (slidesToUpdate.includes(index)) {
                                    return template.apply(slide)
                                  }
                                  return slide
                                })
                                const updatedData = { ...carouselData, slides: updatedSlides }
                                updateCarouselData(updatedData, "Template applied")
                              }}
                              className="group relative overflow-hidden rounded-lg border-2 border-white/10 hover:border-accent/50 transition-all bg-white/5 hover:bg-white/10"
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
                                      <div className="h-2 bg-white/30 rounded" style={{ width: "80%" }} />
                                      <div className="h-2 bg-white/20 rounded" style={{ width: "60%" }} />
                                    </div>
                                  </div>
                                )}
                                {template.preview.layout === "top" && (
                                  <div className="absolute top-8 left-8 right-8 space-y-2">
                                    <div className="h-2 bg-white/30 rounded" style={{ width: "90%" }} />
                                    <div className="h-2 bg-white/20 rounded" style={{ width: "70%" }} />
                                  </div>
                                )}
                                {template.preview.layout === "split" && (
                                  <div className="absolute inset-0 flex">
                                    <div className="flex-1 p-4 space-y-2">
                                      <div className="h-2 bg-white/30 rounded" />
                                      <div className="h-2 bg-white/20 rounded" />
                                    </div>
                                    <div className="w-px bg-white/10" />
                                    <div className="flex-1 p-4 space-y-2">
                                      <div className="h-2 bg-white/20 rounded" />
                                      <div className="h-2 bg-white/10 rounded" />
                                    </div>
                                  </div>
                                )}
                                {template.preview.layout === "minimal" && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2/3 h-1 bg-white/20 rounded" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Template Info */}
                              <div className="p-3 border-t border-white/10 bg-background/80 backdrop-blur-sm">
                                <div className="font-medium text-sm mb-0.5">{template.name}</div>
                                <div className="text-xs text-muted-foreground">{template.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : selectedAction === "layout" ? (
                    /* Layout Settings View */
                    <div className="p-4 space-y-6">
                      {/* Apply to all slides toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <label className="text-sm font-medium">Apply to all slides</label>
                          <p className="text-xs text-muted-foreground">Apply these settings to all slides</p>
                        </div>
                        <button
                          aria-label="Toggle apply layout to all slides"
                          onClick={() => setApplyToAllSlides(!applyToAllSlides)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            applyToAllSlides ? "bg-accent" : "bg-white/10"
                          )}
                          aria-pressed={applyToAllSlides}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                              applyToAllSlides ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      {/* Padding Section */}
                      <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">PADDING</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-white/5 border border-white/10">
                              <Layout className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Content Padding</span>
                                <span className="text-sm font-medium">
                                  {carouselData.slides[selectedSlideIndex]?.layout?.padding || DEFAULT_PADDING}px
                                </span>
                              </div>
                              <input
                                  type="range"
                                  min={PADDING_RANGE.min}
                                  max={PADDING_RANGE.max}
                                  step={PADDING_RANGE.step}
                                value={carouselData.slides[selectedSlideIndex]?.layout?.padding || DEFAULT_PADDING}
                                onChange={(e) => handleLayoutUpdate(applyToAllSlides ? "all" : selectedSlideIndex, { 
                                  padding: parseInt(e.target.value) 
                                })}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alignment Section */}
                      <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
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
                                const currentAlign = carouselData.slides[selectedSlideIndex]?.layout?.horizontalAlign || DEFAULT_HORIZONTAL_ALIGN
                              const isSelected = currentAlign === value
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleLayoutUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                    horizontalAlign: value
                                  })}
                                  className={cn(
                                    "flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all",
                                    isSelected
                                      ? "bg-accent border-accent"
                                      : "bg-white/5 border-white/10 hover:border-white/20"
                                  )}
                                  aria-label={`Align text ${value}`}
                                >
                                  <Icon className={cn(
                                    "w-5 h-5",
                                    isSelected ? "text-white" : "text-muted-foreground"
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
                                const currentAlign = carouselData.slides[selectedSlideIndex]?.layout?.verticalAlign || DEFAULT_VERTICAL_ALIGN
                              const isSelected = currentAlign === value
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleLayoutUpdate(applyToAllSlides ? "all" : selectedSlideIndex, {
                                    verticalAlign: value
                                  })}
                                  className={cn(
                                    "flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all",
                                    isSelected
                                      ? "bg-accent border-accent"
                                      : "bg-white/5 border-white/10 hover:border-white/20"
                                  )}
                                  aria-label={`Align content ${value}`}
                                >
                                  <Icon className={cn(
                                    "w-5 h-5",
                                    isSelected ? "text-white" : "text-muted-foreground"
                                  )} />
                                </button>
                              )
                            })}
                          </div>
                        </div>
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
                          selectedLayerId === layer.id ? "bg-white/10" : "hover:bg-white/5"
                        } ${draggedLayerId === layer.id ? "opacity-50" : ""}`}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleSelectLayer(layer.id)
                          }
                        }}
                        aria-pressed={selectedLayerId === layer.id}
                        aria-label={`Select ${layer.type} layer`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground px-1.5 py-0.5 bg-white/5 rounded">
                                {layer.type}
                              </span>
                              {!layer.visible && <span className="text-[10px] text-muted-foreground">(hidden)</span>}
                            </div>
                            <p className={`text-sm truncate ${!layer.visible ? "text-muted-foreground" : ""}`}>
                              {layer.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              aria-label={layer.visible ? "Hide layer" : "Show layer"}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLayerVisibility(selectedSlideIndex, layer.id)
                              }}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              {layer.visible ? (
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                              )}
                            </button>
                            <button
                              aria-label="Delete layer"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteLayer(selectedSlideIndex, layer.id)
                              }}
                              className="p-1 rounded hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedLayer && (
                    <div className="p-4 border-t border-border bg-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">Edit layer</span>
                        <select
                          value={selectedLayer.type}
                          onChange={(e) => {
                            if (!carouselData) return
                            const updatedSlides = carouselData.slides.map((slide, index) => {
                              if (index === selectedSlideIndex) {
                                return {
                                  ...slide,
                                  layers: slide.layers.map((l) =>
                                    l.id === selectedLayerId ? { ...l, type: e.target.value as Layer["type"] } : l,
                                  )
                                }
                              }
                              return slide
                            })
                              const updatedData = { ...carouselData, slides: updatedSlides }
                              updateCarouselData(updatedData, "Changes saved")
                            }}
                          className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 cursor-pointer"
                        >
                          <option value="heading">Heading</option>
                          <option value="subheading">Subheading</option>
                          <option value="body">Body</option>
                        </select>
                      </div>
                      <textarea
                        value={selectedLayer.content}
                        onChange={(e) => handleLayerUpdate(selectedSlideIndex, selectedLayerId!, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20 transition-colors resize-none"
                        placeholder="Enter text..."
                        aria-label="Layer content"
                      />
                      <div className="flex items-center justify-end mt-3">
                        <div aria-live="polite" className="sr-only">
                          {savedStatus || ""}
                        </div>
                        {savedStatus && (
                          <span className="flex items-center gap-1.5 text-xs text-green-400">
                            <Check className="w-3 h-3" />
                            {savedStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Add layer</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAddLayer(selectedSlideIndex, "heading")}
                        className="px-3 py-1.5 text-xs rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Heading
                      </button>
                      <button
                        onClick={() => handleAddLayer(selectedSlideIndex, "subheading")}
                        className="px-3 py-1.5 text-xs rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Subheading
                      </button>
                      <button
                        onClick={() => handleAddLayer(selectedSlideIndex, "body")}
                        className="px-3 py-1.5 text-xs rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Body
                      </button>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex items-center border-b border-border px-4 py-3">
                  <span className="text-sm font-medium">AI writer</span>
                </div>
                <div className="flex-1 overflow-auto px-4 py-4">
                  <ErrorBoundary componentName="CarouselForm">
                    <CarouselForm onGenerate={handleGenerate} isLoading={isLoading} setIsLoading={setIsLoading} />
                  </ErrorBoundary>
                </div>
              </div>
            )}
          </aside>
        </div>
        
        <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard shortcuts</DialogTitle>
              <DialogDescription>Work faster with these quick keys.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              {shortcutDefinitions.map((shortcut) => (
                <div key={shortcut.label} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{shortcut.label}</span>
                  <KbdGroup>
                    {shortcut.keys.map((key, index) => (
                      <Kbd key={`${shortcut.label}-${key}-${index}`}>{key}</Kbd>
                    ))}
                  </KbdGroup>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
<<<<<<< HEAD
    </ErrorBoundary>
=======

    {isLoadModalOpen && (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 py-6">
        <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Load saved carousel</p>
              <p className="text-xs text-muted-foreground">Select a carousel saved in your browser.</p>
            </div>
            <button
              onClick={() => setIsLoadModalOpen(false)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-auto divide-y divide-border">
            {savedCarousels.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No saved carousels yet. Try saving your current work.</div>
            ) : (
              savedCarousels.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleLoadCarouselSelection(entry)}
                  className="w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">{entry.data.topic}</p>
                      <p className="text-xs text-muted-foreground">{entry.data.platform}</p>
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
>>>>>>> origin/codex/implement-carousel-save/load-with-localstorage
  )
}
