// src/styles/Footer.ts

import styled from 'styled-components'

export const FooterWrapper = styled.footer`
  background-colour: ${({ theme }) => theme.colours.text};
  colour: ${({ theme }) => theme.colours.white};
  padding: ${({ theme }) => theme.spacing.section} 0;
`

export const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
`

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const FooterBrand = styled.div``

export const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: 1rem;
`

export const FooterDescription = styled.p`
  colour: ${({ theme }) => theme.colours.surface};
`

export const FooterColumn = styled.div``

export const FooterSubtitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 1rem;
`

export const FooterList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const FooterLink = styled.a`
  color: ${({ theme }) => theme.colours.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.small};
  display: inline-block;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colours.accent};
    text-decoration: underline;
  }
`



export const FooterContact = styled.div``

export const FooterAddress = styled.address`
  font-style: normal;
  colour: ${({ theme }) => theme.colours.surface};
  line-height: 1.6;
`

export const FooterPhone = styled.p`
  margin-top: 0.5rem;
`

export const FooterSocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

export const SocialIcon = styled.a`
  colour: ${({ theme }) => theme.colours.surface};
  transition: colour 0.3s ease;

  &:hover {
    colour: ${({ theme }) => theme.colours.white};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

export const FooterBottom = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: centre;
  border-top: 1px solid ${({ theme }) => theme.colours.muted};
  colour: ${({ theme }) => theme.colours.muted};
`
