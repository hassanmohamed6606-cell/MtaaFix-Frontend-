
import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'

export function StatusBadge({ status }) {
  return (
    <span
      className={`status status-${(status || 'pending')
        .toLowerCase()
        .replace(' ', '-')}`}
    >
      {status || 'Pending'}
    </span>
  )
}

export default function ReportCard({ report }) {
  return (
    <article className="report-card">
      <div className="report-card-top">
        <span className="category-label">
          {report.category}
        </span>

        <StatusBadge status={report.status} />
      </div>

      <h3>{report.title}</h3>

      <p>{report.description}</p>

      <div className="report-meta">
        <span>
          <MapPin size={14} />
          {report.location_name}
        </span>

        <span>
          <Clock size={14} />
          {report.created_at
            ? new Date(report.created_at).toLocaleDateString()
            : 'Date unavailable'}
        </span>
      </div>

      <Link
        className="text-link"
        to={`/reports/${report.id}`}
      >
        View report
        <ArrowUpRight size={15} />
      </Link>
    </article>
  )
}

