"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Invoice, InvoiceItem } from "@/components/invoice-creator"
import { Download, FileText, FileIcon as FileWord, FileIcon as FilePdf } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface InvoiceDisplayProps {
  invoice: Invoice
  onCreateNew: () => void
}

export function InvoiceDisplay({ invoice, onCreateNew }: InvoiceDisplayProps) {
  const [isExporting, setIsExporting] = useState(false)

  const calculateSubtotal = (item: InvoiceItem) => {
    return item.quantity * item.price
  }

  const calculateTotal = () => {
    return invoice.items.reduce((sum, item) => sum + calculateSubtotal(item), 0)
  }

  const handlePrintPDF = () => {
    setIsExporting(true)
    setTimeout(() => {
      window.print()
      setIsExporting(false)
    }, 100)
  }

  const handleExportWord = () => {
    setIsExporting(true)

    // Create a simple HTML representation of the invoice
    const invoiceHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">Voom</h1>
          <h2>Invoice #${invoice.invoiceNumber}</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <h3>Bill To:</h3>
              <p>${invoice.customer}</p>
            </div>
            <div>
              <h3>Date:</h3>
              <p>${new Date(invoice.date).toLocaleDateString()}</p>
              <h3>Valid Until:</h3>
              <p>${new Date(invoice.validUntil).toLocaleDateString()}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toFixed(2)} EGP</td>
                  <td>${calculateSubtotal(item).toFixed(2)} EGP</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>${calculateTotal().toFixed(2)} EGP</strong></td>
              </tr>
            </tfoot>
          </table>
          <div style="margin-top: 20px;">
            <h3>Notes:</h3>
            <p>${invoice.notes}</p>
          </div>
        </body>
      </html>
    `

    // Create a Blob from the HTML content
    const blob = new Blob([invoiceHtml], { type: "application/vnd.ms-word" })

    // Create a download link and trigger it
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Invoice-${invoice.invoiceNumber}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      <Card className={`print:shadow-none ${isExporting ? "exporting" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-20 h-20 relative overflow-hidden rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
              <img src="/images/voom-logo.png" alt="Voom Logo" className="object-cover w-full h-full" />
            </div>
            <h2 className="text-3xl font-extrabold text-center flex-grow tracking-wide">VOOM</h2>
            <div className="w-20"></div> {/* Empty div for balance */}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Invoice</CardTitle>
              <p className="text-sm text-gray-500">#{invoice.invoiceNumber}</p>
            </div>
            <div className="print:hidden flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePrintPDF}>
                    <FilePdf className="h-4 w-4 mr-2" />
                    <span>PDF Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportWord}>
                    <FileWord className="h-4 w-4 mr-2" />
                    <span>Word Document</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Bill To:</h3>
              <p>{invoice.customer}</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium">Date:</h3>
              <p>{new Date(invoice.date).toLocaleDateString()}</p>
              <h3 className="font-medium mt-2">Valid Until:</h3>
              <p>{new Date(invoice.validUntil).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.price.toFixed(2)} EGP</td>
                    <td className="px-4 py-3 text-sm text-right">{calculateSubtotal(item).toFixed(2)} EGP</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{calculateTotal().toFixed(2)} EGP</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Notes:</h3>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center print:hidden">
        <Button onClick={onCreateNew} className="w-full max-w-xs">
          <FileText className="mr-2 h-4 w-4" />
          Create New Invoice
        </Button>
      </div>

      <style jsx global>{`
        @media print {
          .exporting {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
