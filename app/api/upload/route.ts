export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        {
          error: 'Upload is not configured',
          detail: 'Missing Cloudinary environment variables.',
        },
        { status: 503 }
      )
    }

    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
      return NextResponse.json(
        {
          error: 'Invalid upload content type',
          detail: 'Expected multipart/form-data.',
        },
        { status: 400 }
      )
    }

    const formData = await req.formData()
    const files = formData.getAll('images') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    if (files.length > 8) {
      return NextResponse.json({ error: 'Maximum 8 images allowed' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      if (!file || typeof file.arrayBuffer !== 'function') {
        throw new Error('Invalid file payload')
      }
      if (!file.type?.startsWith('image/')) {
        throw new Error('Only image uploads are allowed')
      }
      // 6MB cap per image (safe for demo)
      if (typeof file.size === 'number' && file.size > 6 * 1024 * 1024) {
        throw new Error('Image is too large (max 6MB)')
      }
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      return uploadImage(base64)
    })

    let results
    try {
      results = await Promise.all(uploadPromises)
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Upload failed', detail: e?.message || 'Unknown upload error' },
        { status: 400 }
      )
    }
    return NextResponse.json({ images: results }, { status: 200 })
  } catch (error) {
    console.error('[UPLOAD]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
