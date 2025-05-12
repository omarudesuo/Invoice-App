"use client"

import { useState } from "react"
import { CustomerForm } from "@/components/customer-form"
import { ItemsForm } from "@/components/items-form"
import { InvoiceDisplay } from "@/components/invoice-display"

export type InvoiceItem = {
  id: string
  name: string
  description?: string // New: Optional description
  quantity: number
  price: number
}

export type Invoice = {
  customer: string
  companyName?: string // New: Optional
  logoUrl?: string // New: Optional
  signatureUrl?: string // New: Optional
  items: InvoiceItem[]
  invoiceNumber: string
  date: string
  validUntil: string
  notes: string
}

export function QuotationCreator() {
  const [step, setStep] = useState(1)
  const [invoice, setInvoice] = useState<Invoice>({
    customer: "",
    companyName: "",
    logoUrl: undefined,
    signatureUrl: undefined,
    items: [],
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Thank you for your business!",
  })

  const handleCustomerSubmit = (
    customer: string,
    companyName?: string,
    logoUrl?: string,
    signatureUrl?: string
  ) => {
    setInvoice((prev) => ({
      ...prev,
      customer,
      companyName: companyName || "",
      logoUrl,
      signatureUrl,
    }))
    setStep(2)
  }

  const handleItemsSubmit = (items: InvoiceItem[], notes: string) => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "")
    const invoiceNumber = `QUO-${dateStr}-${randomDigits}`

    setInvoice((prev) => ({
      ...prev,
      items,
      invoiceNumber,
      notes: notes.trim() ? notes : "Thank you for your business!",
    }))
    setStep(3)
  }

  const handleReset = () => {
    setInvoice({
      customer: "",
      companyName: "",
      logoUrl: undefined,
      signatureUrl: undefined,
      items: [],
      invoiceNumber: "",
      date: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notes: "Thank you for your business!",
    })
    setStep(1)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Quotation Creator</h1>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <span className="text-sm font-medium">Customer</span>
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="text-sm font-medium">Items</span>
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full ${step >= 3 ? "bg-green-500" : "bg-gray-200"}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              3
            </div>
            <span className="text-sm font-medium">Quotation</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <CustomerForm
          initialCustomer={invoice.customer}
          initialCompanyName={invoice.companyName}
          initialLogoUrl={invoice.logoUrl}
          initialSignatureUrl={invoice.signatureUrl}
          onSubmit={handleCustomerSubmit}
        />
      )}

      {step === 2 && (
        <ItemsForm
          initialItems={invoice.items}
          initialNotes={invoice.notes}
          onSubmit={handleItemsSubmit}
        />
      )}

      {step === 3 && <InvoiceDisplay invoice={invoice} onCreateNew={handleReset} />}
    </div>
  )
}
