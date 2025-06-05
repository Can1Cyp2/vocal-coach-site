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

interface BookedSlotInfo {
  user_id: string
  status: string
  recurring_booking?: boolean
  original_booking_time?: string
}

const normalizeBookingTime = (bookingTime: string): string => {
  try {
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
  const [availableSlotKeys, setAvailableSlotKeys] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<{ key: string; label: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [unbooking, setUnbooking] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [sessionToCancel, setSessionToCancel] = useState<{ key: string; isRecurring: boolean } | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchAvailableSessions = async () => {
      const { data, error } = await supabase
        .from('available_sessions')
        .select('session_time, recurring_day, recurring_time, is_booked')

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_time, user_id')

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError.message)
        return
      }

      const bookedKeys = new Set<string>()
      const userBookingMap: Record<string, string> = {}

      for (const booking of bookingsData || []) {
        const key = normalizeBookingTime(booking.booking_time)
        bookedKeys.add(key)
        userBookingMap[key] = booking.user_id
      }


      if (error) {
        console.error('Error fetching available sessions:', error.message)
        return
      }

      const slots: { [key: string]: BookedSlotInfo } = {}
      const keys: string[] = []

      const start = startOfWeek(startOfMonth(today))
      const end = endOfWeek(endOfMonth(addMonths(today, 1)))

      for (const session of data || []) {
        const isRecurring = !!session.recurring_day && !!session.recurring_time

        if (isRecurring) {
          // For recurring sessions: generate once per applicable day
          const baseDate = new Date(session.session_time)
          const start = startOfWeek(startOfMonth(today))
          const end = endOfWeek(endOfMonth(addMonths(today, 1)))

          for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
            const weekday = format(d, 'EEEE')
            if (weekday !== session.recurring_day) continue

            const key = `${format(d, 'yyyy-MM-dd')} ${session.recurring_time}`

            const isBooked = bookedKeys.has(key)
            const bookedByUser = userBookingMap[key] === user.id

            slots[key] = {
              user_id: bookedByUser ? user.id : '',
              status: isBooked ? 'booked' : 'available',
              recurring_booking: isRecurring,
              original_booking_time: session.session_time,
            }

            keys.push(key)
          }
        } else {
          // One-time session
          const key = normalizeBookingTime(session.session_time)
          const isBooked = bookedKeys.has(key)
          const bookedByUser = userBookingMap[key] === user.id

          slots[key] = {
            user_id: bookedByUser ? user.id : '',
            status: isBooked ? 'booked' : 'available',
            recurring_booking: isRecurring,
            original_booking_time: session.session_time,
          }

          keys.push(key)
        }
      }


      setBookedSlots(slots)
      setAvailableSlotKeys(keys)
    }

    fetchAvailableSessions()
  }, [user?.id])

  const renderMonth = (month: Date) => {
    const days = []
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))

    let day = start
    while (day <= end) {
      const currentDay = new Date(day)
      const dateKey = format(currentDay, 'yyyy-MM-dd')
      const isCurrent = isSameMonth(currentDay, month)

      // Find all slots for this specific day
      const matchingSlots = availableSlotKeys.filter(key => key.startsWith(dateKey))

      days.push(
        <DayCell key={dateKey} $isToday={isToday(currentDay)} $isCurrentMonth={isCurrent}>
          <span>{format(currentDay, 'd')}</span>
          {matchingSlots.map((slotKey, idx) => {
            const booking = bookedSlots[slotKey]
            if (!booking) return null

            const time = slotKey.split(' ')[1] + ' ' + slotKey.split(' ')[2]
            const isAvailable = booking.status === 'available'
            const isMine = booking.user_id === user?.id

            return (
              <SlotButton
                key={slotKey}
                $booked={!isAvailable}
                $own={isMine}
                onClick={() => handleSlotClick(currentDay, time, !isAvailable && isMine)}
                disabled={!isAvailable && !isMine}
              >
                {time}
              </SlotButton>
            )
          })}
        </DayCell>
      )

      day = addDays(day, 1)
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

    const baseDate = parse(selectedSlot.key, 'yyyy-MM-dd h:mm a', new Date())

    const bookingsToInsert = []

    for (let i = 0; i < (recurring ? 12 : 1); i++) {
      const nextDate = addWeeks(baseDate, i)
      const slotKey = format(nextDate, 'yyyy-MM-dd h:mm a')

      // Only book if it's truly available
      const slot = bookedSlots[slotKey]
      const isAvailable = slot && slot.status === 'available'

      if (!isAvailable) {
        console.warn(`Skipping unavailable slot: ${slotKey}`)
        continue
      }

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
            original_booking_time: b.booking_time,
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

    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .match({ user_id: user.id, booking_time: originalBookingTime })
      .select()

    if (error) {
      console.error('Error cancelling booking:', error.message)
      alert(`Failed to cancel booking: ${error.message}`)
    } else if (!data || data.length === 0) {
      alert('Booking not found or already cancelled')
    } else {
      const updated = { ...bookedSlots }
      delete updated[selectedSlot.key]
      setBookedSlots(updated)
    }

    closeModal()
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
          <MonthNavButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Prev</MonthNavButton>
          <MonthTitle>{format(currentMonth, 'MMMM yyyy')}</MonthTitle>
          <MonthNavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</MonthNavButton>
        </CalendarHeader>
        <MonthGrid>
          {weekdays.map(day => <DayLabel key={day}>{day}</DayLabel>)}
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
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => handleUnbookConfirm()}
        sessionTime={sessionToCancel?.key || ''}
        isRecurring={sessionToCancel?.isRecurring || false}
      />
    </ScheduleSectionWrapper>
  )
}

export default Schedule
