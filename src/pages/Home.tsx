import React from 'react'
import { AboutSection } from '../components/Home/AboutSection'
import { ServicesSection } from '../components/Home/ServicesSection'
import { CTASection } from '../components/Home/CTASection'
import { Footer } from '../components/Footer'

import {
  HeroSectionWrapper,
  HeroContainer,
  HeroContent,
  HeroText,
  HeroHeading,
  HeroSubtext,
  HeroButtons,
  HeroButton,
  HeroImageWrapper,
  HeroImageGradient,
  HeroImage,
} from '../styles/Home/Hero.styles'

const Home = () => {
  const isLoggedIn = false // Replace with context logic later

  return (
    <>
      <HeroSectionWrapper>
        <HeroContainer>
          <HeroContent>
            <HeroText>
              <HeroHeading>
                Find Your Voice, <span>Reach Your Potential</span>
              </HeroHeading>
              <HeroSubtext>
                Professional vocal training tailored to your unique voice and goals.
                Whether you're a beginner or advanced singer, I'll help you discover your true vocal abilities.
              </HeroSubtext>
              <HeroButtons>
                <HeroButton href="#contact" $variant="primary">Schedule a Consultation</HeroButton>
                <HeroButton href="#services" $variant="secondary">Explore Services</HeroButton>
              </HeroButtons>
            </HeroText>
            <HeroImageWrapper>
              <HeroImageGradient />
              <HeroImage
                src="https://cdn.stocksnap.io/img-thumbs/960w/microphone-music_8DG6GF0NSI.jpg"
                alt="Vocal coach studio microphone"
              />
            </HeroImageWrapper>
          </HeroContent>
        </HeroContainer>
      </HeroSectionWrapper>

      {/* Page Sections */}
      <AboutSection />
      <ServicesSection />
      <CTASection isLoggedIn={isLoggedIn} />
      <Footer />
    </>
  )
}

export default Home
