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
} from 'date-fns'

import BookingModal from './BookingModal'
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
}

const Schedule = () => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: BookedSlotInfo }>({})
  const [selectedSlot, setSelectedSlot] = useState<{ key: string; label: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [unbooking, setUnbooking] = useState(false)
  const { user } = useAuth()

  // Fetch bookings on load:
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time, user_id, status')
        .eq('status', 'booked')

      if (error) {
        console.error('Error fetching bookings:', error.message)
        return
      }

      const slots: { [key: string]: BookedSlotInfo } = {}

      if (data) {
        for (const booking of data) {
          const key = booking.booking_time
          slots[key] = {
            user_id: booking.user_id,
            status: booking.status,
          }
        }
      }

      setBookedSlots(slots)
    }

    fetchBookings()
  }, [user])

  const renderMonth = (month: Date) => {
    const days = []
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })

    let day = start
    while (day <= end) {
      const dateKey = format(day, 'yyyy-MM-dd')
      const isCurrent = isSameMonth(day, month)
      const currentDay = new Date(day);

      days.push(
        <DayCell key={dateKey} $isToday={isToday(currentDay)} $isCurrentMonth={isCurrent}>
          <span>{format(currentDay, 'd')}</span>
          {isCurrent &&
            times.map(time => {
              const slotKey = `${dateKey} ${time}`
              const booking = bookedSlots[slotKey]
              const isBooked = !!booking
              const isMine = booking?.user_id === user?.id

              return (
                <SlotButton
                  key={slotKey}
                  $booked={isBooked}
                  $own={isMine}
                  onClick={() => handleSlotClick(currentDay, time, isBooked && isMine)}
                  disabled={isBooked && !isMine}
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
    console.log('Clicked date:', day.toISOString()); // log actual date
    const key = `${format(day, 'yyyy-MM-dd')} ${time}`
    const label = `${format(day, 'PPP')} at ${time}`

    setSelectedSlot({ key, label })
    setUnbooking(canUnbook)
    setModalOpen(true)
  }

  const handleModalConfirm = async () => {
    if (!selectedSlot || !user) return

    const bookingKey = selectedSlot.key

    const { error } = await supabase.from('bookings').insert([
      {
        user_id: user.id,
        booking_time: selectedSlot.key,
        duration_minutes: 60,
        status: 'booked',
        coach_id: null,
      },
    ])

    if (error) {
      console.error('Error booking session:', error.message)
    } else {
      setBookedSlots(prev => ({
        ...prev,
        [bookingKey]: {
          user_id: user.id,
          status: 'booked',
        },
      }))
    }

    closeModal()
  }

  const handleUnbookConfirm = async () => {
    if (!selectedSlot || !user) return

    const { error } = await supabase
      .from('bookings')
      .delete()
      .match({
        user_id: user.id,
        booking_time: selectedSlot.key,
      })

    if (error) {
      console.error('Error cancelling booking:', error.message)
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
    </ScheduleSectionWrapper>
  )
}

export default Schedule
