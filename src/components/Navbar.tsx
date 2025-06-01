import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import { User as UserIcon } from 'lucide-react'

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
  AccountButton,
} from '../styles/Navbar'

const Navbar = () => {
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <NavWrapper>
      <NavContainer>
        <Link to="/">
          <NavLogo>VocalCoach</NavLogo>
        </Link>

        <NavLeft>
          <NavList>
            <NavItem>
              <Link to="/">
                <NavLink>Home</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/contact">
                <NavLink>Contact</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/booking">
                <NavLink>Book</NavLink>
              </Link>
            </NavItem>
          </NavList>
        </NavLeft>

        <NavRight>
          {user ? (
            <>
              <Link to="/account" style={{ textDecoration: 'none' }}>
                <AccountButton>
                  <UserIcon size={20} strokeWidth={1.8} />
                  <span>Account</span>
                </AccountButton>
              </Link>
              <NavButton $variant="outline" onClick={handleLogout}>
                Logout
              </NavButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <NavButton $variant="outline">Login</NavButton>
              </Link>
              <Link to="/signup">
                <NavButton $variant="solid">Sign Up</NavButton>
              </Link>
            </>
          )}
        </NavRight>
      </NavContainer>
    </NavWrapper>
  )
}

export default Navbar
