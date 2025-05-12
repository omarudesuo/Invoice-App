import { InvoiceCreator } from "@/components/invoice-creator"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Invoice Creator</h1>
      <InvoiceCreator />
    </main>
  )
}
