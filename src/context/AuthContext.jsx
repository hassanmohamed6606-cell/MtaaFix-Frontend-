
import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('mtaafix_token')) {
      setLoading(false)
      return
    }

    apiRequest('/auth/me')
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('mtaafix_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    // Do not accidentally reuse a previous session.
    localStorage.removeItem('mtaafix_token')
    setUser(null)

    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    // Only normal login returns an access token immediately.
    if (data.access_token) {
      localStorage.setItem('mtaafix_token', data.access_token)
      setUser(data.user)
    }

    return data
  }

  async function register(name, email, password) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    localStorage.setItem('mtaafix_token', data.access_token)
    setUser(data.user)

    return data
  }

  async function setupAdminTwoFactor(enrollmentToken) {
    return apiRequest('/auth/2fa/setup', {
      method: 'POST',
      body: JSON.stringify({
        enrollment_token: enrollmentToken,
      }),
    })
  }

  async function enableAdminTwoFactor(enrollmentToken, code) {
    const data = await apiRequest('/auth/2fa/enable', {
      method: 'POST',
      body: JSON.stringify({
        enrollment_token: enrollmentToken,
        code,
      }),
    })

    if (data.access_token) {
      localStorage.setItem('mtaafix_token', data.access_token)
      setUser(data.user)
    }

    return data
  }

  async function verifyTwoFactor(mfaToken, code) {
    const data = await apiRequest('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({
        mfa_token: mfaToken,
        code,
      }),
    })

    if (data.access_token) {
      localStorage.setItem('mtaafix_token', data.access_token)
      setUser(data.user)
    }

    return data
  }

  function logout() {
    localStorage.removeItem('mtaafix_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setupAdminTwoFactor,
        enableAdminTwoFactor,
        verifyTwoFactor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
