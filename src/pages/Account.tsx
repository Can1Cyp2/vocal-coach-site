import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import {
  AccountWrapper,
  AccountBox,
  AccountTitle,
  AccountRow,
  AccountLabel,
  AccountValue,
  ResetButton,
  SuccessMessage,
} from '../styles/Account'
import { Link } from 'react-router-dom'

const Account = () => {
  const { user, isAdmin } = useAuth()
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const handlePasswordReset = async () => {
    if (!user?.email) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setStatus(error ? 'error' : 'sent')
  }

  if (!user) return null

  return (
    <AccountWrapper>
      <AccountBox>
        <AccountTitle>My Account</AccountTitle>
        <AccountRow>
          <AccountLabel>Email:</AccountLabel>
          <AccountValue>{user.email}</AccountValue>
        </AccountRow>
        <AccountRow>
          <AccountLabel>User ID:</AccountLabel>
          <AccountValue>{user.id}</AccountValue>
        </AccountRow>

        <ResetButton onClick={handlePasswordReset}>
          Reset Password
        </ResetButton>

        {status === 'sent' && (
          <SuccessMessage>
            ✅ Password reset email sent to {user.email}
          </SuccessMessage>
        )}
        {status === 'error' && (
          <SuccessMessage style={{ color: 'red' }}>
            ⚠️ Failed to send password reset email
          </SuccessMessage>
        )}
      </AccountBox>

      { isAdmin && (
        <AccountBox>
          <AccountTitle>Admin Access</AccountTitle>
          <AccountRow>
            <AccountLabel>Privileges:</AccountLabel>
            <AccountValue>
              <strong>✔ Admin</strong>
            </AccountValue>
          </AccountRow>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <ResetButton>Go to Admin Dashboard</ResetButton>
          </Link>
        </AccountBox>
      )}
    </AccountWrapper>
  )
}

export default Account
