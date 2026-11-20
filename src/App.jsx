import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import NewReport from './pages/NewReport'
import ReportDetails from './pages/ReportDetails'
import Auth from './pages/Auth'

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/reports" element={<Reports/>}/>
    <Route path="/reports/:id" element={<ReportDetails/>}/>
    <Route path="/login" element={<Auth mode="login"/>}/>
    <Route path="/register" element={<Auth mode="register"/>}/>
    <Route path="/new-report" element={<ProtectedRoute><NewReport/></ProtectedRoute>}/>
    <Route path="*" element={<div className="page-wrap page-content"><h1>Page not found</h1></div>}/>
  </Routes></Layout>
}
