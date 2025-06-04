// src/util/AdminCancelModal.tsx
import emailjs from '@emailjs/browser'

export const sendCancellationEmail = async (
  userEmail: string,
  bookingTime: string,
  adminMessage: string
) => {
  return await emailjs.send(
    'service_ky7e9lg',               // Service ID
    'template_ohecpup',              // Template ID for cancel emails
    {
      user_email: userEmail,
      booking_time: bookingTime,
      admin_message: adminMessage,
    },
    'rMl15TPZgw2zfKhYx'              // Public Key
  )
}
