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
  max-width: 800px;
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
