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

// Import the fixed session utils
import { getSessionsForSchedule, normalizeDateTime } from '../../util/sessionUtils'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface BookedSlotInfo {
  user_id: string
  status: string
  recurring_booking?: boolean
  original_booking_time?: string
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

  // Function to refresh sessions data
  const refreshSessions = async () => {
    if (!user) return
    
    try {
      const { bookedSlots: slots, availableSlotKeys: keys } = await getSessionsForSchedule(user.id, 12)
      setBookedSlots(slots)
      setAvailableSlotKeys(keys)
    } catch (error) {
      console.error('Error refreshing sessions:', error)
    }
  }

  useEffect(() => {
    refreshSessions()
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

      // Find all slots for this specific day and sort by time
      const matchingSlots = availableSlotKeys
        .filter(key => key.startsWith(dateKey))
        .sort((a, b) => {
          // Extract time from each slot key and compare
          const timeA = a.split(' ').slice(1).join(' ') // Get "h:mm a" part
          const timeB = b.split(' ').slice(1).join(' ') // Get "h:mm a" part
          
          // Parse times to compare
          const dateA = parse(`${dateKey} ${timeA}`, 'yyyy-MM-dd h:mm a', new Date())
          const dateB = parse(`${dateKey} ${timeB}`, 'yyyy-MM-dd h:mm a', new Date())
          
          return dateA.getTime() - dateB.getTime()
        })

      days.push(
        <DayCell key={dateKey} $isToday={isToday(currentDay)} $isCurrentMonth={isCurrent}>
          <span>{format(currentDay, 'd')}</span>
          {matchingSlots.map((slotKey, idx) => {
            const booking = bookedSlots[slotKey]
            if (!booking) return null

            // Extract time from slot key more safely
            const timeParts = slotKey.split(' ')
            const time = timeParts.length >= 3 ? `${timeParts[1]} ${timeParts[2]}` : format(new Date(slotKey), 'h:mm a')
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
      alert(`Failed to book session: ${error.message}`)
    } else {
      // Update local state immediately AND refresh from server
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
      
      // Also refresh from server to ensure consistency
      await refreshSessions()
    }

    closeModal()
  }

  const handleUnbookConfirm = async () => {
    if (!selectedSlot || !user) return

    const booking = bookedSlots[selectedSlot.key]
    const originalBookingTime = booking?.original_booking_time || selectedSlot.key

    // Use normalizeDateTime to ensure consistent format matching
    const normalizedBookingTime = normalizeDateTime(originalBookingTime)

    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .match({ user_id: user.id, booking_time: normalizedBookingTime })
      .select()

    if (error) {
      console.error('Error cancelling booking:', error.message)
      alert(`Failed to cancel booking: ${error.message}`)
    } else if (!data || data.length === 0) {
      alert('Booking not found or already cancelled')
    } else {
      // Update local state immediately AND refresh from server
      const updated = { ...bookedSlots }
      updated[selectedSlot.key] = {
        ...updated[selectedSlot.key],
        status: 'available',
        user_id: '',
      }
      setBookedSlots(updated)
      
      // Also refresh from server to ensure consistency
      await refreshSessions()
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