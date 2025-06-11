import { styled } from "styled-components"

export const CalendarWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const NavButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
`

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`

export const DayLabel = styled.div`
  font-weight: bold;
  text-align: center;
`

export const DayCell = styled.div<{ isToday?: boolean; isCurrentMonth?: boolean }>`
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

export const TimeSlot = styled.div`
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