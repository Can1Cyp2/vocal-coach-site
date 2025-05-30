import React, { useState } from 'react'
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

const Schedule = () => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: { recurring: boolean } }>({})
  const [selectedSlot, setSelectedSlot] = useState<{ key: string; label: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [unbooking, setUnbooking] = useState(false)

  const renderMonth = (month: Date) => {
    const days = []
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 }) // Sunday start
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) // Sunday end

    let day = start
    while (day <= end) {
      const dateKey = format(day, 'yyyy-MM-dd')
      const isCurrent = isSameMonth(day, month)

      days.push(
        <DayCell
          key={dateKey}
          isToday={isToday(day)}
          isCurrentMonth={isCurrent}
        >
          <span>{format(day, 'd')}</span>
          {isCurrent &&
            times.map(time => {
              const slotKey = `${dateKey} ${time}`
              const isSlotBooked = !!bookedSlots[slotKey]
              return (
                <SlotButton
                  key={slotKey}
                  booked={isSlotBooked}
                  onClick={() => handleSlotClick(day, time, isSlotBooked)}
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

  const handleSlotClick = (day: Date, time: string, isBooked: boolean) => {
    const key = `${format(day, 'yyyy-MM-dd')} ${time}`
    const label = `${format(day, 'PPP')} at ${time}`

    setSelectedSlot({ key, label })
    setUnbooking(isBooked)
    setModalOpen(true)
  }

  const handleModalConfirm = (recurring: boolean) => {
    if (selectedSlot) {
      setBookedSlots(prev => ({
        ...prev,
        [selectedSlot.key]: { recurring },
        ...(recurring ? generateRecurringCopies(selectedSlot.key) : {}),
      }))
    }
    closeModal()
  }

  const handleUnbookConfirm = () => {
    if (!selectedSlot) return

    const updated = { ...bookedSlots }
    const isRecurring = bookedSlots[selectedSlot.key]?.recurring

    delete updated[selectedSlot.key]

    if (isRecurring) {
      for (let i = 1; i <= 3; i++) {
        const baseDate = new Date(selectedSlot.key.split(' ')[0])
        const time = selectedSlot.key.split(' ').slice(1).join(' ')
        const futureDate = addDays(baseDate, i * 7)
        const recurringKey = `${format(futureDate, 'yyyy-MM-dd')} ${time}`
        delete updated[recurringKey]
      }
    }

    setBookedSlots(updated)
    closeModal()
  }

  const generateRecurringCopies = (baseKey: string): {
    [key: string]: { recurring: boolean }
  } => {
    const [datePart, ...timeParts] = baseKey.split(' ')
    const baseDate = new Date(datePart)
    const time = timeParts.join(' ')
    const recurring: { [key: string]: { recurring: boolean } } = {}

    for (let i = 1; i <= 3; i++) {
      const futureDate = addDays(baseDate, i * 7)
      const recurringKey = `${format(futureDate, 'yyyy-MM-dd')} ${time}`
      recurring[recurringKey] = { recurring: true }
    }

    return recurring
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
