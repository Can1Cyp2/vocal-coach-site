import React from 'react'
import { Link } from 'react-router-dom'
import {
  NavWrapper,
  NavContainer,
  NavLogo,
  NavLeft,
  NavRight,
  NavList,
  NavItem,
  NavLink,
  NavButton,
} from '../styles/Navbar'

const Navbar = () => {
  return (
    <NavWrapper>
      <NavContainer>
        <NavLogo>VocalCoach</NavLogo>

        <NavLeft>
          <NavList>
            <NavItem>
              <Link to="/">
                <NavLink as="span">Home</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/contact">
                <NavLink as="span">Contact</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/booking">
                <NavLink as="span">Book</NavLink>
              </Link>
            </NavItem>
          </NavList>
        </NavLeft>

        <NavRight>
          <Link to="/login">
            <NavButton $variant="outline">Login</NavButton>
          </Link>
          <Link to="/signup">
            <NavButton $variant="solid">Sign Up</NavButton>
          </Link>
        </NavRight>
      </NavContainer>
    </NavWrapper>
  )
}

export default Navbar
