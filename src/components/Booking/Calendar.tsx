// src/components/Booking/Calendar.tsx
import React, { useState } from 'react'
import styled from 'styled-components'
import {
  addMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  subMonths,
  isToday,
} from 'date-fns'

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

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar: React.FC = () => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today))

  const renderDays = (month: Date) => {
    const startDate = startOfWeek(startOfMonth(month))
    const endDate = endOfWeek(endOfMonth(month))
    const dayMatrix = []
    let day = startDate

    while (day <= endDate) {
      dayMatrix.push(day)
      day = addDays(day, 1)
    }

    return dayMatrix.map((dayItem, idx) => (
      <DayCell
        key={idx}
        isToday={isToday(dayItem)}
        isCurrentMonth={isSameMonth(dayItem, month)}
      >
        {format(dayItem, 'd')}
      </DayCell>
    ))
  }

  const renderSixMonths = () => {
    return Array.from({ length: 6 }).map((_, index) => {
      const month = addMonths(currentMonth, index)
      return (
        <div key={index}>
          <CalendarHeader>
            <h3>{format(month, 'MMMM yyyy')}</h3>
          </CalendarHeader>
          <MonthGrid>
            {weekdays.map(day => (
              <DayLabel key={day}>{day}</DayLabel>
            ))}
            {renderDays(month)}
          </MonthGrid>
          <hr style={{ margin: '2rem 0' }} />
        </div>
      )
    })
  }

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <NavButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          Previous
        </NavButton>
        <h2>Schedule Calendar</h2>
        <NavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Next
        </NavButton>
      </CalendarHeader>
      {renderSixMonths()}
    </CalendarWrapper>
  )
}

export default Calendar
