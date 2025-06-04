// src/components/Booking/AdminCancelModal.tsx
import React, { useState } from 'react'
import {
  ModalOverlay,
  ModalWrapper,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalText,
  ModalFooter,
  CancelButton,
  MessageInput,
  CancelFormLabel,
} from '../../styles/Booking/CancelModal'

interface AdminCancelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (message: string) => void
  bookingTime: string
  userEmail: string
}

const AdminCancelModal: React.FC<AdminCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingTime,
  userEmail,
}) => {
  const [message, setMessage] = useState('')

  const handleConfirm = () => {
    if (message.trim()) {
      onConfirm(message.trim())
      setMessage('')
    } else {
      alert('Please provide a cancellation reason.')
    }
  }

  const handleClose = () => {
    setMessage('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>Cancel Booking</ModalHeader>
          <ModalBody>
            <ModalText>
              You're about to cancel <strong>{bookingTime}</strong> for{' '}
              <strong>{userEmail}</strong>. Please provide a message explaining why:
            </ModalText>
            <CancelFormLabel htmlFor="cancel-message">Message to user:</CancelFormLabel>
            <MessageInput
              id="cancel-message"
              placeholder="Reason for cancellation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </ModalBody>
          <ModalFooter>
            <CancelButton $secondary onClick={handleClose}>
              Close
            </CancelButton>
            <CancelButton onClick={handleConfirm}>Send & Cancel</CancelButton>
          </ModalFooter>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  )
}

export default AdminCancelModal
