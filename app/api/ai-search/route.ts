export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

function parseIntLoose(value: string) {
  const m = value.match(/(\d[\d,]*)/)
  if (!m) return null
  return parseInt(m[1].replace(/,/g, ''), 10)
}

function inferDistrict(query: string) {
  const q = query.toLowerCase()
  if (q.includes('gasabo')) return 'Gasabo'
  if (q.includes('kicukiro')) return 'Kicukiro'
  if (q.includes('nyarugenge')) return 'Nyarugenge'
  // neighborhood keywords (approx)
  if (q.includes('kimihurura') || q.includes('kacyiru') || q.includes('remera') || q.includes('gacuriro') || q.includes('nyarutarama') || q.includes('kagarama') || q.includes('gisozi') || q.includes('gikondo') || q.includes('gikondo')) return 'Gasabo'
  if (q.includes('kicukiro')) return 'Kicukiro'
  if (q.includes('nyamirambo') || q.includes('cbd') || q.includes('imuhima') || q.includes('muhima') || q.includes('gitega')) return 'Nyarugenge'
  return undefined
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const query: unknown = body?.query
    if (typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ filters: {} }, { status: 200 })
    }
    const q = query.trim().toLowerCase()

    const filters: Record<string, unknown> = {}

    // category
    const commercialKw = ['shop', 'office', 'warehouse', 'hall', 'restaurant', 'commercial', 'mini-supermarket', 'supermarket']
    const residentialKw = ['house', 'apartment', 'studio', 'room', 'villa', 'home', 'rental']
    const isCommercial = commercialKw.some((k) => q.includes(k))
    const isResidential = residentialKw.some((k) => q.includes(k))
    if (isCommercial && !isResidential) filters.category = 'COMMERCIAL'
    if (isResidential && !isCommercial) filters.category = 'RESIDENTIAL'

    // type
    const typeMap: Array<[RegExp, string]> = [
      [/apartment|flat/, 'APARTMENT'],
      [/studio/, 'STUDIO'],
      [/room|single room/, 'ROOM'],
      [/house|townhouse/, 'HOUSE'],
      [/villa/, 'VILLA'],
      [/shop|market/, 'SHOP'],
      [/office/, 'OFFICE'],
      [/warehouse/, 'WAREHOUSE'],
      [/hall|event/, 'HALL'],
      [/restaurant/, 'RESTAURANT'],
    ]
    for (const [re, type] of typeMap) {
      if (re.test(q)) {
        filters.type = type
        break
      }
    }

    // district
    const district = inferDistrict(q)
    if (district) filters.district = district

    // price
    const under = /under\s+(\d[\d,]*)/.exec(q) || /below\s+(\d[\d,]*)/.exec(q)
    const over = /over\s+(\d[\d,]*)/.exec(q) || /above\s+(\d[\d,]*)/.exec(q) || /at least\s+(\d[\d,]*)/.exec(q)
    if (under) filters.maxPrice = parseInt(under[1].replace(/,/g, ''), 10)
    if (over) filters.minPrice = parseInt(over[1].replace(/,/g, ''), 10)

    // bedrooms
    const beds = /(one|two|three|four|five|\d+)\s*-?\s*(bed|bedroom)s?/.exec(q)
    if (beds) {
      const raw = beds[1]
      const map: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 }
      const n = map[raw] ?? parseInt(raw, 10)
      if (Number.isFinite(n)) filters.bedrooms = n
    }

    // furnished
    if (q.includes('furnished')) filters.furnished = true
    if (q.includes('unfurnished')) filters.furnished = false

    // has parking / main road
    if (q.includes('parking')) filters.hasParking = true
    if (q.includes('near main road') || q.includes('main road')) filters.nearMainRoad = true

    // foot traffic
    if (q.includes('high foot') || q.includes('busy') || q.includes('high')) filters.footTraffic = 'HIGH'
    if (q.includes('low foot')) filters.footTraffic = 'LOW'

    return NextResponse.json({ filters }, { status: 200 })
  } catch (error) {
    console.error('[AI_SEARCH]', error)
    return NextResponse.json({ filters: {} }, { status: 200 })
  }
}

