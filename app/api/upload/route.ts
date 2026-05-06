import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const files = formData.getAll('images') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    if (files.length > 8) {
      return NextResponse.json({ error: 'Maximum 8 images allowed' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      return uploadImage(base64)
    })

    const results = await Promise.all(uploadPromises)
    return NextResponse.json({ images: results }, { status: 200 })
  } catch (error) {
    console.error('[UPLOAD]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
