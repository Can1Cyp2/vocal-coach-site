import styled from 'styled-components'

export const ContactSection = styled.section`
  padding: ${({ theme }) => theme.spacing.section} 0;
  background-color: ${({ theme }) => theme.colours.background};
`

export const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.container};
`

export const ContactHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  color: ${({ theme }) => theme.colours.text};
  margin-bottom: 2.5rem;
`

export const CoachInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const CoachTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colours.text};
`

export const ContactDetails = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.subtext};
  line-height: 1.6;
`

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
  }
`

export const FormInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colours.muted};
  border-radius: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colours.primary};
  }
`

export const FormTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colours.muted};
  border-radius: 0.375rem;
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colours.primary};
  }
`

export const FormButton = styled.button`
  background-color: ${({ theme }) => theme.colours.primary};
  color: ${({ theme }) => theme.colours.white};
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.body};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colours.accent};
  }
`

export const StatusMessage = styled.p<{ success?: boolean }>`
  color: ${({ success, theme }) =>
    success ? theme.colours.primary : theme.colours.accent};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-top: 1rem;
  text-align: center;
`
