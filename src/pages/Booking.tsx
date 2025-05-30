import React, { useState } from 'react'
import Schedule from '../components/Booking/Schedule'
import {
  BookingWrapper,
  BookingHeader,
  BookingText,
  AuthActions,
  AuthButton,
  ToggleButton,
} from '../styles/Booking/Booking'

const Booking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const toggleLogin = () => setIsLoggedIn(prev => !prev)

  return (
    <BookingWrapper>
      <ToggleButton onClick={toggleLogin}>
        {isLoggedIn ? 'Switch to Logged Out View' : 'Switch to Logged In View'}
      </ToggleButton>

      {isLoggedIn ? (
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
