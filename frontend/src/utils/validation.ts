import { z } from 'zod'

// Rules shared by several forms; each form composes its own schema from these.
export const emailSchema = z.email('enter a valid email')

export const passwordSchema = z.string().min(8, 'at least 8 characters')

export const contentSchema = z
  .string()
  .trim()
  .min(1, 'write something first')
  .max(1000, 'keep it under 1000 characters')

const isImage = (file: File | undefined) => file === undefined || file.type.startsWith('image/')

// A file input registers as a FileList; forms want the one picked file, or none.
export const optionalImageSchema = z
  .custom<FileList>((value) => value instanceof FileList)
  .transform((files) => files.item(0) ?? undefined)
  .refine(isImage, 'choose an image file')

export const requiredImageSchema = optionalImageSchema.refine(
  (file) => file !== undefined,
  'choose an image first',
)
