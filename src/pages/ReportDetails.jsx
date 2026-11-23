
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Trash2 } from 'lucide-react'
import { apiRequest } from '../services/api'
import { StatusBadge } from '../components/ReportCard'
import { useAuth } from '../context/AuthContext'

export default function ReportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    category: '',
  })

  useEffect(() => {
    setError('')
    setReport(null)

    apiRequest(`/reports/${id}`)
      .then((data) => setReport(data.report))
      .catch((err) => setError(err.message))
  }, [id])

  const canManage =
    user &&
    report &&
    (user.id === report.user_id || user.role === 'admin')

  function beginEdit() {
    setDraft({
      title: report.title || '',
      description: report.description || '',
      category: report.category || '',
    })

    setEditing(true)
    setError('')
  }

  async function saveEdit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      const data = await apiRequest(`/reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(draft),
      })

      setReport(data.report)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function removeReport() {
    if (!window.confirm('Delete this report permanently?')) return

    setBusy(true)
    setError('')

    try {
      await apiRequest(`/reports/${id}`, {
        method: 'DELETE',
      })

      navigate('/reports')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function changeStatus(newStatus) {
    setBusy(true)
    setError('')

    try {
      const data = await apiRequest(`/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })

      setReport(data.report)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (error && !report) {
    return (
      <div className="page-wrap page-content">
        <h1>Report unavailable</h1>
        <p className="field-error">{error}</p>
        <Link to="/reports">Back to reports</Link>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="page-wrap page-content">
        <p>Loading report…</p>
      </div>
    )
  }

  return (
    <div className="page-wrap page-content narrow">
      <Link className="back-link" to="/reports">
        <ArrowLeft size={16} />
        Back to community reports
      </Link>

      <article className="detail-card">
        <div className="report-card-top">
          <span className="category-label">{report.category}</span>
          <StatusBadge status={report.status} />
        </div>

        {editing ? (
          <form className="form-card" onSubmit={saveEdit}>
            <label>
              Title
              <input
                maxLength="140"
                required
                value={draft.title}
                onChange={(e) =>
                  setDraft({ ...draft, title: e.target.value })
                }
              />
            </label>

            <label>
              Category
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              >
                {[
                  'Road Damage',
                  'Waste Management',
                  'Streetlight',
                  'Drainage',
                  'Water',
                  'Public Facility',
                  'Other',
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Description
              <textarea
                rows="5"
                required
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={busy}
              >
                Save changes
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>{report.title}</h1>
            <p className="detail-description">{report.description}</p>
          </>
        )}

        {report.image_url && (
          <img
            src={report.image_url}
            alt="Reported community issue"
            style={{
              width: '100%',
              maxHeight: 420,
              objectFit: 'cover',
              borderRadius: 12,
              margin: '16px 0',
            }}
          />
        )}

        <div className="detail-meta">
          <span>
            <MapPin size={16} />
            {report.location_name}
          </span>

          <span>
            Reported by {report.user?.name || 'Community member'}
          </span>

          <span>
            {report.created_at
              ? new Date(report.created_at).toLocaleString()
              : ''}
          </span>
        </div>

        {report.latitude != null && report.longitude != null && (
          <a
            className="text-link"
            href={`https://www.openstreetmap.org/?mlat=${report.latitude}&mlon=${report.longitude}#map=17/${report.latitude}/${report.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            View on OpenStreetMap
          </a>
        )}

        {canManage && (
          <div
            className="form-actions"
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 24,
              flexWrap: 'wrap',
            }}
          >
            {!editing && (
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy}
                onClick={beginEdit}
              >
                Edit report
              </button>
            )}

            {user.role === 'admin' && (
              <label>
                Update status
                <select
                  disabled={busy}
                  value={report.status}
                  onChange={(e) => changeStatus(e.target.value)}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </label>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              disabled={busy}
              onClick={removeReport}
            >
              <Trash2 size={16} />
              Delete report
            </button>
          </div>
        )}

        {error && <p className="field-error">{error}</p>}
      </article>
    </div>
  )
}
