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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    const user = data.user
    if (user) {
      // Attempt to insert user into public_users:
      const { error: insertError } = await supabase.from('public_users').insert([
        {
          id: user.id,
          email: user.email,
        },
      ])

      // only log error if not a duplicate:
      if (insertError && !insertError.message.includes('duplicate')) {
        console.error('public_users insert failed:', insertError)
      }
    }

    navigate('/booking')
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
