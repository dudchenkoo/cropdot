"use client"

const BILLING_STORAGE_KEY = "cropdot-billing"

export interface Invoice {
  id: string
  date: string
  amount: number
  credits: number
  plan: string
  status: "paid" | "pending" | "failed"
  invoiceNumber: string
}

/**
 * Get all invoices from localStorage
 */
export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return []

  try {
    const stored = window.localStorage.getItem(BILLING_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as Invoice[]
  } catch {
    return []
  }
}

/**
 * Add a new invoice
 */
export function addInvoice(invoice: Omit<Invoice, "id" | "invoiceNumber">): Invoice {
  const invoices = getInvoices()
  const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`
  
  const newInvoice: Invoice = {
    ...invoice,
    id,
    invoiceNumber,
  }

  invoices.unshift(newInvoice) // Add to beginning
  saveInvoices(invoices)
  return newInvoice
}

/**
 * Save invoices to localStorage
 */
function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(invoices))
  } catch (error) {
    console.error("Failed to save invoices:", error)
  }
}

/**
 * Create an invoice from a purchase
 */
export function createInvoiceFromPurchase(
  plan: string,
  amount: number,
  credits: number,
  status: Invoice["status"] = "paid"
): Invoice {
  return addInvoice({
    date: new Date().toISOString(),
    amount,
    credits,
    plan,
    status,
  })
}

/**
 * Generate invoice PDF content (simplified - in production, use a proper PDF library)
 */
export function generateInvoicePDF(invoice: Invoice, userEmail: string): string {
  const invoiceDate = new Date(invoice.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const lines = [
    "=".repeat(50),
    "INVOICE",
    "=".repeat(50),
    "",
    `Invoice Number: ${invoice.invoiceNumber}`,
    `Date: ${invoiceDate}`,
    `Status: ${invoice.status.toUpperCase()}`,
    "",
    "BILL TO:",
    userEmail,
    "",
    "-".repeat(50),
    "ITEM DESCRIPTION",
    "-".repeat(50),
    "",
    `Plan: ${invoice.plan}`,
    `Credits: ${invoice.credits}`,
    "",
    "-".repeat(50),
    `Subtotal: $${invoice.amount.toFixed(2)}`,
    `Total: $${invoice.amount.toFixed(2)}`,
    "",
    "=".repeat(50),
    "",
    "Thank you for your purchase!",
    "",
    "---",
    "cropdot - LinkedIn Content Creator",
    "support@cropdot.ai",
    "",
  ]

  return lines.join("\n")
}

/**
 * Download invoice as text file (simplified - in production, use proper PDF generation)
 */
export function downloadInvoice(invoice: Invoice, userEmail: string): void {
  const content = generateInvoicePDF(invoice, userEmail)
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${invoice.invoiceNumber}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

