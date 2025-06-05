// src/components/Booking/Calendar.tsx
import React, { JSX, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  addDays,
} from 'date-fns'
import { supabase } from '../../util/supabaseClient'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CalendarWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const NavButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
`

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`

const DayLabel = styled.div`
  font-weight: bold;
  text-align: center;
`

const DayCell = styled.div<{ isToday?: boolean; isCurrentMonth?: boolean }>`
  background-color: ${({ isToday }) => (isToday ? '#def' : '#fff')};
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.4)};
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #eef;
  }
`

const TimeSlot = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  background-color: #eef;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #dde;
  }
`

const Calendar: React.FC = () => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))
  const [availableSessions, setAvailableSessions] = useState<Record<string, string[]>>({})

  useEffect(() => {
  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('available_sessions')
      .select('session_time, is_booked')

    if (error) {
      console.error('Supabase error:', error)
    } else {
      console.log('Fetched sessions:', data)
    }
  }

  fetchSessions()
}, [])


  // useEffect(() => {
  //   const fetchSessions = async () => {
  //     const { data, error } = await supabase
  //       .from('available_sessions')
  //       .select('session_time, is_booked')

  //     if (error) {
  //       console.error('Error fetching sessions:', error)
  //       return
  //     }

  //     const sessionsByDay: Record<string, string[]> = {}

  //     for (const session of data || []) {
  //       console.log('Fetched available sessions:', data)

  //       if (session.is_booked) continue // Skip booked sessions

  //       const date = new Date(session.session_time)
  //       const dateKey = format(date, 'yyyy-MM-dd')
  //       const timeStr = format(date, 'h:mm a')

  //       if (!sessionsByDay[dateKey]) sessionsByDay[dateKey] = []
  //       sessionsByDay[dateKey].push(timeStr)
  //     }

  //     setAvailableSessions(sessionsByDay)
  //   }

  //   fetchSessions()
  // }, [])

  const renderDays = (month: Date) => {
    const startDate = startOfWeek(startOfMonth(month))
    const endDate = endOfWeek(endOfMonth(month))
    const cells: JSX.Element[] = []

    let day = startDate
    while (day <= endDate) {
      const dateKey = format(day, 'yyyy-MM-dd')
      const slots = availableSessions[dateKey] || []

      cells.push(
        <DayCell
          key={dateKey}
          isToday={isToday(day)}
          isCurrentMonth={isSameMonth(day, month)}
        >
          <div>{format(day, 'd')}</div>
          {slots.map((time, idx) => (
            <TimeSlot key={idx} onClick={() => handleBooking(dateKey, time)}>
              {time}
            </TimeSlot>
          ))}
        </DayCell>
      )

      day = addDays(day, 1)
    }

    return cells
  }

  const handleBooking = (date: string, time: string) => {
    const sessionTime = `${date} ${time}`
    alert(`Book session at ${sessionTime}`) // Replace with modal logic
  }

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <NavButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          Previous
        </NavButton>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <NavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Next
        </NavButton>
      </CalendarHeader>
      <MonthGrid>
        {weekdays.map(day => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}
        {renderDays(currentMonth)}
      </MonthGrid>
    </CalendarWrapper>
  )
}

export default Calendar