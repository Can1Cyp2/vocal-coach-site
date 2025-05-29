import styled from 'styled-components'

export const NavWrapper = styled.nav`
  background-colour: ${({ theme }) => theme.colours.primary};
  padding: 1rem 0;
`

export const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
  display: flex;
  justify-content: space-between;
  align-items: centre;
`

export const NavLogo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  colour: ${({ theme }) => theme.colours.white};
`

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1.5rem;
`

export const NavItem = styled.li``

export const NavLink = styled.a`
  colour: ${({ theme }) => theme.colours.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: colour 0.3s ease;

  &:hover {
    colour: ${({ theme }) => theme.colours.accent};
  }
`
