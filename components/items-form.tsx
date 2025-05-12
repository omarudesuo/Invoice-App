"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import type { InvoiceItem } from "@/components/invoice-creator"

interface ItemsFormProps {
  initialItems: InvoiceItem[]
  initialNotes: string
  onSubmit: (items: InvoiceItem[], notes: string) => void
}

export function ItemsForm({ initialItems, initialNotes, onSubmit }: ItemsFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>(
    initialItems.length > 0 ? initialItems : [{ id: crypto.randomUUID(), name: "", quantity: 1, price: 0 }],
  )
  const [notes, setNotes] = useState(initialNotes)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), name: "", quantity: 1, price: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length === 1) {
      return
    }
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))

    // Clear error for this field if it exists
    if (errors[`${id}-${field}`]) {
      setErrors({ ...errors, [`${id}-${field}`]: "" })
    }
  }

  const validateItems = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    items.forEach((item) => {
      if (!item.name.trim()) {
        newErrors[`${item.id}-name`] = "Item name is required"
        isValid = false
      }

      if (item.quantity <= 0) {
        newErrors[`${item.id}-quantity`] = "Quantity must be greater than 0"
        isValid = false
      }

      if (item.price <= 0) {
        newErrors[`${item.id}-price`] = "Price must be greater than 0"
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateItems()) {
      onSubmit(items, notes)
    }
  }

  const calculateSubtotal = (item: InvoiceItem) => {
    return item.quantity * item.price
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item), 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Items</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Item {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                  <Input
                    id={`item-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Enter item name"
                  />
                  {errors[`${item.id}-name`] && <p className="text-sm text-red-500">{errors[`${item.id}-name`]}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
                    <Input
                      id={`item-quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    />
                    {errors[`${item.id}-quantity`] && (
                      <p className="text-sm text-red-500">{errors[`${item.id}-quantity`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-price-${item.id}`}>Price per Unit (EGP)</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                    />
                    {errors[`${item.id}-price`] && <p className="text-sm text-red-500">{errors[`${item.id}-price`]}</p>}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Subtotal: {calculateSubtotal(item).toFixed(2)} EGP</p>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              Add Item
            </Button>

            <div className="text-right">
              <p className="text-lg font-medium">Total: {calculateTotal().toFixed(2)} EGP</p>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="invoice-notes">Notes (Optional)</Label>
              <Textarea
                id="invoice-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter invoice notes or leave blank for default thank you message"
                rows={3}
              />
              <p className="text-xs text-gray-500">Leave blank to use the default thank you message.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Finish</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
