
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth({ mode = 'login' }) {
  const isRegister = mode === 'register'

  const {
    login,
    register,
    setupAdminTwoFactor,
    enableAdminTwoFactor,
    verifyTwoFactor,
  } = useAuth()

  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [stage, setStage] = useState('login')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [mfaToken, setMfaToken] = useState('')
  const [enrollmentToken, setEnrollmentToken] = useState('')
  const [provisioningUri, setProvisioningUri] = useState('')
  const [manualSecret, setManualSecret] = useState('')
  const [code, setCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState([])

  const destination = params.get('next') || '/dashboard'

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password)
        navigate(destination)
        return
      }

      const data = await login(form.email, form.password)

      if (data.access_token) {
        navigate(destination)
        return
      }

      if (data.mfa_required) {
        setMfaToken(data.mfa_token)
        setStage('verify')
        return
      }

      if (data.mfa_enrollment_required) {
        setEnrollmentToken(data.enrollment_token)

        const setup = await setupAdminTwoFactor(
          data.enrollment_token
        )

        setProvisioningUri(setup.provisioning_uri)
        setManualSecret(setup.manual_secret)
        setStage('admin-setup')
        return
      }

      throw new Error('Unexpected login response from server.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      await verifyTwoFactor(mfaToken, code.trim())
      navigate(destination)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function enableAdmin(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      const data = await enableAdminTwoFactor(
        enrollmentToken,
        code.trim()
      )

      setRecoveryCodes(data.recovery_codes || [])
      setStage('recovery')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function finishEnrollment() {
    navigate(destination)
  }

  // -----------------------------------------------------
  // ADMIN RECOVERY CODES
  // -----------------------------------------------------

  if (stage === 'recovery') {
    return (
      <div className="page-wrap page-content auth-wrap">
        <div className="form-card auth-card">
          <span className="eyebrow">SECURITY SETUP COMPLETE</span>

          <h1>Save your recovery codes</h1>

          <p>
            Your administrator account is now protected by
            two-factor authentication.
          </p>

          <div className="recovery-code-list">
            {recoveryCodes.map((item, index) => (
              <code key={index}>{item}</code>
            ))}
          </div>

          <p className="field-error">
            Keep these codes somewhere secure. Each code can
            only be used once.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={() => {
              navigator.clipboard?.writeText(
                recoveryCodes.join('\n')
              )
            }}
          >
            Copy recovery codes
          </button>

          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={finishEnrollment}
          >
            Continue to dashboard
          </button>
        </div>
      </div>
    )
  }

  // -----------------------------------------------------
  // ADMIN AUTHENTICATOR SETUP
  // -----------------------------------------------------

  if (stage === 'admin-setup') {
    return (
      <div className="page-wrap page-content auth-wrap">
        <form className="form-card auth-card" onSubmit={enableAdmin}>
          <span className="eyebrow">ADMINISTRATOR SECURITY</span>

          <h1>Set up two-factor authentication</h1>

          <p>
            Open Google Authenticator or Microsoft Authenticator.
            Add a new account using the secret below.
          </p>

          <label>
            Your authenticator secret
            <input
              value={manualSecret}
              readOnly
              onFocus={e => e.target.select()}
            />
          </label>

          <label>
            Provisioning URI
            <textarea
              value={provisioningUri}
              readOnly
              rows={3}
              onFocus={e => e.target.select()}
            />
          </label>

          <p>
            Enter the six-digit code generated by your
            authenticator app to confirm setup.
          </p>

          <label>
            Six-digit verification code
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={e =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="000000"
              required
            />
          </label>

          {error && <p className="field-error">{error}</p>}

          <button
            className="btn btn-primary btn-full"
            disabled={busy || code.length !== 6}
          >
            {busy ? 'Verifying…' : 'Enable 2FA'}
          </button>
        </form>
      </div>
    )
  }

  // -----------------------------------------------------
  // RESIDENT TWO-FACTOR VERIFICATION
  // -----------------------------------------------------

  if (stage === 'verify') {
    return (
      <div className="page-wrap page-content auth-wrap">
        <form className="form-card auth-card" onSubmit={verifyCode}>
          <span className="eyebrow">ACCOUNT SECURITY</span>

          <h1>Verify your identity</h1>

          <p>
            Enter the six-digit code from your authenticator
            app. You can also enter a recovery code.
          </p>

          <label>
            Authentication code
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter your code"
              autoComplete="one-time-code"
              required
            />
          </label>

          {error && <p className="field-error">{error}</p>}

          <button
            className="btn btn-primary btn-full"
            disabled={busy || !code.trim()}
          >
            {busy ? 'Verifying…' : 'Verify and sign in'}
          </button>
        </form>
      </div>
    )
  }

  // -----------------------------------------------------
  // NORMAL LOGIN AND REGISTRATION
  // -----------------------------------------------------

  return (
    <div className="page-wrap page-content auth-wrap">
      <form className="form-card auth-card" onSubmit={submit}>
        <span className="eyebrow">
          {isRegister ? 'JOIN YOUR COMMUNITY' : 'WELCOME BACK'}
        </span>

        <h1>
          {isRegister ? 'Create your account' : 'Sign in to MtaaFix'}
        </h1>

        <p>
          {isRegister
            ? 'Create an account to submit and manage your reports.'
            : 'Sign in to submit and manage community reports.'}
        </p>

        {isRegister && (
          <label>
            Full name
            <input
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </label>
        )}

        <label>
          Email address
          <input
            type="email"
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            minLength="8"
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </label>

        {error && <p className="field-error">{error}</p>}

        <button
          className="btn btn-primary btn-full"
          disabled={busy}
        >
          {busy
            ? 'Please wait…'
            : isRegister
              ? 'Create account'
              : 'Sign in'}
        </button>

        <p className="form-note">
          {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </form>
    </div>
  )
}
