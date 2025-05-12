"use client"

import { useState } from "react"
import { CustomerForm } from "@/components/customer-form"
import { ItemsForm } from "@/components/items-form"
import { InvoiceDisplay } from "@/components/invoice-display"

export type InvoiceItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type Invoice = {
  customer: string
  items: InvoiceItem[]
  invoiceNumber: string
  date: string
  validUntil: string
  notes: string // Add notes field
}

export function InvoiceCreator() {
  const [step, setStep] = useState(1)
  const [invoice, setInvoice] = useState<Invoice>({
    customer: "",
    items: [],
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    notes: "Thank you for your business!", // Default thank you message
  })

  const handleCustomerSubmit = (customer: string) => {
    setInvoice((prev) => ({ ...prev, customer }))
    setStep(2)
  }

  const handleItemsSubmit = (items: InvoiceItem[], notes: string) => {
    // Generate a unique invoice number based on date and random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "")
    const invoiceNumber = `INV-${dateStr}-${randomDigits}`

    setInvoice((prev) => ({
      ...prev,
      items,
      invoiceNumber,
      notes: notes.trim() ? notes : "Thank you for your business!", // Use default if empty
    }))
    setStep(3)
  }

  const handleReset = () => {
    setInvoice({
      customer: "",
      items: [],
      invoiceNumber: "",
      date: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      notes: "Thank you for your business!", // Reset to default
    })
    setStep(1)
  }

  return (
    <div className="max-w-3xl mx-auto">
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
            <span className="text-sm font-medium">Invoice</span>
          </div>
        </div>
      </div>

      {step === 1 && <CustomerForm initialCustomer={invoice.customer} onSubmit={handleCustomerSubmit} />}

      {step === 2 && (
        <ItemsForm initialItems={invoice.items} initialNotes={invoice.notes} onSubmit={handleItemsSubmit} />
      )}

      {step === 3 && <InvoiceDisplay invoice={invoice} onCreateNew={handleReset} />}
    </div>
  )
}
