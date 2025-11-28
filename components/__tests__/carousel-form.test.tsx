import React from "react"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CarouselForm } from "@/components/carousel-form"
import type { CarouselData } from "@/lib/carousel-types"

const mockCarousel: CarouselData = {
  topic: "Testing",
  platform: "linkedin",
  slides: [
    { index: 0, type: "title", title: "Slide 1", layers: [] },
  ],
  summary: "Summary",
}

const createFetchMock = (response: Partial<Response> & { json?: () => Promise<unknown>; text?: () => Promise<string> }) => {
  const mock = jest.fn().mockResolvedValue({
    ok: true,
    headers: { get: () => "application/json" },
    json: async () => mockCarousel,
    ...response,
  })
  // @ts-expect-error - override global fetch for tests
  global.fetch = mock
  return mock
}

describe("CarouselForm", () => {
  afterEach(() => {
    cleanup()
    // @ts-expect-error - cleanup mock
    delete global.fetch
  })

  it("validates required topic input", async () => {
    const user = userEvent.setup()
    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    await user.click(screen.getByRole("button", { name: "Generate carousel with AI" }))

    expect(await screen.findByText(/Topic must be at least 3 characters/)).toBeInTheDocument()
  })

  it("updates the selected tone when a button is clicked", async () => {
    const user = userEvent.setup()
    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    const boldButton = screen.getByRole("button", { name: "Use a bold tone" })
    const professionalButton = screen.getByRole("button", { name: "Use a professional tone" })

    expect(boldButton).toHaveAttribute("aria-pressed", "false")
    await user.click(boldButton)
    expect(boldButton).toHaveAttribute("aria-pressed", "true")
    expect(professionalButton).toHaveAttribute("aria-pressed", "false")
  })

  it("submits the form and forwards carousel data", async () => {
    const user = userEvent.setup()
    const onGenerate = jest.fn()
    const setIsLoading = jest.fn()
    const fetchMock = createFetchMock({})

    render(<CarouselForm onGenerate={onGenerate} isLoading={false} setIsLoading={setIsLoading} />)

    await user.type(screen.getByPlaceholderText("How to grow on LinkedIn in 2025"), "AI tips")
    await user.type(screen.getByPlaceholderText(/Explain what the user will learn/), "Learn fast")
    await user.click(screen.getByRole("button", { name: "Use a friendly tone" }))
    await user.click(screen.getByRole("button", { name: "Generate carousel with AI" }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/generate",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: "AI tips", platform: "linkedin", goal: "Learn fast", tone: "friendly" }),
        }),
      )
      expect(onGenerate).toHaveBeenCalledWith(mockCarousel)
      expect(setIsLoading).toHaveBeenCalledWith(true)
      expect(setIsLoading).toHaveBeenCalledWith(false)
    })
  })

  it("shows the loading state while submitting", () => {
    render(<CarouselForm onGenerate={jest.fn()} isLoading={true} setIsLoading={jest.fn()} />)

    expect(screen.getByRole("button", { name: "Generate carousel with AI" })).toBeDisabled()
    expect(screen.getByText("Generating...", { exact: false })).toBeInTheDocument()
  })

  it("displays an error message when the request fails", async () => {
    const user = userEvent.setup()
    createFetchMock({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "Server error",
      headers: { get: () => "text/plain" },
    })

    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    await user.type(screen.getByPlaceholderText("How to grow on LinkedIn in 2025"), "AI topic")
    await user.click(screen.getByRole("button", { name: "Generate carousel with AI" }))

    await waitFor(() => {
      expect(screen.getByText(/Server error/)).toBeInTheDocument()
    })
  })
})
