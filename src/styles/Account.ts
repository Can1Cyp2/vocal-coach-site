import styled from 'styled-components'

export const AccountWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem 1rem;
  background-color: ${({ theme }) => theme.colours.surface};
  min-height: 80vh;
`

export const AccountBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  width: 100%;
`

export const AccountTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colours.text};
`

export const AccountRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colours.divider};
`

export const AccountLabel = styled.span`
  color: ${({ theme }) => theme.colours.muted};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

export const AccountValue = styled.span`
  color: ${({ theme }) => theme.colours.text};
`
export const ResetButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  background-color: ${({ theme }) => theme.colours.primary};
  color: ${({ theme }) => theme.colours.white};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colours.secondary};
  }
`

export const SuccessMessage = styled.p`
  margin-top: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.accent};
`
