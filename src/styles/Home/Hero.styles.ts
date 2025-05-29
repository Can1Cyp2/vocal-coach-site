// src/styles/Home/Hero.styles.ts
import styled from "styled-components";

export const HeroSectionWrapper = styled.section`
  background: linear-gradient(to right, #eef2ff, #f5f3ff);
  padding: ${({ theme }) => theme.spacing.section} 0;
`;

export const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const HeroText = styled.div`
  flex: 1;
  max-width: 600px;
`;

export const HeroHeading = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colours.text};
  line-height: 1.2;
  margin-bottom: 1rem;

  span {
    color: ${({ theme }) => theme.colours.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

export const HeroSubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.subtext};
  max-width: 32rem;
  margin-bottom: 2rem;
  line-height: 1.7;
`;

export const HeroButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
  }
`;

export const HeroButton = styled.a<{ $variant: "primary" | "secondary" }>`
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-block;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background-color: ${theme.colours.primary};
    color: ${theme.colours.white};

    &:hover {
      background-color: #4338ca;
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `
      : `
    border: 2px solid ${theme.colours.primary};
    color: ${theme.colours.primary};

    &:hover {
      background-color: ${theme.colours.surface};
      transform: scale(1.02);
    }
  `}
`;

export const HeroImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
`;

export const HeroImageGradient = styled.div`
  position: absolute;
  inset: -0.25rem;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colours.primary},
    ${({ theme }) => theme.colours.accent}
  );
  opacity: 0.75;
  filter: blur(8px);
`;

export const HeroImage = styled.img`
  position: relative;
  border-radius: 9999px;
  width: 16rem;
  height: 16rem;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colours.white};
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 20rem;
    height: 20rem;
  }
`;
