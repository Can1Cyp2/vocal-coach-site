import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../util/supabaseClient'
import LoginPage from '../pages/Login' // <- dumb UI component

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/booking') // or homepage maybe? Will see later
    }
  }

  return (
    <LoginPage
      email={email}
      password={password}
      error={error}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  )
}

export default Login
