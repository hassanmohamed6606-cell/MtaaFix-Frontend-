import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getToken } from '../services/api'
import LocationSearch from '../components/LocationSearch'

const categories = [
  'Road Damage',
  'Waste Management',
  'Streetlight',
  'Drainage',
  'Water',
  'Public Facility',
  'Other'
]

export default function NewReport() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Road Damage'
  })

  const [location, setLocation] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.description.trim()) {
      setError('Please enter a report title and description.')
      return
    }

    if (!location) {
      setError('Please search for and select a problem location.')
      return
    }

    if (!getToken()) {
      setError('Your session has expired. Please log in again.')
      return
    }

    setSaving(true)

    try {
      const reportData = new FormData()
      reportData.append('title', form.title.trim())
      reportData.append('description', form.description.trim())
      reportData.append('category', form.category)
      reportData.append('location_name', location.name)
      reportData.append('latitude', String(location.latitude))
      reportData.append('longitude', String(location.longitude))
      if (image) reportData.append('image', image)

      const response = await apiRequest('/reports', {
        method: 'POST',
        body: reportData
      })

      if (!response.report || !response.report.id) {
        throw new Error('The server did not confirm that the report was saved.')
      }

      navigate('/reports', {
        state: { submitted: true }
      })

    } catch (err) {
      setError(err.message || 'Unable to submit your report.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-wrap page-content narrow">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SPEAK UP</span>
          <h1>Report a community issue</h1>
          <p>
            Share clear details so others can understand what needs attention.
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={submit} noValidate>
        <div className="form-intro">
          <h2>Issue details</h2>
          <p>Fields marked with * are required.</p>
        </div>

        <label>
          Report title *
          <input
            name="title"
            value={form.title}
            onChange={change}
            maxLength={140}
            placeholder="e.g. Large pothole near the market"
          />
        </label>

        <label>
          Category *
          <select
            name="category"
            value={form.category}
            onChange={change}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description *
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            rows="5"
            placeholder="Describe the issue and how it affects the community..."
          />
        </label>

        <LocationSearch onSelect={setLocation} />

        <label>
          Attach an image (optional)
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setImage(e.target.files?.[0] || null)} />
          <small>JPG, PNG or WEBP. Maximum size: 8 MB. Cloudinary credentials are required for uploads.</small>
        </label>

        {location && (
          <p className="selected-location">
            Selected: {location.name}
          </p>
        )}

        {error && (
          <p className="field-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={saving}
        >
          {saving ? 'Submitting...' : 'Submit report'}
        </button>

        <p className="form-note">
          You need to sign in before submitting a report.
        </p>
      </form>
    </div>
  )
}