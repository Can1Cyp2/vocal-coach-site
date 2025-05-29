import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  MailIcon,
} from 'lucide-react'

import {
  FooterWrapper,
  FooterContainer,
  FooterGrid,
  FooterBrand,
  FooterTitle,
  FooterDescription,
  FooterColumn,
  FooterSubtitle,
  FooterList,
  FooterLink,
  FooterContact,
  FooterAddress,
  FooterPhone,
  FooterSocialIcons,
  SocialIcon,
  FooterBottom,
} from '../styles/Footer'

export const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigateToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId)
      section?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterGrid>
          <FooterBrand>
            <FooterTitle>VocalCoach</FooterTitle>
            <FooterDescription>
              Professional vocal training to help you discover your true voice and reach your full potential.
            </FooterDescription>
          </FooterBrand>

          <FooterColumn>
            <FooterSubtitle>Quick Links</FooterSubtitle>
            <FooterList>
              <li><FooterLink onClick={() => navigate('/')}>Home</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigateToSection('about')}>About</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigateToSection('services')}>Services</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigateToSection('contact')}>Contact</FooterLink></li>
            </FooterList>
          </FooterColumn>

          <FooterColumn>
            <FooterSubtitle>Services</FooterSubtitle>
            <FooterList>
              <li><FooterLink onClick={() => handleNavigateToSection('services')}>Vocal Technique</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigateToSection('services')}>Range Improvement</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigateToSection('services')}>Audition Prep</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigateToSection('services')}>Performance Coaching</FooterLink></li>
            </FooterList>
          </FooterColumn>

          <FooterContact>
            <FooterSubtitle>Contact Info</FooterSubtitle>
            <FooterAddress>
              <p>123 Music Street</p>
              <p>Harmony City, HC 12345</p>
              <FooterPhone>(555) 123-4567</FooterPhone>
              <p>contact@vocalcoach.com</p>
            </FooterAddress>
            <FooterSocialIcons>
              <SocialIcon href="#"><FacebookIcon /></SocialIcon>
              <SocialIcon href="#"><InstagramIcon /></SocialIcon>
              <SocialIcon href="#"><YoutubeIcon /></SocialIcon>
              <SocialIcon href="#"><MailIcon /></SocialIcon>
            </FooterSocialIcons>
          </FooterContact>
        </FooterGrid>
        <FooterBottom>
          <p>&copy; {new Date().getFullYear()} VocalCoach. All rights reserved.</p>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  )
}
