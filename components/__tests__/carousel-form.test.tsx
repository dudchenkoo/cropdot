import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CarouselForm } from "../carousel-form"
import type { CarouselData } from "@/lib/carousel-types"

describe("CarouselForm", () => {
  const setupFetchMock = (impl?: jest.Mock) => {
    const fetchMock = impl ?? jest.fn()
    ;(global as unknown as { fetch: jest.Mock }).fetch = fetchMock
    return fetchMock
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupFetchMock()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders all form fields correctly", () => {
    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    expect(screen.getByPlaceholderText("How to grow on LinkedIn in 2025")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(
        "Explain what the user will learn, why it matters, and what action they should take.",
      ),
    ).toBeInTheDocument()

    expect(screen.getByText("Platform")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "LinkedIn" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Instagram" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Telegram" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Threads" })).toBeInTheDocument()

    expect(screen.getByText("Tone")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Professional" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Friendly" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Storytelling" })).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Generate with AI" })).toBeInTheDocument()
    expect(screen.getByText(/AI will generate 8–10 slides/)).toBeInTheDocument()
  })

  it("prevents submission when the topic is empty", async () => {
    const onGenerate = jest.fn()
    const setIsLoading = jest.fn()
    const fetchMock = setupFetchMock()

    render(<CarouselForm onGenerate={onGenerate} isLoading={false} setIsLoading={setIsLoading} />)

    const form = screen.getByText(/AI will generate 8–10 slides/).closest("form") as HTMLFormElement
    fireEvent.submit(form)

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled()
      expect(onGenerate).not.toHaveBeenCalled()
      expect(setIsLoading).not.toHaveBeenCalled()
    })
  })

  it("updates the selected platform when a button is clicked", async () => {
    const user = userEvent.setup()
    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    const instagramButton = screen.getByRole("button", { name: "Instagram" })
    const linkedInButton = screen.getByRole("button", { name: "LinkedIn" })

    await user.click(instagramButton)

    expect(instagramButton).toHaveStyle({ borderColor: "#E4405F80" })
    expect(linkedInButton).not.toHaveStyle({ borderColor: "#0077B580" })
  })

  it("updates the selected tone when a button is clicked", async () => {
    const user = userEvent.setup()
    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    const boldButton = screen.getByRole("button", { name: "Bold" })
    const professionalButton = screen.getByRole("button", { name: "Professional" })

    await user.click(boldButton)

    expect(boldButton).toHaveClass("border-white/30", "bg-white/10")
    expect(professionalButton).not.toHaveClass("border-white/30")
  })

  it("submits the form and calls onGenerate with the correct payload", async () => {
    const user = userEvent.setup()
    const onGenerate = jest.fn()
    const setIsLoading = jest.fn()

    const mockData: CarouselData = {
      topic: "My Topic",
      platform: "telegram",
      slides: [
        {
          index: 0,
          type: "title",
          layers: [],
          title: "Slide 1",
        },
      ],
      summary: "Summary",
    }

    const fetchMock = setupFetchMock(
      jest.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => mockData,
      }),
    )

    render(<CarouselForm onGenerate={onGenerate} isLoading={false} setIsLoading={setIsLoading} />)

    await user.type(screen.getByPlaceholderText("How to grow on LinkedIn in 2025"), "AI tips")
    await user.type(screen.getByPlaceholderText(/Explain what the user will learn/), "Learn fast")
    await user.click(screen.getByRole("button", { name: "Telegram" }))
    await user.click(screen.getByRole("button", { name: "Friendly" }))
    await user.click(screen.getByRole("button", { name: "Generate with AI" }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/generate",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: "AI tips", platform: "telegram", goal: "Learn fast", tone: "friendly" }),
        }),
      )
      expect(onGenerate).toHaveBeenCalledWith(mockData)
      expect(setIsLoading).toHaveBeenCalledWith(true)
      expect(setIsLoading).toHaveBeenCalledWith(false)
    })
  })

  it("shows the loading state while the request is in progress", () => {
    render(<CarouselForm onGenerate={jest.fn()} isLoading={true} setIsLoading={jest.fn()} />)

    expect(screen.getByRole("button", { name: "Generating..." })).toBeDisabled()
    expect(screen.getByText("Generating...")).toBeInTheDocument()
  })

  it("displays an error message when the request fails", async () => {
    const user = userEvent.setup()
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})

    setupFetchMock(
      jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Server error",
        headers: { get: () => "text/plain" },
      }),
    )

    render(<CarouselForm onGenerate={jest.fn()} isLoading={false} setIsLoading={jest.fn()} />)

    await user.type(screen.getByPlaceholderText("How to grow on LinkedIn in 2025"), "AI topic")
    await user.click(screen.getByRole("button", { name: "Generate with AI" }))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Server error")
    })
  })
})
