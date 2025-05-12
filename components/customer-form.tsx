"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerFormProps {
  initialCustomer: string
  onSubmit: (customer: string) => void
}

export function CustomerForm({ initialCustomer, onSubmit }: CustomerFormProps) {
  const [customer, setCustomer] = useState(initialCustomer)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customer.trim()) {
      setError("Customer name is required")
      return
    }

    onSubmit(customer)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value)
                  setError("")
                }}
                placeholder="Enter customer name"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Next</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
