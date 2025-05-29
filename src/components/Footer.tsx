import React from 'react'
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
              <li><FooterLink href="#">Home</FooterLink></li>
              <li><FooterLink href="#about">About</FooterLink></li>
              <li><FooterLink href="#services">Services</FooterLink></li>
              <li><FooterLink href="#contact">Contact</FooterLink></li>
            </FooterList>
          </FooterColumn>

          <FooterColumn>
            <FooterSubtitle>Services</FooterSubtitle>
            <FooterList>
              <li><FooterLink href="#">Vocal Technique</FooterLink></li>
              <li><FooterLink href="#">Range Improvement</FooterLink></li>
              <li><FooterLink href="#">Audition Prep</FooterLink></li>
              <li><FooterLink href="#">Performance Coaching</FooterLink></li>
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
