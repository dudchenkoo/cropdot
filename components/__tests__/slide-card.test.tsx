import React from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { SlideCard } from "@/components/slide-card"
import type { Slide } from "@/lib/carousel-types"

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => <button {...props}>{children}</button>,
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
    background: {
      type: "color",
      color: "#123456",
      accentColor: "#abcdef",
      pattern: { type: "dots", enabled: true, opacityEnabled: true, opacity: 0.4, scaleEnabled: true, scale: 2 },
    },
  }

  it("renders layer content with styles and highlights", () => {
    render(
      <SlideCard
        slide={{
          ...baseSlide,
          layers: [
            {
              id: "layer-1",
              type: "heading",
              content: "Styled ==Heading==",
              visible: true,
              style: {
                fontFamily: "Inter",
                fontSize: "xl",
                textTransform: "uppercase",
              },
            },
            { id: "layer-2", type: "body", content: "Body text", visible: true },
          ],
        }}
        index={0}
        total={1}
      />,
    )

    const heading = screen.getByText("Heading") as HTMLElement
    expect(heading.style.fontFamily).toContain("var(--font-inter)")
    expect(heading.style.fontSize).toBe("1.25rem")
    expect(heading.style.textTransform).toBe("uppercase")
    expect(heading.style.backgroundColor).toBe("rgb(255, 255, 255)")
    expect(screen.getByText("Body text")).toBeInTheDocument()
  })

  it("applies background styles from slide data", () => {
    const { container } = render(<SlideCard slide={baseSlide} index={0} total={1} />)
    const card = container.firstElementChild as HTMLElement

    expect(card.style.backgroundColor).toBe("rgb(18, 52, 86)")
    expect(card.style.backgroundSize).toBe("40px 40px")
  })

  it("respects layout alignment and padding", () => {
    const { container } = render(
      <SlideCard
        slide={{
          ...baseSlide,
          layers: [{ id: "aligned", type: "heading", content: "Aligned", visible: true }],
          layout: { padding: 24, horizontalAlign: "center", verticalAlign: "top" },
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

  it("renders compact mode with condensed spacing", () => {
    const { container } = render(<SlideCard slide={{ ...baseSlide, title: "Compact" }} index={0} total={3} compact />)

    const card = container.firstElementChild as HTMLElement
    expect(card.className).toContain("w-full")
    expect(card.className).toContain("p-4")
  })
})
