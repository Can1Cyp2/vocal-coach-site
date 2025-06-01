import styled from 'styled-components'

export const ScheduleSectionWrapper = styled.section`
  background-color: ${({ theme }) => theme.colours.background};
  padding: ${({ theme }) => theme.spacing.section} 0;
`

export const ScheduleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
  text-align: center;

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colours.text};
    margin-bottom: 2rem;
  }
`

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

export const MonthTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colours.text};
`

export const MonthNavButton = styled.button`
  background-color: ${({ theme }) => theme.colours.primary};
  color: ${({ theme }) => theme.colours.white};
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colours.secondary};
  }
`

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
`

export const DayLabel = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.subtext};
  text-align: center;
`

// ✅ Use $ prefix for transient props
export const DayCell = styled.div<{
  $isToday?: boolean
  $isCurrentMonth?: boolean
}>`
  background-color: ${({ $isToday, theme }) =>
    $isToday ? theme.colours.accent : theme.colours.surface};
  color: ${({ $isCurrentMonth, theme }) =>
    $isCurrentMonth ? theme.colours.text : theme.colours.subtext};
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colours.primary};
    color: white;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    display: block;
    margin-bottom: 0.25rem;
  }

  small {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colours.subtext};
  }
`

export const SlotButton = styled.button<{
  $booked?: boolean
  $own?: boolean
}>`
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background-color: ${({ $booked, theme }) =>
    $booked ? theme.colours.subtext : theme.colours.primary};
  color: ${({ $booked, theme }) =>
    $booked ? theme.colours.text : theme.colours.white};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ $booked, theme }) =>
      $booked ? theme.colours.subtext : theme.colours.secondary};
  }
`
