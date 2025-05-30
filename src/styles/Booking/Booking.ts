import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const BookingWrapper = styled.section`
  background-color: ${({ theme }) => theme.colours.background};
  padding: ${({ theme }) => theme.spacing.section} 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing.container};
  padding-right: ${({ theme }) => theme.spacing.container};
  text-align: center;
`

export const ToggleButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`

export const BookingHeader = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 1rem;
`

export const BookingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.subtext};
  max-width: 700px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
`

export const AuthActions = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`

export const AuthButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colours.primary};
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colours.secondary};
  }
`
