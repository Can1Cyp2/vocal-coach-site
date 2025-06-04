// src/components/Booking/AdminCancelModal.tsx
import React from 'react'
import {
  ModalOverlay,
  ModalWrapper,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalText,
  ModalFooter,
  CancelButton,
} from '../../styles/Booking/CancelModal'

interface AdminCancelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
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
  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>Cancel Booking</ModalHeader>
          <ModalBody>
            <ModalText>
              Are you sure you want to cancel the session on <strong>{bookingTime}</strong> booked by <strong>{userEmail}</strong>?
            </ModalText>
          </ModalBody>
          <ModalFooter>
            <CancelButton $secondary onClick={onClose}>
              Keep Session
            </CancelButton>
            <CancelButton onClick={onConfirm}>
              Cancel Session
            </CancelButton>
          </ModalFooter>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  )
}

export default AdminCancelModal
