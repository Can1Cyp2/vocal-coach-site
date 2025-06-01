import React from 'react'
import Schedule from '../components/Booking/Schedule'
import { useAuth } from '../context/AuthContext'

import {
  BookingWrapper,
  BookingHeader,
  BookingText,
  AuthActions,
  AuthButton,
} from '../styles/Booking/Booking'

const Booking = () => {
  const { user } = useAuth()

  return (
    <BookingWrapper>
      {user ? (
        <>
          <BookingHeader>Book a Session</BookingHeader>
          <BookingText>
            Welcome back! Select a time slot below to reserve your coaching session.
          </BookingText>
          <Schedule />
        </>
      ) : (
        <>
          <BookingHeader>Become a Student</BookingHeader>
          <BookingText>
            To book lessons, please log in or sign up for an account.
            <br />
            If you experience any issues, contact JP via the Contact page or by phone/email.
          </BookingText>
          <AuthActions>
            <AuthButton to="/login">Login</AuthButton>
            <AuthButton to="/signup">Sign Up</AuthButton>
          </AuthActions>
        </>
      )}
    </BookingWrapper>
  )
}

export default Booking
