// src/styles/Booking/CancelModal.ts
import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ModalWrapper = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

export const ModalContent = styled.div`
  padding: 2rem;
`

export const ModalHeader = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`

export const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`

export const ModalText = styled.p`
  font-size: 1rem;
  color: #333;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`

export const CancelButton = styled.button<{ $secondary?: boolean }>`
  background-color: ${({ $secondary }) => ($secondary ? '#ccc' : '#d9534f')};
  color: ${({ $secondary }) => ($secondary ? '#333' : '#fff')};
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`

export const CancelCheckbox = styled.input`
  margin-right: 0.5rem;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-top: 1rem;
`