import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['TENANT', 'LANDLORD']).default('TENANT'),
  phone: z.string().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const HouseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be a positive number'),
  location: z.string().min(3, 'Location is required'),
  district: z.string().min(2, 'District is required'),
  type: z.enum(['HOUSE', 'APARTMENT', 'STUDIO', 'VILLA']).default('HOUSE'),
  bedrooms: z.number().int().positive('Bedrooms must be positive'),
  bathrooms: z.number().int().positive('Bathrooms must be positive'),
  furnished: z.boolean().default(false),
})

export const BookingSchema = z.object({
  houseId: z.string().cuid('Invalid house ID'),
  message: z.string().optional(),
  moveInDate: z.string().optional(),
})

export const ReportSchema = z.object({
  houseId: z.string().cuid('Invalid house ID'),
  reason: z.string().min(5, 'Please provide a reason'),
  details: z.string().optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type HouseInput = z.infer<typeof HouseSchema>
export type BookingInput = z.infer<typeof BookingSchema>
export type ReportInput = z.infer<typeof ReportSchema>
