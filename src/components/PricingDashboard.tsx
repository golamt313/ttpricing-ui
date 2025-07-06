'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'

interface PricingRow {
  vendor: string
  size: string
  quantity: number
  coating: string | null
  weight: string | null
  sides: string | null
  price: number
}

interface RawPricingRow {
  vendors?: { name: string }
  size: string
  quantity: number
  coating: string | null
  weight: string | null
  sides: string | null
  price: number
}


export default function PricingDashboard() {
  const [data, setData] = useState<PricingRow[]>([])
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState('Postcard')
  const [vendor, setVendor] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState('')

  const [vendorOptions, setVendorOptions] = useState<string[]>([])
  const [sizeOptions, setSizeOptions] = useState<string[]>([])
  const [quantityOptions, setQuantityOptions] = useState<string[]>([])

  // Load filter options on mount
  useEffect(() => {
    fetch('/api/pricing/options')
      .then(res => res.json())
      .then(({ vendors, sizes, quantities }) => {
        setVendorOptions(vendors)
        setSizeOptions(sizes)
        setQuantityOptions(quantities.map((q: number) => q.toString()))
      })
  }, [])

  // Fetch pricing data
  useEffect(() => {
    const params = new URLSearchParams({ product, vendor, size, quantity })
    setLoading(true)
    fetch(`/api/pricing?${params.toString()}`)
      .then(res => res.json())
      .then((raw: unknown) => {
        if (!Array.isArray(raw)) return

        const normalized = (raw as RawPricingRow[]).map(row => ({
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
      .finally(() => setLoading(false))
  }, [product, vendor, size, quantity])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">T&T Pricing Dashboard</h1>

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

        <Combobox
          options={vendorOptions}
          placeholder="Vendor"
          onValueChange={setVendor}
        />

        <Combobox
          options={sizeOptions}
          placeholder="Size (e.g. 4x6)"
          onValueChange={setSize}
        />

        <Combobox
          options={quantityOptions}
          placeholder="Quantity"
          onValueChange={setQuantity}
        />

      </div>

      <Card>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No results found</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
