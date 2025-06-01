// src/components/Booking/UpcomingSessions.tsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../../util/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { format, parse } from 'date-fns'
import styled from 'styled-components'

const SessionList = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colours.surface};
  border-radius: 8px;
`

const SessionItem = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
`

const UpcomingSessions = () => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('user_id', user.id)
        .eq('status', 'booked')

      if (error) {
        console.error('Error fetching user bookings:', error.message)
        return
      }

      // Sort by date
      const sorted = data.sort((a, b) => {
        const d1 = parse(a.booking_time, 'yyyy-MM-dd h:mm a', new Date())
        const d2 = parse(b.booking_time, 'yyyy-MM-dd h:mm a', new Date())
        return d1.getTime() - d2.getTime()
      })

      setSessions(sorted)
    }

    fetchUserBookings()
  }, [user])

  return (
    <SessionList>
      <h3>Your Upcoming Sessions</h3>
      {sessions.length === 0 ? (
        <p>No upcoming sessions.</p>
      ) : (
        sessions.map((session, i) => (
          <SessionItem key={i}>
            {session.booking_time}
          </SessionItem>
        ))
      )}
    </SessionList>
  )
}

export default UpcomingSessions
