"use client"

import { useEffect, useState } from "react"
import { Download, FileText } from "lucide-react"
import { Inter_Tight } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBackground } from "@/components/page-background"
import { getInvoices, downloadInvoice, type Invoice } from "@/lib/billing"
import { getUserEmail } from "@/lib/avatar"

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" })

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    setInvoices(getInvoices())
    setUserEmail(getUserEmail())
  }, [])

  const handleDownload = (invoice: Invoice) => {
    downloadInvoice(invoice, userEmail)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const totalSpent = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const totalCredits = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.credits, 0)

  return (
    <PageBackground className={interTight.variable}>
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-semibold mb-4 bg-clip-text text-transparent"
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              backgroundImage: "linear-gradient(to bottom, #ffffff, #888888)",
            }}
          >
            Billing & Invoices
          </h1>
          <p className="text-sm text-muted-foreground">
            View your purchase history and download invoices
          </p>
        </div>

        {invoices.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
              <p className="text-2xl font-semibold text-foreground">{invoices.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Credits Purchased</p>
              <p className="text-2xl font-semibold text-foreground">{totalCredits}</p>
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No invoices yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your purchase history will appear here once you buy credits.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {invoice.invoiceNumber}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm text-foreground">
                          {formatDate(invoice.date)}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm text-foreground">
                          {invoice.plan}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm text-foreground">
                          {invoice.credits}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(invoice.amount)}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`text-sm font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownload(invoice)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-muted"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Invoices are generated automatically when you purchase credits. 
            You can download them at any time for your records.
          </p>
        </div>
      </main>
      <Footer />
    </PageBackground>
  )
}

