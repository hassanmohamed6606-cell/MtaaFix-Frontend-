import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { searchLocations } from '../services/location'

export default function LocationSearch({ value, onSelect }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function search() {
    if (!query.trim()) {
      setError('Please enter a location to search.')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      const locations = await searchLocations(query)

      if (locations.length === 0) {
        setError('No locations found. Try a more specific search.')
      } else {
        setResults(locations)
      }
    } catch (err) {
      setError(err.message || 'Unable to search for this location.')
    } finally {
      setLoading(false)
    }
  }

  function selectLocation(item) {
    const selected = {
      name: item.display_name,
      latitude: Number(item.lat),
      longitude: Number(item.lon)
    }

    onSelect(selected)
    setQuery(item.display_name)
    setResults([])
    setError('')
  }

  return (
    <div className="location-search">
      <label>Problem location</label>

      <div className="location-form">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setResults([])
            setError('')
          }}
          placeholder="Search a place, e.g. South B, Nairobi"
        />

        <button
          type="button"
          className="btn btn-secondary"
          onClick={search}
          disabled={loading}
        >
          <Search size={16} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="field-error">{error}</p>}

      {results.length > 0 && (
        <div className="location-results">
          {results.map((item) => (
            <button
              type="button"
              key={item.place_id}
              onClick={() => selectLocation(item)}
            >
              <MapPin size={15} />
              <span>{item.display_name}</span>
            </button>
          ))}
        </div>
      )}

      <small>
        Search and select a result to attach its coordinates.
        Location search is provided by OpenStreetMap Nominatim.
      </small>
    </div>
  )
}