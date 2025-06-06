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
  Spinner,
} from '../../styles/Booking/CancelModal'

interface AdminCancelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (message: string) => Promise<void> // must return a Promise
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
  const [isLoading, setIsLoading] = useState(false)




  const handleConfirm = async () => {
    if (!message.trim()) {
      alert('Please provide a cancellation reason.')
      return
    }

    setIsLoading(true)
    try {
      await onConfirm(message.trim())
      setMessage('')
    } catch (err) {
      alert('Something went wrong while sending the cancellation.')
    } finally {
      setIsLoading(false)
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
            <CancelButton onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner /> Sending...
                </>
              ) : (
                'Send & Cancel'
              )}
            </CancelButton>
          </ModalFooter>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  )
}

export default AdminCancelModal
