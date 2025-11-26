import type { CarouselData } from "@/lib/carousel-types"

function formatTimestamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`
}

export function exportCarouselToJSON(carousel: CarouselData) {
  const timestamp = formatTimestamp(new Date())
  const filename = `carousel-${timestamp}.json`

  const json = JSON.stringify(carousel, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
