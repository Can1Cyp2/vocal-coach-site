import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ModalWrapper = styled.div`
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ModalHeader = styled.div`
  text-align: center;

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.subheading};
    color: ${({ theme }) => theme.colours.text};
    margin: 0;
  }
`

export const ModalBody = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem 0;
`

export const LessonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colours.surface};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`

export const CancelButton = styled.button`
  background: ${({ theme }) => theme.colours.primary};
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colours.secondary};
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`

export const CloseButton = styled(CancelButton)`
  background: gray;

  &:hover {
    background: ${({ theme }) => theme.colours.muted};
  }
`
