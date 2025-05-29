import React from 'react'
import { Link } from 'react-router-dom'
import {
  NavWrapper,
  NavContainer,
  NavLogo,
  NavList,
  NavItem,
  NavLink,
} from '../styles/Navbar'

const Navbar = () => {
  return (
    <NavWrapper>
      <NavContainer>
        <NavLogo>VocalCoach</NavLogo>
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
          <NavItem>
            <Link to="/login">
              <NavLink as="span">Login</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/signup">
              <NavLink as="span">Sign Up</NavLink>
            </Link>
          </NavItem>
        </NavList>
      </NavContainer>
    </NavWrapper>
  )
}

export default Navbar
