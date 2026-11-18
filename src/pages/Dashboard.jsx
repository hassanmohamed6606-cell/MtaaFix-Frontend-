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