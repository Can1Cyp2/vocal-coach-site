import React from 'react'
import {
  LoginWrapper,
  LoginBox,
  LoginTitle,
  LoginSubtitle,
  LoginForm,
  LoginInput,
  LoginButton,
  ErrorMessage,
} from '../styles/Auth/Login'

interface Props {
  email: string
  password: string
  error: string | null
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  handleLogin: (e: React.FormEvent) => void
}

const Login: React.FC<Props> = ({
  email,
  password,
  error,
  setEmail,
  setPassword,
  handleLogin,
}) => {
  return (
    <LoginWrapper>
      <LoginBox>
        <LoginTitle>Login</LoginTitle>
        <LoginSubtitle>Log in to your account to book a session.</LoginSubtitle>
        <LoginForm onSubmit={handleLogin}>
          <LoginInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <LoginButton type="submit">Log In</LoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
      </LoginBox>
    </LoginWrapper>
  )
}

export default Login
