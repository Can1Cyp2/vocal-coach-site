// src/components/Booking/AdminBookingModal.tsx
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
import styled from 'styled-components'
import { adminBookSession } from '../../util/supabaseAdmin'
import { parse, format, isValid } from 'date-fns'


const UserSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`

const UserSelectLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`


export const normalizeDateTime = (dateTimeStr: string): string => {
    try {
        // Expecting format: "yyyy-MM-dd h:mm a"
        const parsed = parse(dateTimeStr, 'yyyy-MM-dd h:mm a', new Date())

        if (!isValid(parsed)) {
            throw new Error('Invalid date format')
        }

        return format(parsed, 'yyyy-MM-dd h:mm a')
    } catch (error) {
        console.error('Error normalizing datetime:', dateTimeStr, error)
        return ''
    }
}

interface User {
    id: string
    email: string
}

interface AdminBookingModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (userId: string, recurring: boolean) => void
    sessionTime: string
    users: User[]
}

const AdminBookingModal: React.FC<AdminBookingModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    sessionTime,
    users,
}) => {
    const [selectedUserId, setSelectedUserId] = useState('')
    const [recurring, setRecurring] = useState(false)

    if (!isOpen) return null

    const handleConfirm = async () => {
        if (!selectedUserId) {
            alert('Please select a user to book for.')
            return
        }

        const normalizedTime = normalizeDateTime(sessionTime)
        if (!normalizedTime) {
            alert('Invalid session time format. Please try again.')
            return
        }

        const result = await adminBookSession(selectedUserId, normalizedTime)

        if (result?.success) {
            // alert('Booking session info good')
            onConfirm(selectedUserId, recurring)
            handleClose()
        } else {
            alert(`Booking failed: ${result?.error}`)
        }
    }

    const handleClose = () => {
        onClose()
        // Reset state
        setSelectedUserId('')
        setRecurring(false)
    }

    return (
        <ModalOverlay>
            <ModalWrapper>
                <ModalContent>
                    <ModalHeader>Admin Session Booking</ModalHeader>
                    <ModalBody>
                        <ModalText>
                            Book the session at {sessionTime} for:
                        </ModalText>

                        <UserSelectLabel htmlFor="user-select">
                            Select User:
                        </UserSelectLabel>
                        <UserSelect
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">-- Choose a user --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.email}
                                </option>
                            ))}
                        </UserSelect>

                        <RecurringLabel>
                            <RecurringToggle
                                type="checkbox"
                                checked={recurring}
                                onChange={() => setRecurring(prev => !prev)}
                            />
                            Make this a recurring weekly session
                        </RecurringLabel>
                    </ModalBody>

                    <ModalFooter>
                        <ModalButton $variant="secondary" onClick={handleClose}>
                            Cancel
                        </ModalButton>
                        <ModalButton $variant="primary" onClick={handleConfirm}>
                            Book Session
                        </ModalButton>
                    </ModalFooter>
                </ModalContent>
            </ModalWrapper>
        </ModalOverlay>
    )
}

export default AdminBookingModal