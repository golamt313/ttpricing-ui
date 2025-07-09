import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const [vendorsRes, sizesRes, qtyRes, turnaroundRes] = await Promise.all([
    supabase.from('vendors').select('name'),
    supabase.from('daily_prices').select('size').not('size', 'is', null),
    supabase.from('daily_prices').select('quantity').not('quantity', 'is', null),
    supabase.from('daily_prices').select('turnaround_desc').not('turnaround_desc', 'is', null),
  ])

  const vendors = vendorsRes.data?.map(v => v.name).filter(Boolean) ?? []
  const sizes = Array.from(new Set(sizesRes.data?.map(r => r.size))).filter(Boolean)
  const quantities = Array.from(new Set(qtyRes.data?.map(r => r.quantity))).filter(Boolean)
  const turnaroundOptions = Array.from(new Set(turnaroundRes.data?.map(r => r.turnaround_desc))).filter(Boolean)

  return NextResponse.json({ vendors, sizes, quantities, turnaroundOptions })
}
