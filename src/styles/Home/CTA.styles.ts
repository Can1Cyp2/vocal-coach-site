import styled from "styled-components";

export const CTASectionWrapper = styled.section`
  background-color: ${({ theme }) => theme.colours.primary};
  color: ${({ theme }) => theme.colours.white};
  padding: ${({ theme }) => theme.spacing.section} 0;
  text-align: center;
`;

export const CTAContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
`;

export const CTAHeading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: 1.25rem;
`;

export const CTASubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  max-width: 700px;
  margin: 0 auto 2rem auto;
  opacity: 0.95;
  line-height: 1.6;
`;

export const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
  }
`;

export const CTAButton = styled.a<{ $variant: "primary" | "secondary" }>`
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background-color: ${theme.colours.white};
    color: ${theme.colours.primary};

    &:hover {
      background-color: ${theme.colours.surface};
      transform: scale(1.02);
    }
  `
      : `
    border: 2px solid ${theme.colours.white};
    color: ${theme.colours.white};

    &:hover {
      background-color: ${theme.colours.secondary};
      transform: scale(1.02);
    }
  `}
`;

export const CTAContact = styled.div`
  margin-top: 2.5rem;
`;

export const CTAContactLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const CTAContactInfo = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  opacity: 0.9;
  margin-top: 0.25rem;
`;
