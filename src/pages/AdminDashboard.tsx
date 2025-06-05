import React, { JSX, useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import { useAdminData } from '../hooks/useAdminData'
import { useAdminBookings } from '../hooks/useAdminBookings'
import { sendCancellationEmail } from '../util/sendCancellationEmail'
import { getNextDateForDay } from '../util/nextDateDay'
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
import {
  TimeGroupWrapper,
  TimeGroupTitle,
  TimeGrid,
  TimeButton,
} from '../styles/AdminLessonTimes'

const timeGroups = {
  'Early Morning': Array.from({ length: 8 }, (_, i) => {
    const hour = i === 0 ? 12 : i
    return `${hour}:00 AM`
  }),
  'Midday': Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8
    return hour === 12 ? `12:00 PM` : `${hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`
  }),
  'Evening': Array.from({ length: 6 }, (_, i) => {
    const hour = i + 18
    return `${hour % 12 || 12}:00 PM`
  }),
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Helper function to normalize datetime strings for comparison:
const normalizeDateTime = (dateTimeStr: string): string => {
  try {
    let date: Date
    
    // If it's in ISO format like: "2025-06-10T19:00:00", convert to our standard format
    if (dateTimeStr.includes('T')) {
      date = new Date(dateTimeStr)
    }
    // If it's already in format like: example "2025-06-03 7:00 PM", parse it
    else {
      date = parse(dateTimeStr, 'yyyy-MM-dd h:mm a', new Date())
    }
    
    // Return in standard format: example "2025-06-03 7:00 PM":
    return format(date, 'yyyy-MM-dd h:mm a')
  } catch (error) {
    console.error('Error normalizing datetime:', dateTimeStr, error)
    return dateTimeStr
  }
}

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
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [makeRecurring, setMakeRecurring] = useState(false)
  const [allSessions, setAllSessions] = useState<any[]>([])

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
      
      const fetchAllSessions = async () => {
        try {
          // get all available sessions:
          const { data: sessions, error: sessionError } = await supabase
            .from('available_sessions')
            .select('*')

          if (sessionError) {
            console.error('Failed to load available sessions:', sessionError)
            return
          }

          // Get all bookings:
          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('id, booking_time, user_id, status, duration_minutes, created_at')

          if (bookingsError) {
            console.error('Failed to load bookings:', bookingsError)
            return
          }

          // Get all user emails:
          const { data: publicUsers, error: usersError } = await supabase
            .from('public_users')
            .select('id, email')

          if (usersError) {
            console.error('Failed to load public users:', usersError)
            return
          }

          console.log('Loaded bookings:', bookings) // Debug log
          console.log('Loaded users:', publicUsers) // Debug log

          // Create a map of user_id -> email for quick lookup
          const userEmailMap = new Map()
          publicUsers?.forEach(user => {
            userEmailMap.set(user.id, user.email)
          })

          // Enrich sessions with booking information
          const enriched = (sessions || []).map((session) => {
            const normalizedSessionTime = normalizeDateTime(session.session_time)
            
            const matchingBooking = bookings?.find(booking => {
              const normalizedBookingTime = normalizeDateTime(booking.booking_time)
              return normalizedBookingTime === normalizedSessionTime
            })
            
            console.log('Session:', session.session_time, '-> Normalized:', normalizedSessionTime)
            if (matchingBooking) {
              console.log('Found matching booking:', matchingBooking.booking_time, '-> Normalized:', normalizeDateTime(matchingBooking.booking_time))
            }
            
            return {
              ...session,
              booked_user_id: matchingBooking?.user_id ?? null,
              booked_email: matchingBooking?.user_id ? userEmailMap.get(matchingBooking.user_id) : null,
              booking_id: matchingBooking?.id ?? null,
              booking_status: matchingBooking?.status ?? null,
            }
          })

          console.log('Enriched sessions:', enriched) // Debug log
          setAllSessions(enriched)
          
        } catch (error) {
          console.error('Error in fetchAllSessions:', error)
        }
      }

      fetchAllSessions()
    }
  }, [verified, loadUsersAndAdmins])

  // Refresh sessions when bookings change
  useEffect(() => {
    if (verified && bookings.length > 0) {
      // Re-fetch sessions when bookings are updated
      const refreshSessions = async () => {
        const { data: sessions, error: sessionError } = await supabase
          .from('available_sessions')
          .select('*')

        if (sessionError) return

        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, booking_time, user_id, status')

        if (bookingsError) return

        const { data: publicUsers, error: usersError } = await supabase
          .from('public_users')
          .select('id, email')

        if (usersError) return

        // Create a map of user_id -> email for quick lookup
        const userEmailMap = new Map()
        publicUsers?.forEach(user => {
          userEmailMap.set(user.id, user.email)
        })

        const enriched = (sessions || []).map((session) => {
          const normalizedSessionTime = normalizeDateTime(session.session_time)
          
          const matchingBooking = bookings?.find(booking => {
            const normalizedBookingTime = normalizeDateTime(booking.booking_time)
            return normalizedBookingTime === normalizedSessionTime
          })
          
          return {
            ...session,
            booked_user_id: matchingBooking?.user_id ?? null,
            booked_email: matchingBooking?.user_id ? userEmailMap.get(matchingBooking.user_id) : null,
            booking_id: matchingBooking?.id ?? null,
            booking_status: matchingBooking?.status ?? null,
          }
        })

        setAllSessions(enriched)
      }

      refreshSessions()
    }
  }, [bookings, verified])

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

      // Get available one-time and recurring sessions for this day
      const availableSlots: any[] = []

      for (const session of allSessions) {
        const isRecurring = session.recurring_day && session.recurring_time

        if (isRecurring) {
          // Generate all future dates this session recurs on
          for (let i = 0; i < 12; i++) {
            const baseDate = new Date(session.session_time)
            const nextDate = addDays(baseDate, i * 7) // weekly recurrence
            const nextDateStr = format(nextDate, 'yyyy-MM-dd')

            if (nextDateStr === dateStr) {
              availableSlots.push({
                ...session,
                session_time: format(nextDate, 'yyyy-MM-dd h:mm a'), // Use standard format
              })
              break
            }
          }
        } else if (session.session_time && format(new Date(session.session_time), 'yyyy-MM-dd') === dateStr) {
          availableSlots.push(session)
        }
      }

      calendar.push(
        <DayCell
          key={dateStr}
          $isToday={isToday(day)}
          $isCurrentMonth={isCurrentMonth}
        >
          <span>{format(day, 'd')}</span>
          {availableSlots.map((session, idx) => {
            const timeLabel = format(new Date(session.session_time), 'h:mm a')
            const isBooked = !!session.booked_user_id
            const isMine = session.booked_user_id === user?.id

            return (
              <SlotButton
                key={`${timeLabel}-${idx}`}
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
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
            <h4>Select Lesson Times</h4>

            {Object.entries(timeGroups).map(([label, times]) => (
              <TimeGroupWrapper key={label}>
                <TimeGroupTitle>{label}</TimeGroupTitle>
                <TimeGrid>
                  {times.map((time) => (
                    <TimeButton
                      key={time}
                      $selected={selectedTimes.includes(time)}
                      onClick={() =>
                        setSelectedTimes(prev =>
                          prev.includes(time)
                            ? prev.filter(t => t !== time)
                            : [...prev, time]
                        )
                      }
                    >
                      {time}
                    </TimeButton>
                  ))}
                </TimeGrid>
              </TimeGroupWrapper>
            ))}

            <h4 style={{ marginTop: '1rem' }}>Select Days of the Week</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDays(prev =>
                      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                    )
                  }
                  style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: '4px',
                    border: selectedDays.includes(day) ? '2px solid #28a745' : '1px solid #ccc',
                    backgroundColor: selectedDays.includes(day) ? '#e7f7ee' : '#fff',
                    cursor: 'pointer',
                    fontWeight: selectedDays.includes(day) ? 'bold' : 'normal',
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <label style={{ marginTop: '1rem', display: 'block' }}>
              <input
                type="checkbox"
                checked={makeRecurring}
                onChange={() => setMakeRecurring(!makeRecurring)}
              />
              Make these times available weekly
            </label>

            <AdminActionButton
              style={{ marginTop: '1rem' }}
              onClick={async () => {
                if (!selectedTimes.length || !selectedDays.length) {
                  alert('Select at least one time and one day.')
                  return
                }

                const { error } = await supabase.from('available_sessions').insert(
                  selectedDays.flatMap(day =>
                    selectedTimes.map(time => {
                      const dateObj = getNextDateForDay(day, time)
                      const formattedTime = format(dateObj, 'yyyy-MM-dd h:mm a')
                      return {
                        session_time: formattedTime,
                        duration_minutes: 60,
                        created_by: user?.id,
                        is_booked: false,
                        recurring_day: makeRecurring ? day : null,
                        recurring_time: makeRecurring ? time : null,
                      }
                    })
                  )
                )

                if (error) {
                  console.error('Failed to add sessions:', error)
                  alert('Failed to add session times.')
                } else {
                  alert('Lesson times added!')
                  setSelectedDays([])
                  setSelectedTimes([])
                  setMakeRecurring(false)
                  setShowAddTimes(false)
                  loadBookings()
                }
              }}
            >
              Save Lesson Times
            </AdminActionButton>
          </div>
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
            onConfirm={(message) => {
              cancelBooking(selectedBooking.id)
              sendCancellationEmail(
                selectedBooking.email,
                selectedBooking.booking_time,
                message
              ).then(() => {
                alert('Cancellation email sent.')
              }).catch((err) => {
                console.error('Email failed:', err)
                alert('Booking was cancelled, but email failed to send.')
              })

              setModalOpen(false)
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