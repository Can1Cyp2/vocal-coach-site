import React, { useState } from 'react'
import {
  ModalOverlay,
  ModalWrapper,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalText,
  ModalButton,
  RecurringToggle,
  RecurringLabel,
} from '../../styles/Booking/BookingModal'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (recurring: boolean) => void
  sessionTime: string
  isUnbooking?: boolean
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sessionTime,
  isUnbooking = false,
}) => {
  const [recurring, setRecurring] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(recurring)
    setRecurring(false)
  }

  const handleClose = () => {
    onClose()
    setRecurring(false)
  }

  return (
    <ModalOverlay>
      <ModalWrapper>
        <ModalContent>
          <ModalHeader>Session {isUnbooking ? 'Cancellation' : 'Booking'}</ModalHeader>
          <ModalBody>
            <ModalText>
              {isUnbooking
                ? `Are you sure you want to cancel the session at ${sessionTime}?`
                : `Are you sure you want to book the session at ${sessionTime}?`}
            </ModalText>

            {!isUnbooking && (
              <RecurringLabel>
                <RecurringToggle
                  type="checkbox"
                  checked={recurring}
                  onChange={() => setRecurring(prev => !prev)}
                />
                Make this a recurring weekly session
              </RecurringLabel>
            )}
          </ModalBody>

          <ModalFooter>
            <ModalButton $variant="secondary" onClick={handleClose}>
              No
            </ModalButton>
            <ModalButton $variant="primary" onClick={handleConfirm}>
              Yes
            </ModalButton>
          </ModalFooter>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  )
}

export default BookingModal
