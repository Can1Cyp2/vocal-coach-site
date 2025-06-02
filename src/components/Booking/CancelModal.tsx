// src/components/Booking/CancelModal.tsx
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
  CancelCheckbox,
  CheckboxLabel,
} from '../../styles/Booking/CancelModal'

interface CancelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (cancelAll: boolean) => void
  sessionTime: string
  isRecurring: boolean
}

const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sessionTime,
  isRecurring,
}) => {
  const [cancelAll, setCancelAll] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(cancelAll)
    setCancelAll(false) // Reset for next time
  }

  const handleClose = () => {
    setCancelAll(false) // Reset when closing
    onClose()
  }

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <ModalHeader>Cancel Session</ModalHeader>
          <ModalBody>
            <ModalText>
              Are you sure you want to cancel your session on{' '}
              <strong>{sessionTime}</strong>?
            </ModalText>
            {isRecurring && (
              <CheckboxLabel>
                <CancelCheckbox
                  type="checkbox"
                  checked={cancelAll}
                  onChange={(e) => setCancelAll(e.target.checked)}
                />
                Cancel all future recurring sessions
              </CheckboxLabel>
            )}
          </ModalBody>
          <ModalFooter>
            <CancelButton $secondary onClick={handleClose}>
              Keep Session
            </CancelButton>
            <CancelButton onClick={handleConfirm}>
              {isRecurring && cancelAll ? 'Cancel All' : 'Cancel Session'}
            </CancelButton>
          </ModalFooter>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  )
}

export default CancelModal