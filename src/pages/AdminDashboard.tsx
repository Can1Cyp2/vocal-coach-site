import React, { JSX, useCallback, useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import { useAdminData } from '../hooks/useAdminData'
import { useAdminBookings } from '../hooks/useAdminBookings'
import { sendCancellationEmail } from '../util/sendCancellationEmail'
// Import the new shared utilities
import { fetchAllSessionsWithBookings, sortTimeSlots } from '../util/sessionUtils'
import LessonTimeManager from '../components/Booking/LessonTimeManager'
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
                disabled={!isBooked}
                onClick={() => {
                  if (isBooked) {
                    setSelectedBooking({
                      ...session,
                      booking_time: session.session_time,
                      email: session.booked_email,
                      id: session.booking_id
                    })
                    setModalOpen(true)
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
            {adminIds.has(selectedUser.id) ? (
              <AdminActionButton
                disabled={selectedUser.id === user.id}
                onClick={() => handleRemoveAdmin(selectedUser.id)}
              >
                Remove Admin
              </AdminActionButton>
            ) : (
              <AdminActionButton
                onClick={() => handleAddAdmin(selectedUser.id)}
              >
                Make Admin
              </AdminActionButton>
            )}
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
    </AdminWrapper>
  )
}

export default AdminDashboard