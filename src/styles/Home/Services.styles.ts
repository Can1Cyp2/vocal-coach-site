import styled from 'styled-components'

export const ServicesSectionWrapper = styled.section`
  background-color: ${({ theme }) => theme.colours.surface};
  padding: ${({ theme }) => theme.spacing.section} 0;
`

export const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
`

export const ServicesHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

export const SectionHeading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 0.75rem;
`

export const SectionDivider = styled.div`
  width: 5rem;
  height: 0.25rem;
  background-color: ${({ theme }) => theme.colours.primary};
  margin: 0 auto 1rem auto;
  border-radius: 9999px;
`

export const ServicesDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.subtext};
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.6;
`

export const ServicesGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin-top: 2rem;

  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const ServiceCard = styled.div`
  background-color: ${({ theme }) => theme.colours.white};
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.07);
  }
`

export const ServiceIcon = styled.div`
  margin-bottom: 1rem;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${({ theme }) => theme.colours.primary};
  }
`

export const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 0.5rem;
`

export const ServiceText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.subtext};
  line-height: 1.5;
`
