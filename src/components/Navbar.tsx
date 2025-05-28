// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colours.primary};
  padding: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 1rem;
`;

const NavItem = styled.li``;

const Navbar = () => {
  return (
    <Nav>
      <NavList>
        <NavItem><Link to="/">Home</Link></NavItem>
        <NavItem><Link to="/contact">Contact</Link></NavItem>
        <NavItem><Link to="/booking">Book</Link></NavItem>
        <NavItem><Link to="/login">Login</Link></NavItem>
        <NavItem><Link to="/signup">Sign Up</Link></NavItem>
      </NavList>
    </Nav>
  );
};

export default Navbar;
