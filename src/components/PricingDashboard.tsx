'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// Define the structure of a pricing result row
type RawPricingRow = {
  vendors?: { name: string }
  size: string
  quantity: number
  coating: string | null
  weight: string | null
  sides: string | null
  price: number
}

type PricingRow = {
  vendor: string
  size: string
  quantity: number
  coating: string | null
  weight: string | null
  sides: string | null
  price: number
}


export default function PricingDashboard() {
  const [data, setData] = useState<PricingRow[]>([])
  const [product, setProduct] = useState('Postcard')
  const [vendor, setVendor] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState('')

  useEffect(() => {
    const params = new URLSearchParams({
      product,
      vendor,
      size,
      quantity
    })

    fetch(`/api/pricing?${params.toString()}`)
      .then(res => res.json())
      .then((raw: unknown) => {
        if (!Array.isArray(raw)) return

        const normalized = (raw as RawPricingRow[]).map((row): PricingRow => ({
          vendor: row.vendors?.name ?? '—',
          size: row.size,
          quantity: row.quantity,
          coating: row.coating,
          weight: row.weight,
          sides: row.sides,
          price: row.price
        }))

        setData(normalized)
      })
  }, [product, vendor, size, quantity])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">📊 Product Pricing Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Select onValueChange={setProduct} defaultValue={product}>
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Postcard">Postcard</SelectItem>
            <SelectItem value="Flyer">Flyer</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Vendor" value={vendor} onChange={e => setVendor(e.target.value)} />
        <Input placeholder="Size (e.g. 4x6)" value={size} onChange={e => setSize(e.target.value)} />
        <Input placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Coating</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Sides</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.coating || '—'}</TableCell>
                  <TableCell>{row.weight || '—'}</TableCell>
                  <TableCell>{row.sides || '—'}</TableCell>
                  <TableCell className="text-right">${row.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
