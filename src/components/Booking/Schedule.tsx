import React, { useEffect, useState } from 'react'
import { supabase } from '../../util/supabaseClient'
import { useAuth } from '../../context/AuthContext'

import {
  startOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  addDays,
  isSameMonth,
  isToday,
  format,
  addWeeks,
  parse,
} from 'date-fns'

import BookingModal from './BookingModal'
import CancelModal from './CancelModal'
import {
  ScheduleSectionWrapper,
  ScheduleContainer,
  CalendarHeader,
  MonthNavButton,
  MonthTitle,
  MonthGrid,
  DayLabel,
  DayCell,
  SlotButton,
} from '../../styles/Booking/Schedule'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const times = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']

interface BookedSlotInfo {
  user_id: string
  status: string
  recurring_booking?: boolean
  original_booking_time?: string // Store the original DB format for deletion
}

// Helper function to normalize booking time format
const normalizeBookingTime = (bookingTime: string): string => {
  try {
    // Handle ISO format (2025-06-30T16:00:00.000Z)
    if (bookingTime.includes('T')) {
      const date = new Date(bookingTime)
      return format(date, 'yyyy-MM-dd h:mm a')
    }

    // Handle existing format (2025-07-14 10:00 AM)
    if (bookingTime.includes('AM') || bookingTime.includes('PM')) {
      return bookingTime
    }

    // Fallback: try to parse as date
    const date = new Date(bookingTime)
    return format(date, 'yyyy-MM-dd h:mm a')
  } catch (error) {
    console.error('Error normalizing booking time:', bookingTime, error)
    return bookingTime
  }
}

