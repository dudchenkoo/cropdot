import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import JSZip from "jszip"
import type { CarouselData } from "@/lib/carousel-types"

type ImageFormat = "png" | "jpg"

interface ExportBaseOptions {
  filenamePrefix?: string
  scale?: number
}

interface ExportImageOptions extends ExportBaseOptions {
  format?: ImageFormat
  quality?: number
}

function formatTimestamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`
}

function normalizePrefix(prefix: string | undefined) {
  return prefix?.trim().toLowerCase().replace(/[^a-z0-9-_]/gi, "-") || "carousel"
}

function buildFilename(prefix: string | undefined, extension: string) {
  const timestamp = formatTimestamp(new Date())
  const safePrefix = normalizePrefix(prefix)
  return `${safePrefix}-${timestamp}.${extension}`
}

function dataUrlToBlob(dataUrl: string) {
  const [header, data] = dataUrl.split(",")
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : "image/png"
  const binary = atob(data)
  const array = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }

  return new Blob([array], { type: mime })
}

async function renderSlideToCanvas(element: HTMLElement, scale = 2) {
  return html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })
}

export async function exportCarouselToPDF(slideElements: HTMLElement[], options?: ExportBaseOptions) {
  if (!slideElements.length) {
    throw new Error("No slides provided for PDF export")
  }

  const scale = options?.scale ?? 2
  const filename = buildFilename(options?.filenamePrefix, "pdf")

  const firstCanvas = await renderSlideToCanvas(slideElements[0], scale)
  const firstOrientation = firstCanvas.width >= firstCanvas.height ? "l" : "p"

  const pdf = new jsPDF({
    orientation: firstOrientation,
    unit: "px",
    format: [firstCanvas.width, firstCanvas.height],
    compress: true,
  })

  pdf.addImage(firstCanvas.toDataURL("image/png"), "PNG", 0, 0, firstCanvas.width, firstCanvas.height)

  for (let i = 1; i < slideElements.length; i++) {
    const canvas = await renderSlideToCanvas(slideElements[i], scale)
    const orientation = canvas.width >= canvas.height ? "l" : "p"
    pdf.addPage([canvas.width, canvas.height], orientation)
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height)
  }

  pdf.save(filename)
}

export async function exportSlideToImage(element: HTMLElement, options?: ExportImageOptions) {
  const format: ImageFormat = options?.format ?? "png"
  const scale = options?.scale ?? 2
  const quality = options?.quality ?? 0.92
  const filename = buildFilename(options?.filenamePrefix, format)

  const canvas = await renderSlideToCanvas(element, scale)
  const mimeType = format === "png" ? "image/png" : "image/jpeg"
  const dataUrl = canvas.toDataURL(mimeType, quality)
  const blob = dataUrlToBlob(dataUrl)
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportAllSlidesToImages(slideElements: HTMLElement[], options?: ExportImageOptions) {
  if (!slideElements.length) {
    throw new Error("No slides provided for image export")
  }

  const format: ImageFormat = options?.format ?? "png"
  const scale = options?.scale ?? 2
  const quality = options?.quality ?? 0.92
  const filenamePrefix = options?.filenamePrefix
  const safePrefix = normalizePrefix(filenamePrefix)
  const zip = new JSZip()

  for (const [index, element] of slideElements.entries()) {
    const canvas = await renderSlideToCanvas(element, scale)
    const mimeType = format === "png" ? "image/png" : "image/jpeg"
    const dataUrl = canvas.toDataURL(mimeType, quality)
    const blob = dataUrlToBlob(dataUrl)
    const slideFilename = `${safePrefix}-slide-${index + 1}.${format}`

    zip.file(slideFilename, blob)
  }

  const archive = await zip.generateAsync({ type: "blob" })
  const url = URL.createObjectURL(archive)
  const zipName = buildFilename(safePrefix, "zip")

  const link = document.createElement("a")
  link.href = url
  link.download = zipName
  link.click()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportCarouselToJSON(carousel: CarouselData) {
  const filename = buildFilename("carousel", "json")

  const json = JSON.stringify(carousel, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
