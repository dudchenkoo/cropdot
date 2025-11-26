import React from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SlideCard } from "@/components/slide-card"
import type { Slide } from "@/lib/carousel-types"

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}))

afterEach(() => {
  cleanup()
})

describe("SlideCard", () => {
  const baseSlide: Slide = {
    index: 0,
    type: "title",
    title: "Base title",
    layers: [],
    size: "4:5",
  }

  it("renders different slide types correctly", () => {
    const { rerender } = render(
      <SlideCard slide={{ ...baseSlide, type: "title", title: "Hero Title" }} index={0} total={1} />,
    )
    expect(screen.getByText("Hero Title")).toBeInTheDocument()

    rerender(
      <SlideCard
        slide={{
          ...baseSlide,
          type: "text",
          title: "Section Heading",
          content: "Section body",
        }}
        index={0}
        total={1}
      />,
    )
    expect(screen.getByText("Section Heading")).toBeInTheDocument()
    expect(screen.getByText("Section body")).toBeInTheDocument()

    rerender(
      <SlideCard
        slide={{
          ...baseSlide,
          type: "list",
          title: "List title",
          bullets: ["First bullet", "Second bullet"],
        }}
        index={0}
        total={1}
      />,
    )
    expect(screen.getByText("First bullet")).toBeInTheDocument()

    rerender(<SlideCard slide={{ ...baseSlide, type: "quote", body: "Inspirational quote" }} index={0} total={1} />)
    expect(screen.getByText("Inspirational quote")).toBeInTheDocument()

    rerender(
      <SlideCard slide={{ ...baseSlide, type: "cta", title: "Call to Action", body: "Do the thing" }} index={0} total={1} />,
    )
    expect(screen.getByText("Call to Action")).toBeInTheDocument()
    expect(screen.getByText("Do the thing")).toBeInTheDocument()
  })

  it("applies text styles to layers", () => {
    render(
      <SlideCard
        slide={{
          ...baseSlide,
          layers: [
            {
              id: "layer-1",
              type: "heading",
              content: "Styled Heading",
              visible: true,
              style: {
                fontFamily: "Inter",
                fontSize: "xl",
                textTransform: "uppercase",
                highlightColor: "#ff00ff",
              },
            },
          ],
        }}
        index={0}
        total={1}
      />,
    )

    const heading = screen.getByText("Styled Heading") as HTMLElement
    expect(heading.style.fontFamily).toContain("var(--font-inter)")
    expect(heading.style.fontSize).toBe("1.25rem")
    expect(heading.style.textTransform).toBe("uppercase")
    expect(heading.style.backgroundColor).toBe("rgb(255, 0, 255)")
    expect(heading.style.padding).toBe("0.125rem 0.25rem")
  })

  it("applies background colors and patterns", () => {
    const { container } = render(
      <SlideCard
        slide={{
          ...baseSlide,
          background: {
            type: "color",
            color: "#123456",
            accentColor: "#abcdef",
            pattern: {
              type: "dots",
              enabled: true,
              opacity: 0.4,
              opacityEnabled: true,
              scale: 2,
              scaleEnabled: true,
            },
          },
        }}
        index={0}
        total={1}
      />,
    )

    const card = container.firstElementChild as HTMLElement
    expect(card.style.backgroundColor).toBe("rgb(18, 52, 86)")
    expect(card.style.backgroundImage).toContain("radial-gradient")
  })

  it("applies layout settings for padding and alignment", () => {
    const { container } = render(
      <SlideCard
        slide={{
          ...baseSlide,
          layers: [
            {
              id: "aligned",
              type: "heading",
              content: "Aligned Heading",
              visible: true,
            },
          ],
          layout: {
            padding: 24,
            horizontalAlign: "center",
            verticalAlign: "top",
          },
        }}
        index={0}
        total={1}
      />,
    )

    const inner = container.querySelector(".flex-1") as HTMLElement
    const layersContainer = container.querySelector(".space-y-2") as HTMLElement
    expect(inner.style.padding).toBe("24px")
    expect(inner.className).toContain("justify-start")
    expect(layersContainer.className).toContain("text-center")
  })

  it("shows delete button and calls onDelete", () => {
    const onDelete = vi.fn()
    render(<SlideCard slide={baseSlide} index={0} total={2} onDelete={onDelete} />)

    const deleteButton = screen.getByTitle("Delete slide")
    expect(deleteButton).toBeInTheDocument()
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalledWith(0)
  })

  it("renders compact mode correctly", () => {
    const { container } = render(
      <SlideCard slide={{ ...baseSlide, title: "Compact" }} index={0} total={3} compact />,
    )

    const card = container.firstElementChild as HTMLElement
    expect(card.className).toContain("w-full")
    expect(card.className).toContain("p-4")

    const metadata = container.querySelector(".mt-4") as HTMLElement
    expect(metadata.className).toContain("hidden")
  })
})
