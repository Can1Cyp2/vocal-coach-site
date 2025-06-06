import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalWrapper = styled.div`
  background-color: ${({ theme }) => theme.colours.white};
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  padding: 2rem;
  z-index: 1001;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const ModalHeader = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colours.text};
  text-align: center;
`

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`

export const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colours.subtext};
  line-height: 1.6;
`

export const RecurringLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colours.text};
  user-select: none;
  cursor: pointer;
  border: 1px solid red;
`

export const RecurringToggle = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
`

export const ModalButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.65rem 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.body};
  transition: all 0.2s ease-in-out;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colours.primary};
    color: ${theme.colours.white};

    &:hover {
      background-color: ${theme.colours.secondary};
    }
  `
      : `
    background-color: ${theme.colours.surface};
    color: ${theme.colours.text};

    &:hover {
      background-color: ${theme.colours.accent};
    }
  `}
`
