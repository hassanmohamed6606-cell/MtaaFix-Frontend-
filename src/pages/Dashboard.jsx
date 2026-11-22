import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, FileText } from 'lucide-react';
import { apiRequest } from '../services/api';
import { sampleReports } from '../data/sampleReports';
import ReportCard from '../components/ReportCard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [reports, setReports] = useState(sampleReports);
  const [live, setLive] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    apiRequest('/reports')
      .then(data => {
        setReports(data.reports);
        setLive(true);
      })
      .catch(() => setLive(false));
  }, []);

  const stats = [
    { label: 'Total reports', value: reports.length, icon: FileText },
    {
      label: 'Pending',
      value: reports.filter(r => r.status === 'Pending').length,
      icon: Clock3
    },
    {
      label: 'In progress',
      value: reports.filter(r => r.status === 'In Progress').length,
      icon: AlertCircle
    },
    {
      label: 'Resolved',
      value: reports.filter(r => r.status === 'Resolved').length,
      icon: CheckCircle2
    }
  ];

  return (
    <div className="page-wrap page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Community Dashboard</h1>
          <p>Welcome back, {user?.name || 'User'}.</p>
        </div>
        <span className={`connection-pill ${live ? 'online' : ''}`}>
          {live ? 'Live' : 'Offline'}
        </span>
      </div>

      <div className="stats-grid">
        {stats.map(item => (
          <div className="stat-card" key={item.label}>
            <item.icon />
            <div>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>Recent community reports</h2>
          <p>Latest issues shared by the community</p>
        </div>
      </div>

      <div className="report-grid">
        {reports.slice(0, 6).map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
