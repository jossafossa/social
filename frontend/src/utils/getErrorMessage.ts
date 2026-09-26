// PocketBase explains a rejected save per field (`response.data.bio.message`); its own message is
// only "Failed to update record.", so lead with the first field's reason.
const getFieldMessage = (error: object) => {
  const data: unknown = 'response' in error && (error.response as { data?: unknown }).data
  if (typeof data !== 'object' || data === null) {
    return undefined
  }
  const [field, detail] = Object.entries(data)[0] ?? []
  if (field === undefined || typeof detail?.message !== 'string') {
    return undefined
  }
  return `${field}: ${detail.message}`
}

export const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    return getFieldMessage(error) ?? error.message
  }
  return 'Something went wrong'
}
