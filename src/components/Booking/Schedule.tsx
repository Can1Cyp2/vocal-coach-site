import React, { useState } from 'react'
import {
  ScheduleSectionWrapper,
  ScheduleContainer,
  WeekGrid,
  DayHeader,
  TimeSlot,
  SlotLabel,
} from '../../styles/Booking/Schedule'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const times = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']

const Schedule = () => {
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: boolean }>({})

  const handleSlotClick = (day: string, time: string) => {
    const key = `${day}-${time}`
    setBookedSlots(prev => ({
      ...prev,
      [key]: !prev[key], // Toggle booked state
    }))
  }

  return (
    <ScheduleSectionWrapper>
      <ScheduleContainer>
        <h2>Weekly Schedule</h2>
        <WeekGrid>
          <div></div>
          {days.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}

          {times.map(time => (
            <React.Fragment key={time}>
              <SlotLabel>{time}</SlotLabel>
              {days.map(day => {
                const key = `${day}-${time}`
                const isBooked = bookedSlots[key]
                return (
                  <TimeSlot
                    key={key}
                    booked={isBooked}
                    onClick={() => handleSlotClick(day, time)}
                  >
                    {isBooked ? 'Booked' : 'Available'}
                  </TimeSlot>
                )
              })}
            </React.Fragment>
          ))}
        </WeekGrid>
      </ScheduleContainer>
    </ScheduleSectionWrapper>
  )
}

export default Schedule
