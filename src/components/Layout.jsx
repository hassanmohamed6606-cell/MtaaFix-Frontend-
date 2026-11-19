// Nominatim is rate-limited. This function is intended for an explicit search submit,
// not rapid keystroke-by-keystroke autocomplete.
export async function searchLocations(query) {
  const trimmed = query.trim()
  if (trimmed.length < 3) return []
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', trimmed)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '5')
  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error('Location search is temporarily unavailable.')
  return response.json()
}
