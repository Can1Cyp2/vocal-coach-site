// src/styles/AdminDashboard.ts
import styled from 'styled-components'

export const AdminWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem 1rem;
  background-color: ${({ theme }) => theme.colours.surface};
  min-height: 80vh;
`

export const AdminBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  max-width: 1100px;
  width: 100%;
`

export const AdminTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 1rem;
`

export const AdminSubtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  color: ${({ theme }) => theme.colours.muted};
  margin-bottom: 2rem;
`

export const AdminDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colours.divider};
  margin: 2rem 0;
`

export const AdminText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.text};
`

export const UserWheel = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem 0;
  margin-top: 1rem;
  scroll-snap-type: x mandatory;
  border-bottom: 1px solid ${({ theme }) => theme.colours.divider};

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colours.primary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

export const UserCard = styled.div<{ $selected?: boolean }>`
  min-width: 200px;
  padding: 1rem;
  background: ${({ $selected, theme }) => $selected ? theme.colours.accent : 'white'};
  color: ${({ $selected, theme }) => $selected ? 'white' : theme.colours.text};
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  scroll-snap-align: start;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colours.primary};
    color: white;
  }
`

export const SelectedUserBox = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colours.surface};
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`

export const AdminActionButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colours.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;

  &:hover:enabled {
    background-color: ${({ theme }) => theme.colours.secondary};
  }

  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`

// Calendar Styles Below
export const CalendarSection = styled.section`
  margin-top: 3rem;
`

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

export const DayCell = styled.div<{ $isToday?: boolean; $isCurrentMonth?: boolean }>`
  background-color: ${({ $isToday, theme }) =>
    $isToday ? theme.colours.accent : theme.colours.surface};
  color: ${({ $isCurrentMonth, theme }) =>
    $isCurrentMonth ? theme.colours.text : theme.colours.subtext};
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
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

export const SlotButton = styled.button<{ $booked?: boolean; $own?: boolean }>`
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background-color: ${({ $booked, $own, theme }) =>
    $booked
      ? $own
        ? theme.colours.accent
        : theme.colours.subtext
      : theme.colours.primary};
  color: ${({ $booked, $own, theme }) =>
    $booked
      ? $own
        ? theme.colours.white
        : theme.colours.background
      : theme.colours.white};
  cursor: ${({ $booked }) => ($booked ? 'not-allowed' : 'pointer')};
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ $booked, $own, theme }) =>
      $booked
        ? $own
          ? theme.colours.secondary
          : theme.colours.subtext
        : theme.colours.secondary};
  }
`
