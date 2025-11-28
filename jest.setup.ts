import "@testing-library/jest-dom"

// Lightweight fetch polyfills to support API route tests when the environment lacks built-in implementations
if (!globalThis.Headers) {
  class MockHeaders {
    private map = new Map<string, string>()

    constructor(init?: HeadersInit) {
      if (init instanceof Map) {
        init.forEach((value, key) => this.map.set(key, value))
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.map.set(key, value))
      } else if (init && typeof init === "object") {
        Object.entries(init).forEach(([key, value]) => this.map.set(key, String(value)))
      }
    }

    append(name: string, value: string) {
      this.map.set(name, value)
    }

    get(name: string) {
      return this.map.get(name) || null
    }

    entries() {
      return this.map.entries()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).Headers = MockHeaders
}

if (!globalThis.Request) {
  class MockRequest {
    url: string
    method: string
    headers: Headers
    private bodyText?: string

    constructor(input: string, init?: RequestInit) {
      this.url = input
      this.method = init?.method || "GET"
      this.headers = new Headers(init?.headers)
      this.bodyText = typeof init?.body === "string" ? init.body : undefined
    }

    async json() {
      return this.bodyText ? JSON.parse(this.bodyText) : {}
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).Request = MockRequest
}

if (!globalThis.Response) {
  class MockResponse {
    status: number
    headers: Headers
    private bodyText: string

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.status = init?.status ?? 200
      this.headers = new Headers(init?.headers)
      this.bodyText = typeof body === "string" ? body : body ? String(body) : ""
    }

    async json() {
      return JSON.parse(this.bodyText || "{}")
    }

    async text() {
      return this.bodyText
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).Response = MockResponse
}
