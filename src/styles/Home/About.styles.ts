// src/styles/Home/About.styles.ts
import styled from 'styled-components'

export const AboutSectionWrapper = styled.section`
  background-color: ${({ theme }) => theme.colours.background};
  padding: ${({ theme }) => theme.spacing.section} 0;
`

export const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
`

export const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

export const SectionHeading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 0.5rem;
`

export const SectionDivider = styled.div`
  width: 6rem;
  height: 0.25rem;
  background-color: ${({ theme }) => theme.colours.primary};
  margin: 0 auto;
  border-radius: 9999px;
`

export const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
`

export const AboutImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

export const AboutImage = styled.img`
  border-radius: 0.75rem;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  height: auto;
`

export const AboutText = styled.div`
  flex: 1.5;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 2.5rem;
  }
`

export const CoachName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 1rem;
`

export const CoachDescription = styled.p`
  color: ${({ theme }) => theme.colours.subtext};
  margin-bottom: 1.75rem;
  line-height: 1.7;
`

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`

export const TeachingPhilosophy = styled.p`
  color: ${({ theme }) => theme.colours.subtext};
  line-height: 1.7;
`

export const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colours.surface};
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`

export const FeatureIcon = styled.div`
  svg {
    width: 2.25rem;
    height: 2.25rem;
    color: ${({ theme }) => theme.colours.primary};
    margin-bottom: 0.75rem;
  }
`

export const FeatureTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colours.text};
`

export const FeatureText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.subtext};
  margin-top: 0.25rem;
`
