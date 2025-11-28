import { deleteCarousel, loadCarousel, saveCarousel } from "@/lib/storage"
import type { CarouselData } from "@/lib/carousel-types"

describe("storage", () => {
  const baseCarousel: CarouselData = {
    topic: "Testing",
    platform: "linkedin",
    summary: "Summary",
    slides: [
      {
        index: 0,
        type: "text",
        title: "Title",
        content: "Content",
        layers: [],
      },
    ],
  }

  beforeEach(() => {
    window.localStorage.clear()
  })

  it("saves a carousel entry and returns metadata", () => {
    const entry = saveCarousel(baseCarousel)
    const stored = JSON.parse(window.localStorage.getItem("carousel-generator-saves") || "[]")

    expect(entry.id).toMatch(/carousel-\d+-[a-z0-9]{6}/)
    expect(stored[0].id).toBe(entry.id)
    expect(stored[0].data.topic).toBe("Testing")
  })

  it("loads only valid stored carousels", () => {
    window.localStorage.setItem(
      "carousel-generator-saves",
      JSON.stringify([
        { id: "valid", data: baseCarousel, savedAt: 1 },
        { id: 123, data: baseCarousel },
        null,
      ]),
    )

    const loaded = loadCarousel()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].id).toBe("valid")
  })

  it("removes entries by id", () => {
    const first = saveCarousel(baseCarousel)
    const second = saveCarousel({ ...baseCarousel, topic: "Another" })

    deleteCarousel(first.id)

    const stored = loadCarousel()
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(second.id)
  })

  it("throws descriptive errors when storage is unavailable", () => {
    const originalWindow = global.window
    // @ts-expect-error - simulate non-browser environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).window

    expect(() => saveCarousel(baseCarousel)).toThrow("Local storage is not available")
    expect(() => deleteCarousel("id" as string)).toThrow("Local storage is not available")

    global.window = originalWindow
  })

  it("handles quota errors with user-friendly message", () => {
    const quotaError = new DOMException("", "QuotaExceededError")
    const spy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw quotaError
    })

    expect(() => saveCarousel(baseCarousel)).toThrow("Storage quota exceeded")
    spy.mockRestore()
  })

  it("handles unexpected storage errors", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("boom")
    })

    expect(() => saveCarousel(baseCarousel)).toThrow("Unable to save carousel data")
    spy.mockRestore()
  })
})
