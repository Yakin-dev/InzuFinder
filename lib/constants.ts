export const DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge'] as const

export const KIGALI_COORDS = {
  lat: -1.9441,
  lng: 30.0619,
} as const

export const RESIDENTIAL_TYPES = ['HOUSE', 'APARTMENT', 'STUDIO', 'ROOM', 'VILLA'] as const
export const COMMERCIAL_TYPES = ['SHOP', 'OFFICE', 'WAREHOUSE', 'HALL', 'RESTAURANT'] as const

export const STATUS_COLOR_MAP: Record<string, string> = {
  AVAILABLE: 'text-green-700 bg-green-100',
  VISIT_BOOKED: 'text-amber-700 bg-amber-100',
  UNDER_NEGOTIATION: 'text-blue-700 bg-blue-100',
  RENTED: 'text-red-700 bg-red-100',
  UNAVAILABLE: 'text-gray-700 bg-gray-100',
}
