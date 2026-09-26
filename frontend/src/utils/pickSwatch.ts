const swatches = ['#a3c4bc', '#e7c9a9', '#c9b6e4', '#b7d3a8', '#f0b8a8']

// Same name, same colour — so a person or group without a picture is still recognisable.
export const pickSwatch = (name: string) => {
  let hash = 0
  for (const character of name) {
    hash = (hash * 31 + character.charCodeAt(0)) % swatches.length
  }
  return swatches[hash]
}
