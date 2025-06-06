import { format, addDays, parse } from 'date-fns'
import { supabase } from './supabaseClient'

interface Session {
  id: string
  session_time: string
  recurring_day?: string
  recurring_time?: string
  [key: string]: any
}

interface Booking {
  id: string
  booking_time: string
  user_id: string
  status: string
  duration_minutes?: number
  created_at?: string
}

interface PublicUser {
  id: string
  email: string
}

interface SessionInstance extends Session {
  instance_date: string
  is_recurring_instance: boolean
  booked_user_id?: string | null
  booked_email?: string | null
  booking_id?: string | null
  booking_status?: string | null
  is_booked?: boolean
  status?: 'booked' | 'available'
}

// Normalize datetime string to consistent format - MUST match the booking format
export const normalizeDateTime = (dateTimeStr: string): string => {
  try {
    let date: Date

    if (dateTimeStr.includes('T')) {
      date = new Date(dateTimeStr)
    } else {
      // Try parsing as the exact format used in bookings
      date = parse(dateTimeStr, 'yyyy-MM-dd h:mm a', new Date())
      if (isNaN(date.getTime())) {
        // Fallback to native Date parsing
        date = new Date(dateTimeStr)
      }
    }

    // Return in the SAME format that bookings use
    return format(date, 'yyyy-MM-dd h:mm a')
  } catch (error) {
    console.error('Error normalizing datetime:', dateTimeStr, error)
    return dateTimeStr
  }
}

// Sort session slots by datetime
export const sortTimeSlots = (slots: Session[]): Session[] => {
  return slots.sort((a, b) => {
    const timeA = new Date(a.session_time).getTime()
    const timeB = new Date(b.session_time).getTime()
    return timeA - timeB
  })
}

// Generate recurring and one-time session instances
export const generateAllSessionInstances = (
  sessions: Session[] = [],
  weeksAhead: number = 12
): SessionInstance[] => {
  const allSessionInstances: SessionInstance[] = []
  const today = new Date()

  sessions.forEach(session => {
    if (session.recurring_day && session.recurring_time) {
      // For recurring sessions
      const baseDate = new Date(session.session_time)
      
      for (let weekOffset = 0; weekOffset < weeksAhead; weekOffset++) {
        const recurringDate = addDays(baseDate, weekOffset * 7)

        if (recurringDate >= today || format(recurringDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
          // Use the SAME format as bookings
          const formattedTime = `${format(recurringDate, 'yyyy-MM-dd')} ${session.recurring_time}`

          allSessionInstances.push({
            ...session,
            session_time: formattedTime,
            instance_date: format(recurringDate, 'yyyy-MM-dd'),
            is_recurring_instance: true
          })
        }
      }
    } else {
      // One-time session
      const sessionDate = new Date(session.session_time)
      if (sessionDate >= today || format(sessionDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        allSessionInstances.push({
          ...session,
          session_time: normalizeDateTime(session.session_time), // Normalize to consistent format
          instance_date: format(sessionDate, 'yyyy-MM-dd'),
          is_recurring_instance: false
        })
      }
    }
  })

  return allSessionInstances
}

// Fetch and enrich sessions with booking data
export const fetchAllSessionsWithBookings = async (
  weeksAhead: number = 12
): Promise<SessionInstance[]> => {
  try {
    const { data: sessions, error: sessionError } = await supabase
      .from('available_sessions')
      .select('*')

    if (sessionError || !sessions) {
      console.error('Failed to load available sessions:', sessionError)
      return []
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, booking_time, user_id, status, duration_minutes, created_at')

    if (bookingsError || !bookings) {
      console.error('Failed to load bookings:', bookingsError)
      return []
    }

    const { data: publicUsers, error: usersError } = await supabase
      .from('public_users')
      .select('id, email')

    if (usersError || !publicUsers) {
      console.error('Failed to load public users:', usersError)
      return []
    }

    const userEmailMap = new Map<string, string>()
    publicUsers.forEach(user => {
      userEmailMap.set(user.id, user.email)
    })

    const allSessionInstances = generateAllSessionInstances(sessions, weeksAhead)

    // Create a map of normalized booking times for faster lookup
    const bookingMap = new Map<string, any>()
    bookings.forEach(booking => {
      const normalizedTime = normalizeDateTime(booking.booking_time)
      bookingMap.set(normalizedTime, booking)
    })

    return allSessionInstances.map(sessionInstance => {
      const normalizedSessionTime = normalizeDateTime(sessionInstance.session_time)
      const matchingBooking = bookingMap.get(normalizedSessionTime)

      return {
        ...sessionInstance,
        session_time: normalizedSessionTime, // Ensure consistent format
        booked_user_id: matchingBooking?.user_id ?? null,
        booked_email: matchingBooking?.user_id ? userEmailMap.get(matchingBooking.user_id) ?? null : null,
        booking_id: matchingBooking?.id ?? null,
        booking_status: matchingBooking?.status ?? null,
        is_booked: !!matchingBooking,
        status: matchingBooking ? 'booked' : 'available'
      }
    })
  } catch (error) {
    console.error('Error in fetchAllSessionsWithBookings:', error)
    return []
  }
}

// Format session slots for calendar use
export const getSessionsForSchedule = async (
  userId: string,
  weeksAhead: number = 12
): Promise<{
  bookedSlots: Record<string, any>
  availableSlotKeys: string[]
}> => {
  const allSessions = await fetchAllSessionsWithBookings(weeksAhead)

  const bookedSlots: Record<string, any> = {}
  const availableSlotKeys: string[] = []

  allSessions.forEach(session => {
    const key = session.session_time // This is now guaranteed to be in 'yyyy-MM-dd h:mm a' format
    const isBooked = session.is_booked
    const bookedByUser = session.booked_user_id === userId

    bookedSlots[key] = {
      user_id: bookedByUser ? userId : '',
      status: isBooked ? 'booked' : 'available',
      recurring_booking: session.is_recurring_instance,
      original_booking_time: session.session_time
    }

    availableSlotKeys.push(key)
  })

  return { bookedSlots, availableSlotKeys }
}