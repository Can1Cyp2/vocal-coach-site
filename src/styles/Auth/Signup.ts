import styled from 'styled-components'

export const SignupWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: ${({ theme }) => theme.colours.background};
`

export const SignupBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`

export const SignupTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

export const SignupSubtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colours.secondary};
`

export const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
`

export const SignupInput = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
`

export const SignupButton = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colours.primary};
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.primary};
    opacity: 0.85;
  }
`

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`
