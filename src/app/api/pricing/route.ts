import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const product = searchParams.get('product') || ''
  const vendor = searchParams.get('vendor') || ''
  const size = searchParams.get('size') || ''
  const quantity = searchParams.get('quantity') || ''

  const query = supabase
    .from('daily_prices')
    .select(`
      price, size, quantity, coating, weight, sides,
      scraped_at, vendors ( name )
    `)
    .order('price', { ascending: true })

  if (product) query.eq('product_id', 1) // You can customize this logic
  if (vendor) query.ilike('vendors.name', `%${vendor}%`)
  if (size) query.ilike('size', `%${size}%`)
  if (quantity) query.eq('quantity', Number(quantity))

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
