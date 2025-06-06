import React, { useState } from 'react'
import AdminCancelModal from './AdminCancelModal'
import {
  ModalOverlay,
  ModalWrapper,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  LessonItem,
  CancelButton,
  CloseButton
} from '../../styles/Booking/UserLessonListModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  bookings: any[]
  selectedUser: { email: string }
  onCancel: (bookingId: string, email: string, bookingTime: string, message: string) => void
}

const UserLessonListModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bookings,
  onCancel,
  selectedUser
}) => {
  const [selected, setSelected] = useState<null | any>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleCancel = async (
    bookingId: string,
    email: string,
    bookingTime: string,
    message: string
  ) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?')
    if (!confirmed) return

    await onCancel(bookingId, email, bookingTime, message)
    setSelected(null)
    setSuccessMessage(`Booking on ${bookingTime} was cancelled successfully.`)

    setTimeout(() => {
      setSuccessMessage(null)
    }, 4000)
  }

  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalWrapper>
        <ModalContent>
          <ModalHeader>
            <h2>Booked Lessons</h2>
            <p style={{ fontSize: '0.9rem', color: 'gray' }}>{selectedUser.email}</p>
          </ModalHeader>
          <ModalBody>
            {successMessage && (
              <p style={{ color: 'green', marginBottom: '1rem', fontWeight: 'bold' }}>
                ✅ {successMessage}
              </p>
            )}
            {bookings.length === 0 ? (
              <p>No bookings found for this user.</p>
            ) : (
              bookings.map((booking) => (
                <LessonItem key={booking.id}>
                  <span>{booking.booking_time}</span>
                  <CancelButton
                    onClick={() => setSelected({ ...booking, email: selectedUser.email })}
                  >
                    Cancel
                  </CancelButton>
                </LessonItem>
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <CloseButton onClick={onClose}>Close</CloseButton>
          </ModalFooter>
        </ModalContent>

        {selected && (
          <AdminCancelModal
            isOpen={true}
            onClose={() => setSelected(null)}
            onConfirm={(message) =>
              handleCancel(selected.id, selected.email, selected.booking_time, message)
            }
            bookingTime={selected.booking_time}
            userEmail={selected.email}
          />
        )}
      </ModalWrapper>
    </ModalOverlay>
  )
}

export default UserLessonListModal
