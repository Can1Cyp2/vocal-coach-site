import styled from 'styled-components'

export const NavWrapper = styled.nav`
  background-color: ${({ theme }) => theme.colours.primary};
  padding: 1rem 0;
`

export const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const NavLogo = styled.h1`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colours.white};
`

export const NavLeft = styled.div``

export const NavRight = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 2rem;
`

export const NavItem = styled.li``

export const NavLink = styled.a`
  color: ${({ theme }) => theme.colours.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colours.accent};
  }
`

export const NavButton = styled.a<{ $variant: 'solid' | 'outline' }>`
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: 0.875rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;

  ${({ $variant, theme }) =>
    $variant === 'solid'
      ? `
        background-color: ${theme.colours.white};
        color: ${theme.colours.primary};

        &:hover {
          background-color: ${theme.colours.surface};
        }
      `
      : `
        border: 2px solid ${theme.colours.white};
        color: ${theme.colours.white};
        background-color: transparent;

        &:hover {
          background-color: ${theme.colours.accent};
          color: ${theme.colours.white};
        }
      `}
`

export const UserTag = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.subtext};
  background-color: ${({ theme }) => theme.colours.surface};
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

export const Divider = styled.span`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => theme.colours.divider};
  margin: 0 1rem;
`

export const AccountButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colours.white};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colours.secondary};
  }
`
