import { z } from 'zod'

// Rules shared by several forms; each form composes its own schema from these.
export const emailSchema = z.email('enter a valid email')

// PocketBase allows 71 characters, and bcrypt 72 bytes: a longer password fails with only "Failed
// to create record.". Accented letters and emoji take several bytes, so check both.
const maxPasswordBytes = 72
const utf8 = new TextEncoder()

export const passwordSchema = z
  .string()
  .min(8, 'at least 8 characters')
  .max(71, 'at most 71 characters')
  .refine(
    (password) => utf8.encode(password).length <= maxPasswordBytes,
    'too long: accents and emoji count extra, use fewer',
  )

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
