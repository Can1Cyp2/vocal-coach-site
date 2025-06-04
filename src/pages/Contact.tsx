import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

import {
  ContactSection,
  ContactContainer,
  ContactHeader,
  CoachInfo,
  CoachTitle,
  ContactDetails,
  ContactForm,
  FormRow,
  FormInput,
  FormTextArea,
  FormButton,
  StatusMessage,
} from '../styles/Contact'

const Contact = () => {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')

    if (!form.current) return

    console.log(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID_CancelBooking,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    )

    emailjs
      .sendForm(
        'service_ky7e9lg',
        'template_qm8tnvr',
        form.current,
        'rMl15TPZgw2zfKhYx'
      )
      .then(() => {
        setStatus('success')
        form.current?.reset()
      })
      .catch(() => setStatus('error'))
  }

  return (
    <ContactSection>
      <ContactContainer>
        <ContactHeader>Contact the Coach</ContactHeader>

        <CoachInfo>
          <CoachTitle>JP – Vocal Coach</CoachTitle>
          <ContactDetails>
            📍 Toronto, ON <br />
            📞 (555) 123-4567<br />
            📧 jpvocalsite@gmail.com
          </ContactDetails>
        </CoachInfo>

        <ContactForm ref={form} onSubmit={sendEmail}>
          <FormRow>
            <FormInput type="text" name="name" placeholder="Your Name" required />
            <FormInput type="email" name="email" placeholder="Your Email" required />
          </FormRow>
          <FormInput type="text" name="title" placeholder="Subject" required />
          <FormTextArea name="message" placeholder="Your Message" rows={6} required />

          <FormButton type="submit">Send Message</FormButton>

          {status === 'success' && <StatusMessage success>Message sent successfully!</StatusMessage>}
          {status === 'error' && <StatusMessage>Error sending message. Please try again.</StatusMessage>}
        </ContactForm>
      </ContactContainer>
    </ContactSection>
  )
}

export default Contact
