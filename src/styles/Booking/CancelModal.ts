// src/styles/Booking/CancelModal.ts
import styled, { keyframes } from 'styled-components'

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

export const MessageInput = styled.textarea`
  width: 100%;
  height: 100px;
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
`

export const CancelFormLabel = styled.label`
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
`

export const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${spin} 0.6s linear infinite;
`