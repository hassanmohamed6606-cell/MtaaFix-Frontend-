import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      if (isRegister) await register(form.name, form.email, form.password)
      else await login(form.email, form.password)
      navigate(params.get('next') || '/dashboard')
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <div className="page-wrap page-content auth-wrap"><form className="form-card auth-card" onSubmit={submit}>
    <span className="eyebrow">{isRegister ? 'JOIN YOUR COMMUNITY' : 'WELCOME BACK'}</span>
    <h1>{isRegister ? 'Create your account' : 'Sign in to MtaaFix'}</h1>
    <p>{isRegister ? 'Create an account to submit and manage your reports.' : 'Sign in to submit and manage community reports.'}</p>
    {isRegister && <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required/></label>}
    <label>Email address<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required/></label>
    <label>Password<input type="password" minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required/></label>
    {error && <p className="field-error">{error}</p>}
    <button className="btn btn-primary btn-full" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
    <p className="form-note">{isRegister ? 'Already registered?' : "Don't have an account?"} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
  </form></div>
}