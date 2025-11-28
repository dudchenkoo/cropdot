import { jest } from "@jest/globals"
import { POST } from "../route"

describe("POST /api/generate", () => {
  const createRequest = (body: unknown) =>
    new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

  it("returns mock carousel data for a valid request", async () => {
    const response = await POST(createRequest({ topic: "Design Systems", platform: "Instagram" }))
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.topic).toBe("Design Systems")
    expect(data.platform).toBe("Instagram")
    expect(Array.isArray(data.slides)).toBe(true)
    expect(data.slides.length).toBeGreaterThan(0)
  })

  it("returns 400 when topic is missing", async () => {
    const response = await POST(createRequest({ platform: "LinkedIn" }))

    expect(response.status).toBe(400)
    const error = await response.json()
    expect(error.error).toBe("Topic is required")
  })

  it("returns carousel payload with expected structure", async () => {
    const data = await (await POST(createRequest({ topic: "Marketing", platform: "TikTok" }))).json()
    expect(data).toMatchObject({
      topic: "Marketing",
      platform: "TikTok",
    })
    expect(Array.isArray(data.slides)).toBe(true)
    expect(data.slides[0]).toEqual(
      expect.objectContaining({
        index: expect.any(Number),
        type: expect.any(String),
      })
    )
    expect(typeof data.summary).toBe("string")
    expect(data.summary.length).toBeGreaterThan(0)
  })

  it("handles errors and returns 500 status", async () => {
    const failingRequest = {
      json: jest.fn(async () => {
        throw new Error("Test failure")
      }),
    } as unknown as Request

    const response = await POST(failingRequest)

    expect(response.status).toBe(500)
    const payload = await response.json()
    expect(payload.error).toBe("Test failure")
  })
})
