import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../util/supabaseClient'
import {
  SignupWrapper,
  SignupBox,
  SignupTitle,
  SignupSubtitle,
  SignupForm,
  SignupInput,
  SignupButton,
  ErrorMessage,
} from '../styles/Auth/Signup'


const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      navigate('/login') // Redirect after signup
    }
  }

  return (
    <SignupWrapper>
      <SignupBox>
        <SignupTitle>Sign Up</SignupTitle>
        <SignupSubtitle>Create an account to start booking vocal sessions.</SignupSubtitle>
        <SignupForm onSubmit={handleSignup}>
          <SignupInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setEmail(e.target.value)}
            required
          />
          <SignupInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setPassword(e.target.value)}
            required
          />
          <SignupButton type="submit">Create Account</SignupButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </SignupForm>
      </SignupBox>
    </SignupWrapper>
  )
}

export default Signup
