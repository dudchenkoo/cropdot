import React from "react"
import { render, screen, within } from "@testing-library/react"
import {
  generateLayerId,
  getBackgroundStyle,
  getContentFromLayers,
  getLayerStyles,
  slideToLayers,
} from "@/lib/helpers"
import type { Slide } from "@/lib/carousel-types"
import { renderTextWithHighlights } from "@/components/slide-card"

describe("helpers", () => {
  const sampleSlide: Slide = {
    index: 0,
    type: "text",
    title: "Title",
    hook: "Hook",
    body: "Body",
    content: "Content",
    bullets: ["One", "Two"],
    layers: [],
  }

  it("generates unique layer ids", () => {
    const first = generateLayerId()
    const second = generateLayerId()

    expect(first).not.toEqual(second)
    expect(first).toMatch(/^layer-\d+-[a-z0-9]{9}$/)
  })

  it("builds background styles for photos and overlays", () => {
    const photoStyle = getBackgroundStyle({
      type: "photo",
      photoUrl: "https://example.com/photo.jpg",
      overlayColor: "#000000",
      overlayOpacity: 0.4,
    })

    expect(photoStyle.backgroundImage).toContain("linear-gradient")
    expect(photoStyle.backgroundImage).toContain("photo.jpg")
    expect(photoStyle.backgroundSize).toBe("cover")
  })

  it("builds patterned background styles", () => {
    const patternStyle = getBackgroundStyle({
      type: "color",
      color: "#123456",
      accentColor: "#abcdef",
      pattern: { type: "grid", enabled: true, opacityEnabled: true, opacity: 0.6, scaleEnabled: true, scale: 1.5 },
    })

    expect(patternStyle.backgroundColor).toBe("#123456")
    expect(patternStyle.backgroundImage).toContain("linear-gradient")
    expect(patternStyle.backgroundSize).toContain("30")
  })

  it("derives layer styles including typography and decorations", () => {
    const { style } = getLayerStyles(
      {
        id: "styled",
        type: "heading",
        content: "Hello",
        visible: true,
        style: {
          fontFamily: "Inter",
          fontSize: "lg",
          textTransform: "uppercase",
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
      },
      false,
    )

    expect(style.fontFamily).toContain("var(--font-inter)")
    expect(style.fontSize).toBe("1.125rem")
    expect(style.textTransform).toBe("uppercase")
    expect(style.fontWeight).toBe("bold")
    expect(style.fontStyle).toBe("italic")
    expect(style.textDecoration).toContain("line-through")
  })

  it("extracts visible layer content with fallbacks", () => {
    const content = getContentFromLayers(
      [
        { id: "h", type: "heading", content: "Heading", visible: true },
        { id: "sub", type: "subheading", content: "Sub", visible: false },
        { id: "body", type: "body", content: "Body text", visible: true },
        { id: "bullet", type: "bullet", content: "Item 1", visible: true },
      ],
      sampleSlide,
    )

    expect(content.heading).toBe("Heading")
    expect(content.subheading).toBe("")
    expect(content.body).toBe("Body text")
    expect(content.bullets).toEqual(["Item 1"])

    const fallbackContent = getContentFromLayers(undefined, sampleSlide)
    expect(fallbackContent.heading).toBe("Title")
    expect(fallbackContent.body).toBe("Body")
    expect(fallbackContent.bullets).toEqual(["One", "Two"])
  })

  it("converts slide primitives into layer objects", () => {
    const layers = slideToLayers({ ...sampleSlide, layers: [] })

    expect(layers).toHaveLength(4)
    expect(layers.map((l) => l.type)).toEqual(["heading", "body", "bullet", "bullet"])
    expect(new Set(layers.map((l) => l.id)).size).toBe(layers.length)
  })

  it("renders text with highlight markers", () => {
    render(<div data-testid="wrapper">{renderTextWithHighlights("Normal ==highlight== text", undefined, "#ffff00", "", {})}</div>)

    const wrapper = screen.getByTestId("wrapper")
    const highlight = within(wrapper).getByText("highlight") as HTMLElement

    expect(highlight.style.backgroundColor).toBe("rgb(255, 255, 0)")
    expect(wrapper.textContent).toBe("Normal highlight text")
  })
})
