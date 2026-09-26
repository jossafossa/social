const maxDimension = 512

// Phone photos are several MB; a 512px JPEG is ~50KB and plenty for an avatar.
export const shrinkImage = async (file: File) => {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const canvas = new OffscreenCanvas(
    Math.round(bitmap.width * scale),
    Math.round(bitmap.height * scale),
  )
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas 2D is not supported')
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 })
  return new File([blob], 'picture.jpg', { type: 'image/jpeg' })
}
