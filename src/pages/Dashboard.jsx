import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock3, FileText } from 'lucide-react'
import { apiRequest } from '../services/api'
import { sampleReports } from '../data/sampleReports'
import ReportCard from '../components/ReportCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [reports, setReports] = useState(sampleReports)
  const [live, setLive] = useState(false)
  const { user } = useAuth()
  useEffect(() => { apiRequest('/reports').then(data => { setReports(data.reports); setLive(true) }).catch(() => {}) }, [])
  const stats = [
    { label: 'Total reports', value: reports.length, icon: FileText },
    { label: 'Pending', value: reports.filter(r => r.status === 'Pending').length, icon: Clock3 },
    { label: 'In progress', value: reports.filter(r => r.status === 'In Progress').length, icon: AlertCircle },
    { label: 'Resolved', value: reports.filter(r => r.status === 'Resolved').length, icon: CheckCircle2 }
  ]
  return <div className="page-wrap page-content">
    <div className="page-heading"><div><span className="eyebrow">OVERVIEW</span><h1>Community dashboard</h1><p>Welcome back, {user?.name || 'neighbour'}. Here's what's happening.</p></div><span className={connection-pill ${live ? 'online' : ''}}>{live ? 'Live API data' : 'Preview data'}</span></div>
    <div className="stats-grid">{stats.map(item => <div className="stat-card" key={item.label}><span className="stat-icon"><item.icon size={20}/></span><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
    <div className="section-heading"><div><h2>Recent community reports</h2><p>Latest issues shared by residents.</p></div></div>
    <div className="report-grid">{reports.slice(0,6).map(report => <ReportCard key={report.id} report={report}/>)}</div>
  </div>
}