const Schedule = () => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: BookedSlotInfo }>({})
  const [selectedSlot, setSelectedSlot] = useState<{ key: string; label: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [unbooking, setUnbooking] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [sessionToCancel, setSessionToCancel] = useState<{ key: string; isRecurring: boolean } | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    // Add check to prevent duplicate fetches
    if (!user) return

    const fetchAvailableSessions = async () => {
      const { data, error } = await supabase
        .from('available_sessions')
        .select('session_time, recurring_day, recurring_time, is_booked, created_by')

      if (error) {
        console.error('Error fetching available sessions:', error.message)
        return
      }

      const slots: { [key: string]: BookedSlotInfo } = {}

      const today = new Date()
      const startDate = startOfWeek(startOfMonth(today), { weekStartsOn: 0 })
      const endDate = endOfWeek(addMonths(startOfMonth(today), 1), { weekStartsOn: 0 })

      for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
        const dateStr = format(d, 'yyyy-MM-dd')
        const weekday = format(d, 'EEEE')

        for (const session of data || []) {
          const isRecurring = !!session.recurring_day && !!session.recurring_time
          const normalizedKey = isRecurring
            ? `${dateStr} ${session.recurring_time}`
            : normalizeBookingTime(session.session_time)

          if (isRecurring && session.recurring_day !== weekday) continue
          if (!normalizedKey) continue

          slots[normalizedKey] = {
            user_id: '', // not booked yet
            status: 'available',
            recurring_booking: isRecurring,
            original_booking_time: session.session_time || normalizedKey,
          }
        }
      }

      setBookedSlots(slots)
    }

    fetchAvailableSessions()
  }, [user?.id])

  const renderMonth = (month: Date) => {
    const days = []
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })

    let day = start;
    while (day <= end) {
      const currentDay = new Date(day);
      const dateKey = format(currentDay, 'yyyy-MM-dd');
      const isCurrent = isSameMonth(currentDay, month);

      days.push(
        <DayCell key={dateKey} $isToday={isToday(currentDay)} $isCurrentMonth={isCurrent}>
          <span>{format(currentDay, 'd')}</span>
          {isCurrent &&
            times.map(time => {
              const slotKey = `${dateKey} ${time}`;
              const booking = bookedSlots[slotKey];
              const isAvailable = booking?.status === 'available'
              const isMine = booking?.user_id === user?.id;

              return (
                <SlotButton
                  key={slotKey}
                  $booked={!isAvailable}
                  $own={isMine}
                  onClick={() => handleSlotClick(currentDay, time, !isAvailable && isMine)}
                  disabled={!isAvailable && !isMine}
                />
              );
            })}
        </DayCell>
      );

      day = addDays(day, 1);
    }

    return days
  }

  const handleSlotClick = (day: Date, time: string, canUnbook: boolean) => {
    const key = `${format(day, 'yyyy-MM-dd')} ${time}`
    const label = `${format(day, 'PPP')} at ${time}`
    setSelectedSlot({ key, label })
    setUnbooking(canUnbook)
    setModalOpen(true)
  }

  const handleModalConfirm = async (recurring = false) => {
    if (!selectedSlot || !user) return

    const baseKey = selectedSlot.key
    const [dateStr, ...timeParts] = baseKey.split(' ')
    const timeStr = timeParts.join(' ')
    const fullDateTimeStr = `${dateStr} ${timeStr}`

    const baseDate = parse(fullDateTimeStr, 'yyyy-MM-dd h:mm a', new Date())

    const bookingsToInsert = []

    for (let i = 0; i < (recurring ? 12 : 1); i++) {
      const nextDate = addWeeks(baseDate, i)
      const slotKey = format(nextDate, 'yyyy-MM-dd h:mm a')

      bookingsToInsert.push({
        user_id: user.id,
        booking_time: slotKey,
        duration_minutes: 60,
        status: 'booked',
        coach_id: null,
        recurring_booking: recurring,
      })
    }

    const { error } = await supabase.from('bookings').insert(bookingsToInsert)

    if (error) {
      console.error('Error booking session(s):', error.message)
    } else {
      const newSlots = Object.fromEntries(
        bookingsToInsert.map(b => [
          b.booking_time,
          {
            user_id: user.id,
            status: 'booked',
            recurring_booking: b.recurring_booking,
            original_booking_time: b.booking_time
          },
        ])
      )

      setBookedSlots(prev => ({ ...prev, ...newSlots }))
    }

    closeModal()
  }

  const handleUnbookConfirm = async () => {
    if (!selectedSlot || !user) return

    const booking = bookedSlots[selectedSlot.key]
    const originalBookingTime = booking?.original_booking_time || selectedSlot.key

    console.log('Attempting to unbook:', {
      user_id: user.id,
      booking_time: originalBookingTime,
      normalized_key: selectedSlot.key
    })

    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .match({
        user_id: user.id,
        booking_time: originalBookingTime,
      })
      .select() // Add this to get the deleted rows back

    console.log('Unbook result:', { data, error })

    if (error) {
      console.error('Error cancelling booking:', error.message)
      console.error('Full error:', error)
      alert(`Failed to cancel booking: ${error.message}`)
    } else if (!data || data.length === 0) {
      console.warn('No rows were deleted - this suggests a mismatch')
      alert('Booking not found or already cancelled')
    } else {
      console.log('Successfully cancelled booking:', data)
      const updated = { ...bookedSlots }
      delete updated[selectedSlot.key]
      setBookedSlots(updated)
    }

    closeModal()
  }

  const handleCancelClick = (key: string) => {
    const booking = bookedSlots[key]
    const isRecurring = booking?.recurring_booking === true

    setSessionToCancel({ key, isRecurring })
    setCancelModalOpen(true)
  }

  const handleCancelConfirm = async (cancelAll: boolean) => {
    if (!sessionToCancel || !user) return

    try {
      console.log('=== DEBUGGING DATABASE CONTENT ===')
      const { data: allUserBookings, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)

      console.log('All user bookings in DB:', allUserBookings)
      console.log('Database booking_time values:', allUserBookings?.map(b => b.booking_time))

      const booking = bookedSlots[sessionToCancel.key]
      const originalBookingTime = booking?.original_booking_time || sessionToCancel.key

      console.log('Session key we\'re trying to cancel:', sessionToCancel.key)
      console.log('Booking object from state:', booking)
      console.log('Original booking time to match:', originalBookingTime)
      console.log('Session to cancel:', sessionToCancel)

      let deleteQuery
      let debugInfo = {}

      if (cancelAll && sessionToCancel.isRecurring) {
        // Delete all recurring sessions for this user
        debugInfo = {
          type: 'recurring',
          user_id: user.id,
          recurring_booking: true
        }
        deleteQuery = supabase
          .from('bookings')
          .delete()
          .match({
            user_id: user.id,
            recurring_booking: true
          })
          .select() // Add select to get deleted rows
      } else {
        // Delete just this specific session using the original booking time
        debugInfo = {
          type: 'single',
          user_id: user.id,
          booking_time: originalBookingTime
        }
        deleteQuery = supabase
          .from('bookings')
          .delete()
          .match({
            user_id: user.id,
            booking_time: originalBookingTime
          })
          .select() // Add select to get deleted rows
      }

      console.log('Attempting to delete booking with:', debugInfo)

      const { data, error } = await deleteQuery

      console.log('Delete result:', { data, error })

      if (error) {
        console.error('Error deleting booking:', error.message)
        alert(`Failed to cancel booking: ${error.message}`)
      } else if (!data || data.length === 0) {
        console.warn('No rows were deleted - this suggests a mismatch')
        console.log('Available bookings in DB that match user_id:',
          allUserBookings?.filter(b => b.user_id === user.id))
        alert('Booking not found or already cancelled')
      } else {
        console.log('Successfully deleted booking(s):', data)

        const updated = { ...bookedSlots }

        if (cancelAll && sessionToCancel.isRecurring) {
          // Remove all recurring sessions from local state
          for (const k of Object.keys(bookedSlots)) {
            if (
              bookedSlots[k].user_id === user.id &&
              bookedSlots[k].recurring_booking === true
            ) {
              delete updated[k]
            }
          }
        } else {
          // Remove just this session from local state
          delete updated[sessionToCancel.key]
        }

        setBookedSlots(updated)
      }
    } catch (err) {
      console.error('Error in cancel operation:', err)
      if (err instanceof Error) {
        alert(`Failed to cancel booking: ${err.message}`)
      } else {
        alert('Failed to cancel booking: An unknown error occurred.')
      }
    }

    closeCancelModal()
  }

  const closeCancelModal = () => {
    setCancelModalOpen(false)
    setSessionToCancel(null)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedSlot(null)
    setUnbooking(false)
  }

  return (
    <ScheduleSectionWrapper>
      <ScheduleContainer>
        <CalendarHeader>
          <MonthNavButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            Prev
          </MonthNavButton>
          <MonthTitle>{format(currentMonth, 'MMMM yyyy')}</MonthTitle>
          <MonthNavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next
          </MonthNavButton>
        </CalendarHeader>

        <MonthGrid>
          {weekdays.map(day => (
            <DayLabel key={day}>{day}</DayLabel>
          ))}
          {renderMonth(currentMonth)}
        </MonthGrid>
      </ScheduleContainer>

      <BookingModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={unbooking ? handleUnbookConfirm : handleModalConfirm}
        sessionTime={selectedSlot?.label || ''}
        isUnbooking={unbooking}
      />

      <CancelModal
        isOpen={cancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleCancelConfirm}
        sessionTime={sessionToCancel?.key || ''}
        isRecurring={sessionToCancel?.isRecurring || false}
      />

      {/* User's upcoming sessions list: */}
      {user && (
        <div style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid #ccc' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Upcoming Sessions</h3>
          {Object.entries(bookedSlots)
            .filter(([_, booking]) => booking.user_id === user.id)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([key]) => {
              const isRecurring = bookedSlots[key]?.recurring_booking === true

              return (
                <div
                  key={key}
                  style={{
                    background: '#f9f9f9',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{key}{isRecurring ? ' (Recurring)' : ''}</span>
                  <button
                    onClick={() => handleCancelClick(key)}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )
            })}
          {Object.values(bookedSlots).filter(b => b.user_id === user.id).length === 0 && (
            <p style={{ fontStyle: 'italic', color: '#888' }}>No sessions booked yet.</p>
          )}
        </div>
      )}
    </ScheduleSectionWrapper>
  )
}

export default Schedule