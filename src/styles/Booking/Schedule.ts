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

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(5, 1fr);
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 80px repeat(5, 1fr);
    overflow-x: auto;
  }
`

export const DayHeader = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-align: center;
  padding: 0.5rem 0;
  background-color: ${({ theme }) => theme.colours.surface};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colours.text};
`

export const SlotLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.subtext};
`

export const TimeSlot = styled.button<{ booked?: boolean }>`
  padding: 0.75rem;
  background-color: ${({ booked, theme }) =>
    booked ? theme.colours.subtext : theme.colours.primary};
  color: ${({ booked, theme }) =>
    booked ? theme.colours.text : theme.colours.white};
  font-size: ${({ theme }) => theme.fontSizes.small};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ booked, theme }) =>
      booked ? theme.colours.subtext : theme.colours.secondary};
  }
`
