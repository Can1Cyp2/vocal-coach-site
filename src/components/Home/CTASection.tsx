import React from 'react'
import {
  CTASectionWrapper,
  CTAContainer,
  CTAHeading,
  CTASubtext,
  CTAButtons,
  CTAButton,
  CTAContact,
  CTAContactLabel,
  CTAContactInfo,
} from '../../styles/Home/CTA.styles'

interface CTASectionProps {
  isLoggedIn: boolean
}

export const CTASection = ({ isLoggedIn }: CTASectionProps) => {
  return (
    <CTASectionWrapper id="contact">
      <CTAContainer>
        <CTAHeading>Ready to Transform Your Voice?</CTAHeading>
        <CTASubtext>
          Take the first step toward reaching your vocal goals with personalized coaching
          tailored to your unique voice and aspirations.
        </CTASubtext>
        <CTAButtons>
          <CTAButton href="#" $variant="primary">
            {isLoggedIn ? 'Book a Session Now' : 'Create an Account to Book'}
          </CTAButton>
          <CTAButton href="#" $variant="secondary">
            Contact for Information
          </CTAButton>

        </CTAButtons>
        <CTAContact>
          <CTAContactLabel>Have questions? Get in touch</CTAContactLabel>
          <CTAContactInfo>contact@vocalcoach.com | (555) 123-4567</CTAContactInfo>
        </CTAContact>
      </CTAContainer>
    </CTASectionWrapper>
  )
}
