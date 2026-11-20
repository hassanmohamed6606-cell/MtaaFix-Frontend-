import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import NewReport from './pages/NewReport'
import ReportDetails from './pages/ReportDetails'
import Auth from './pages/Auth'

import FEATURES from './config/features'

export default function App() {
  return (
    <Layout>
      <Routes>
        {FEATURES.home && <Route path="/" element={<Home />} />}

        {FEATURES.dashboard && (
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        )}

        {FEATURES.reports && (
          <Route path="/reports" element={<Reports />} />
        )}

        {FEATURES.reports && FEATURES.reportDetails && (
          <Route path="/reports/:id" element={<ReportDetails />} />
        )}

        {FEATURES.authentication && (
          <>
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
          </>
        )}

        {FEATURES.reportSubmission && FEATURES.authentication && (
          <Route
            path="/new-report"
            element={
              <ProtectedRoute>
                <NewReport />
              </ProtectedRoute>
            }
          />
        )}

        <Route
          path="*"
          element={
            <div className="page-wrap page-content">
              <h1>Page not found</h1>
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}

