import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const productMap: Record<string, number> = {
  Postcard: 21,
  'Business Card': 5,
  Flyer: 99, // etc.
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const product = searchParams.get('product') || ''
  const vendor = searchParams.get('vendor') || ''
  const size = searchParams.get('size') || ''
  const quantity = searchParams.get('quantity') || ''

  let query = supabase
    .from('daily_prices')
    .select(`
      price, size, quantity, coating, weight, sides,
      scraped_at, vendors ( name )
    `)
    .order('price', { ascending: true })

  if (product && productMap[product]) query = query.eq('product_id', productMap[product])
  if (size) query = query.ilike('size', `%${size}%`)
  if (quantity) query = query.eq('quantity', Number(quantity))

  // Get vendor_id for the vendor name (if vendor selected)
  if (vendor) {
    // Get vendor_id by name
    const { data: vendorsData } = await supabase
      .from('vendors')
      .select('id')
      .ilike('name', `%${vendor}%`)
      .limit(1)
      .single()
    if (vendorsData?.id) {
      query = query.eq('vendor_id', vendorsData.id)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
