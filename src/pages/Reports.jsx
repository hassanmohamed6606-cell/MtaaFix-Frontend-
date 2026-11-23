
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import ReportCard from '../components/ReportCard'
import { apiRequest } from '../services/api'
import { sampleReports } from '../data/sampleReports'

const categories = [
  'All',
  'Road Damage',
  'Waste Management',
  'Streetlight',
  'Drainage',
  'Water',
  'Public Facility',
  'Other',
]

const statuses = ['All', 'Pending', 'In Progress', 'Resolved']

export default function Reports() {
  const [reports, setReports] = useState(sampleReports)
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [live, setLive] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()

    if (category !== 'All') params.set('category', category)
    if (status !== 'All') params.set('status', status)
    if (search) params.set('search', search)

    apiRequest(`/reports?${params.toString()}`)
      .then((data) => {
        setReports(data.reports || [])
        setLive(true)
      })
      .catch(() => {
        setLive(false)

        const searchTerm = search.toLowerCase()

        setReports(
          sampleReports.filter((report) => {
            const matchesCategory =
              category === 'All' || report.category === category

            const matchesStatus =
              status === 'All' || report.status === status

            const searchableText = [
              report.title,
              report.description,
              report.location_name,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()

            const matchesSearch = searchableText.includes(searchTerm)

            return matchesCategory && matchesStatus && matchesSearch
          })
        )
      })
  }, [category, status, search])

  return (
    <div className="page-wrap page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">COMMUNITY VOICE</span>
          <h1>Community reports</h1>
          <p>Explore issues reported by people in the neighbourhood.</p>
        </div>

        <span className={`connection-pill ${live ? 'online' : ''}`}>
          {live ? 'Live API data' : 'Preview data'}
        </span>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports or locations"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {reports.length > 0 ? (
        <div className="report-grid">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No reports found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </div>
  )
}
