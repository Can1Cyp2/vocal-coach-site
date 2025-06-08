import React, { JSX, useCallback, useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import { useAdminData } from '../hooks/useAdminData'
import { useAdminBookings } from '../hooks/useAdminBookings'
import { sendCancellationEmail } from '../util/sendCancellationEmail'
import { fetchAllSessionsWithBookings, sortTimeSlots } from '../util/sessionUtils'
import LessonTimeManager from '../components/Booking/LessonTimeManager'
import AdminBookingModal from '../components/Booking/AdminBookingModal'
import UserLessonListModal from '../components/Booking/UserLessonListModal'
import {
  AdminWrapper,
  AdminBox,
  AdminTitle,
  AdminSubtitle,
  AdminText,
  AdminDivider,
  UserWheel,
  UserCard,
  SelectedUserBox,
  AdminActionButton,
  CalendarHeader,
  MonthTitle,
  MonthNavButton,
  MonthGrid,
  DayLabel,
  DayCell,
  SlotButton,
  AdminButtonGroup,
} from '../styles/AdminDashboard'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  addDays,
  parse,
} from 'date-fns'
import AdminCancelModal from '../components/Booking/AdminCancelModal'

// Configuration constant - change this to adjust how far ahead both components look
const WEEKS_AHEAD = 12

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [verified, setVerified] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const { users, adminIds, loadUsersAndAdmins } = useAdminData()
  const { bookings, loadBookings, cancelBooking } = useAdminBookings()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

  // Admin times management states:
  const [showAddTimes, setShowAddTimes] = useState(false)
  const [allSessions, setAllSessions] = useState<any[]>([])

  const [adminBookingModalOpen, setAdminBookingModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any | null>(null)

  const [userBookingsModalOpen, setUserBookingsModalOpen] = useState(false)
  const [userBookings, setUserBookings] = useState<any[]>([])

  // Use the shared utility function
  const fetchAllSessions = useCallback(async () => {
    const sessions = await fetchAllSessionsWithBookings(WEEKS_AHEAD)
    setAllSessions(sessions)
  }, [])

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        navigate('/')
        return
      }

      // Check if the user is an admin by querying the 'admins' table:
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        setVerified(true)
      } else {
        navigate('/')
      }
    }

    verifyAdmin()
  }, [user, navigate])

  useEffect(() => {
    if (verified) {
      loadUsersAndAdmins()
      fetchAllSessions() // Fetch all sessions on initial load
    }
  }, [verified, loadUsersAndAdmins, fetchAllSessions])

  // Refresh sessions when bookings change
  useEffect(() => {
    if (verified && bookings.length >= 0) { // Changed from > 0 to >= 0 to handle empty bookings
      fetchAllSessions()
    }
  }, [bookings, verified, fetchAllSessions])

  const handleAddAdmin = async (userId: string) => {
    const confirmed = window.confirm('Are you sure you want to grant admin privileges?')
    if (!confirmed) return

    await supabase.from('admins').insert([{ user_id: userId }])
    loadUsersAndAdmins()
  }

  const handleRemoveAdmin = async (userId: string) => {
    if (userId === user?.id) {
      alert("You can't remove yourself as an admin.")
      return
    }

    const confirmed = window.confirm('Are you sure you want to remove this admin?')
    if (!confirmed) return

    await supabase.from('admins').delete().eq('user_id', userId)
    loadUsersAndAdmins()
  }

  const openUserBookings = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to load bookings for user', error)
      return
    }

    setUserBookings(data || [])
    setUserBookingsModalOpen(true)
  }

  const handleAdminBooking = async (userId: string, recurring: boolean) => {
    if (!selectedSession) return

    try {
      console.log('Booking for user ID:', userId)
      console.log('Selected session:', selectedSession)

      // Format the session time consistently
      const sessionTimeFormatted = format(new Date(selectedSession.session_time), 'yyyy-MM-dd h:mm a')

      // First, book the initial session
      const { data: bookingResult, error: bookingError } = await supabase
        .rpc('admin_book_session', {
          target_user_id: userId,
          booking_time_param: sessionTimeFormatted,
          duration_param: 60,
          coach_id_param: null
        })

      if (bookingError) {
        console.error('Error calling admin_book_session:', bookingError)
        alert(`Failed to create booking: ${bookingError.message}`)
        return
      }

      if (!bookingResult.success) {
        console.error('Booking function returned error:', bookingResult.error)
        alert(`Failed to create booking: ${bookingResult.error}`)
        return
      }

      console.log('Initial booking created successfully:', bookingResult)

      // Handle recurring bookings if requested
      // Handle recurring bookings if requested
      if (recurring) {
        const baseDate = new Date(selectedSession.session_time)
        const baseTimeStr = format(baseDate, 'h:mm a') // Get the time part (e.g., "2:00 PM")
        const baseDayOfWeek = baseDate.getDay() // 0 = Sunday, 1 = Monday, etc.

        let successCount = 1 // Count the initial booking

        // Find all future available sessions that match:
        // 1. Same day of the week
        // 2. Same time
        // 3. Not already booked
        // 4. After the initial session date
        const availableRecurringSlots = allSessions.filter(session => {
          const sessionDate = new Date(session.session_time)
          const sessionTimeStr = format(sessionDate, 'h:mm a')
          const sessionDayOfWeek = sessionDate.getDay()

          return (
            sessionDayOfWeek === baseDayOfWeek && // Same day of week
            sessionTimeStr === baseTimeStr && // Same time
            !session.is_booked && // Not already booked
            sessionDate > baseDate && // After the initial session
            session.instance_date // Has a valid instance_date
          )
        })

        // Sort by date to book in chronological order
        availableRecurringSlots.sort((a, b) =>
          new Date(a.session_time).getTime() - new Date(b.session_time).getTime()
        )

        console.log(`Found ${availableRecurringSlots.length} available recurring slots for ${baseTimeStr} on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][baseDayOfWeek]}`)

        // Book all available recurring slots (or maximum 12 if you want to keep that limit)
        const slotsToBook = availableRecurringSlots.slice(0, 12) // Limit to 12 if desired

        for (const slot of slotsToBook) {
          try {
            const slotTimeFormatted = format(new Date(slot.session_time), 'yyyy-MM-dd h:mm a')

            const { data: recurringResult, error: recurringError } = await supabase
              .rpc('admin_book_session', {
                target_user_id: userId,
                booking_time_param: slotTimeFormatted,
                duration_param: 60,
                coach_id_param: null
              })

            if (!recurringError && recurringResult?.success) {
              successCount++
              console.log(`Successfully booked recurring session: ${slotTimeFormatted}`)
            } else {
              console.warn(`Failed to book recurring session ${slotTimeFormatted}:`, recurringError || recurringResult?.error)
            }
          } catch (err) {
            console.error(`Error booking recurring session ${slot.session_time}:`, err)
          }
        }

        const totalAttempted = slotsToBook.length
        const actuallyBooked = successCount - 1 // Subtract the initial booking

        if (actuallyBooked > 0) {
          alert(`Successfully booked ${successCount} sessions total (1 initial + ${actuallyBooked} recurring)`)
        } else {
          alert('Initial session booked, but no recurring sessions were available for the same day/time')
        }
      } else {
        alert('Session booked successfully!')
      }

      // Close modal and refresh data
      setAdminBookingModalOpen(false)
      setSelectedSession(null)
      await fetchAllSessions()
      loadBookings()

    } catch (error) {
      console.error('Error in handleAdminBooking:', error)
      alert('Failed to book session')
    }
  }


  const handleLessonTimesSaved = async () => {
    // Refresh the calendar with new sessions
    await fetchAllSessions()
    loadBookings()
  }

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const calendar: JSX.Element[] = []
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 0; i < 7; i++) {
      calendar.push(<DayLabel key={`label-${i}`}>{dayLabels[i]}</DayLabel>)
    }

    let day = startDate
    while (day <= endDate) {
      const dateStr = format(day, 'yyyy-MM-dd')
      const isCurrentMonth = isSameMonth(day, monthStart)

      // Get all session instances for this specific date
      const availableSlots = allSessions.filter(session => {
        return session.instance_date === dateStr
      })

      // Sort the slots by time (earliest to latest)
      const sortedSlots = sortTimeSlots(availableSlots)

      calendar.push(
        <DayCell
          key={dateStr}
          $isToday={isToday(day)}
          $isCurrentMonth={isCurrentMonth}
        >
          <span>{format(day, 'd')}</span>
          {sortedSlots.map((session, idx) => {
            const timeLabel = format(new Date(session.session_time), 'h:mm a')
            const isBooked = session.is_booked
            const isMine = session.booked_user_id === user?.id

            return (
              <SlotButton
                key={`${session.id}-${session.instance_date}-${idx}`}
                $booked={isBooked}
                $own={isMine}
                onClick={() => {
                  if (isBooked) {
                    setSelectedBooking({
                      ...session,
                      booking_time: session.session_time,
                      email: session.booked_email,
                      id: session.booking_id
                    })
                    setModalOpen(true)
                  } else {
                    setSelectedSession(session)
                    setAdminBookingModalOpen(true)
                  }
                }}
              >
                {isBooked ? `${timeLabel} – ${session.booked_email}` : timeLabel}
              </SlotButton>
            )
          })}
        </DayCell>
      )

      day = addDays(day, 1)
    }

    return calendar
  }

  if (!verified || !user) return null

  return (
    <AdminWrapper>
      <AdminBox>
        <AdminTitle>Admin Dashboard</AdminTitle>
        <AdminSubtitle>Welcome, {user.email}</AdminSubtitle>

        <AdminDivider />
        <AdminText><strong>Admins</strong></AdminText>
        <UserWheel>
          {users.filter(u => adminIds.has(u.id)).map(u => (
            <UserCard
              key={u.id}
              $selected={selectedUser?.id === u.id}
              onClick={() => setSelectedUser(u)}
            >
              {u.email}
            </UserCard>
          ))}
        </UserWheel>

        <AdminDivider />
        <AdminText><strong>Regular Users</strong></AdminText>
        <UserWheel>
          {users.filter(u => !adminIds.has(u.id)).map(u => (
            <UserCard
              key={u.id}
              $selected={selectedUser?.id === u.id}
              onClick={() => setSelectedUser(u)}
            >
              {u.email}
            </UserCard>
          ))}
        </UserWheel>

        {selectedUser && (
          <SelectedUserBox>
            <p><strong>{selectedUser.email}</strong></p>
            <AdminButtonGroup>
              <AdminActionButton onClick={() => openUserBookings(selectedUser.id)}>
                View Lessons
              </AdminActionButton>
              {adminIds.has(selectedUser.id) ? (
                <AdminActionButton
                  disabled={selectedUser.id === user.id}
                  onClick={() => handleRemoveAdmin(selectedUser.id)}
                >
                  Remove Admin
                </AdminActionButton>
              ) : (
                <AdminActionButton onClick={() => handleAddAdmin(selectedUser.id)}>
                  Make Admin
                </AdminActionButton>
              )}
            </AdminButtonGroup>
          </SelectedUserBox>
        )}

        <AdminActionButton onClick={() => setShowAddTimes(!showAddTimes)}>
          {showAddTimes ? 'Close Lesson Time Manager' : 'Add Lesson Times'}
        </AdminActionButton>

        {showAddTimes && (
          <LessonTimeManager
            userId={user.id}
            onSave={handleLessonTimesSaved}
            onClose={() => setShowAddTimes(false)}
          />
        )}

        <AdminDivider />
        <AdminText><strong>Booked Sessions Calendar</strong></AdminText>
        <CalendarHeader>
          <MonthNavButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            ‹ Prev
          </MonthNavButton>
          <MonthTitle>{format(currentMonth, 'MMMM yyyy')}</MonthTitle>
          <MonthNavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next ›
          </MonthNavButton>
        </CalendarHeader>
        <MonthGrid>{renderCalendarDays()}</MonthGrid>

        {selectedBooking && (
          <AdminCancelModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={async (message) => {
              // Cancel the booking:
              await cancelBooking(selectedBooking.id)

              // Send cancellation email:
              try {
                await sendCancellationEmail(
                  selectedBooking.email,
                  selectedBooking.booking_time,
                  message
                )
                alert('Cancellation email sent.')
              } catch (err) {
                console.error('Email failed:', err)
                alert('Booking was cancelled, but email failed to send.')
              }

              // Close modal and refresh sessions:
              setModalOpen(false)
              await fetchAllSessions() // reload the calendar with updated data
            }}
            bookingTime={selectedBooking.booking_time}
            userEmail={selectedBooking.email}
          />
        )}
      </AdminBox>
      {selectedSession && (
        <AdminBookingModal
          isOpen={adminBookingModalOpen}
          onClose={() => {
            setAdminBookingModalOpen(false)
            setSelectedSession(null)
          }}
          onConfirm={handleAdminBooking}
          sessionTime={format(new Date(selectedSession.session_time), 'yyyy-MM-dd h:mm a')}
          users={users}
        />
      )}
      <UserLessonListModal
        isOpen={userBookingsModalOpen}
        onClose={() => setUserBookingsModalOpen(false)}
        bookings={userBookings}
        selectedUser={selectedUser}
        onCancel={async (bookingId, email, bookingTime, message) => {
          await cancelBooking(bookingId)
          await sendCancellationEmail(email, bookingTime, message)
          fetchAllSessions()
          loadBookings()
          setUserBookings(prev => prev.filter(b => b.id !== bookingId))
        }}
      />
    </AdminWrapper>

  )
}

export default AdminDashboard