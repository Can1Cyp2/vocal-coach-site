import React, { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import { useAdminData } from '../hooks/useAdminData'
import { useAdminBookings } from '../hooks/useAdminBookings'
import { sendCancellationEmail } from '../util/sendCancellationEmail'
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
} from 'date-fns'
import AdminCancelModal from '../components/Booking/AdminCancelModal'

const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']

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


  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        navigate('/')
        return
      }

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
      loadBookings()
    }
  }, [verified, loadUsersAndAdmins, loadBookings])

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

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const calendar = []

    for (let i = 0; i < 7; i++) {
      calendar.push(<DayLabel key={`label-${i}`}>{dayLabels[i]}</DayLabel>)
    }

    let day = startDate
    while (day <= endDate) {
      const isCurrentMonth = isSameMonth(day, monthStart)
      const dateStr = format(day, 'yyyy-MM-dd')

      calendar.push(
        <DayCell
          key={dateStr}
          $isToday={isToday(day)}
          $isCurrentMonth={isCurrentMonth}
        >
          <span>{format(day, 'd')}</span>
          {timeSlots.map((slot) => {
            const fullDateTime = `${dateStr} ${slot}`
            const booking = bookings.find(b => b.booking_time === fullDateTime)
            return (
              <SlotButton
                key={slot}
                $booked={!!booking}
                $own={booking?.user_id === user?.id}
                disabled={!booking}
                onClick={() => {
                  if (booking) {
                    setSelectedBooking(booking)
                    setModalOpen(true)
                  }
                }}
              >
                {booking ? `${slot} – ${booking.email}` : slot}
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
