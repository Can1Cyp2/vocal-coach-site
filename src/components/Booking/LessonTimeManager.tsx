import React, { useState } from 'react'
import { format, addDays } from 'date-fns'
import { supabase } from '../../util/supabaseClient'
import { getNextDateForDay } from '../../util/nextDateDay'
import {
    TimeGroupWrapper,
    TimeGroupTitle,
    TimeGrid,
    TimeButton,
    DateSectionWrapper,
    MonthGroup,
    MonthLabel,
    DateGrid,
    DateLabel,
} from '../../styles/AdminLessonTimes'
import { AdminActionButton } from '../../styles/AdminDashboard'

interface LessonTimeManagerProps {
    userId: string
    onSave: () => Promise<void>
    onClose: () => void
}

const timeGroups = {
    'Early Morning': Array.from({ length: 8 }, (_, i) => {
        const hour = i === 0 ? 12 : i
        return `${hour}:00 AM`
    }),
    'Midday': Array.from({ length: 10 }, (_, i) => {
        const hour = i + 8
        return hour === 12 ? `12:00 PM` : `${hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`
    }),
    'Evening': Array.from({ length: 6 }, (_, i) => {
        const hour = i + 18
        return `${hour % 12 || 12}:00 PM`
    }),
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type ScheduleType = 'days' | 'dates'

const LessonTimeManager: React.FC<LessonTimeManagerProps> = ({ userId, onSave, onClose }) => {
    const [selectedTimes, setSelectedTimes] = useState<string[]>([])
    const [scheduleType, setScheduleType] = useState<ScheduleType>('days')

    // For day-based scheduling
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [makeRecurring, setMakeRecurring] = useState(false)

    // For date-based scheduling
    const [selectedDates, setSelectedDates] = useState<string[]>([])

    const handleTimeToggle = (time: string) => {
        setSelectedTimes(prev =>
            prev.includes(time)
                ? prev.filter(t => t !== time)
                : [...prev, time]
        )
    }

    const handleDayToggle = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const handleDateToggle = (date: string) => {
        setSelectedDates(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        )
    }

    const generateUpcomingDates = () => {
        const grouped: Record<string, { value: string; label: string }[]> = {}
        const today = new Date()
        for (let i = 0; i < 90; i++) {
            const date = addDays(today, i)
            const monthKey = format(date, 'MMMM yyyy')
            if (!grouped[monthKey]) grouped[monthKey] = []
            grouped[monthKey].push({
                value: format(date, 'yyyy-MM-dd'),
                label: format(date, 'MMM dd, yyyy (EEE)'),
            })
        }
        return grouped
    }

    const handleSaveLessonTimes = async () => {
        if (!selectedTimes.length) {
            alert('Select at least one time.')
            return
        }

        let sessionsToInsert: any[] = []

        if (scheduleType === 'days') {
            if (!selectedDays.length) {
                alert('Select at least one day.')
                return
            }

            sessionsToInsert = selectedDays.flatMap(day =>
                selectedTimes.map(time => {
                    const dateObj = getNextDateForDay(day, time)
                    const formattedTime = format(dateObj, 'yyyy-MM-dd h:mm a')
                    return {
                        session_time: formattedTime,
                        duration_minutes: 60,
                        created_by: userId,
                        is_booked: false,
                        recurring_day: makeRecurring ? day : null,
                        recurring_time: makeRecurring ? time : null,
                    }
                })
            )
        } else {
            if (!selectedDates.length) {
                alert('Select at least one date.')
                return
            }

            sessionsToInsert = selectedDates.flatMap(dateStr =>
                selectedTimes.map(time => {
                    // Parse the time and combine with the selected date
                    const [timeStr, period] = time.split(' ')
                    let [hours, minutes] = timeStr.split(':').map(Number)

                    if (period === 'PM' && hours !== 12) {
                        hours += 12
                    } else if (period === 'AM' && hours === 12) {
                        hours = 0
                    }
                    const [year, month, day] = dateStr.split('-').map(Number)
                    const sessionDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0)

                    const formattedTime = format(sessionDateTime, 'yyyy-MM-dd h:mm a')

                    return {
                        session_time: formattedTime,
                        duration_minutes: 60,
                        created_by: userId,
                        is_booked: false,
                        recurring_day: null,
                        recurring_time: null,
                    }
                })
            )
        }

        const { error } = await supabase.from('available_sessions').insert(sessionsToInsert)

        if (error) {
            console.error('Failed to add sessions:', error)
            alert('Failed to add session times.')
        } else {
            alert('Lesson times added!')
            // Reset form
            setSelectedDays([])
            setSelectedDates([])
            setSelectedTimes([])
            setMakeRecurring(false)
            await onSave()
            onClose()
        }
    }

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
            <h4>Select Lesson Times</h4>

            {/* Time Selection */}
            {Object.entries(timeGroups).map(([label, times]) => (
                <TimeGroupWrapper key={label}>
                    <TimeGroupTitle>{label}</TimeGroupTitle>
                    <TimeGrid>
                        {times.map((time) => (
                            <TimeButton
                                key={time}
                                $selected={selectedTimes.includes(time)}
                                onClick={() => handleTimeToggle(time)}
                            >
                                {time}
                            </TimeButton>
                        ))}
                    </TimeGrid>
                </TimeGroupWrapper>
            ))}

            {/* Schedule Type Selection */}
            <div style={{ marginTop: '1rem' }}>
                <h4>Schedule Type</h4>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="radio"
                            value="days"
                            checked={scheduleType === 'days'}
                            onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                        />
                        Weekly Days
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="radio"
                            value="dates"
                            checked={scheduleType === 'dates'}
                            onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                        />
                        Specific Dates
                    </label>
                </div>
            </div>

            {/* Day Selection (for weekly scheduling) */}
            {scheduleType === 'dates' && (
                <>
                    <h4>Select Specific Dates</h4>
                    <DateSectionWrapper>
                        {Object.entries(generateUpcomingDates()).map(([month, dates]) => (
                            <MonthGroup key={month}>
                                <MonthLabel>{month}</MonthLabel>
                                <DateGrid>
                                    {dates.map(({ value, label }) => (
                                        <DateLabel key={value} $selected={selectedDates.includes(value)}>
                                            <input
                                                type="checkbox"
                                                checked={selectedDates.includes(value)}
                                                onChange={() => handleDateToggle(value)}
                                            />
                                            {label}
                                        </DateLabel>
                                    ))}
                                </DateGrid>
                            </MonthGroup>
                        ))}
                    </DateSectionWrapper>
                </>
            )}
            {scheduleType === 'days' && (
                <>
                    <h4>Select Days of the Week</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {daysOfWeek.map((day) => (
                            <button
                                key={day}
                                onClick={() => handleDayToggle(day)}
                                style={{
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '4px',
                                    border: selectedDays.includes(day) ? '2px solid #28a745' : '1px solid #ccc',
                                    backgroundColor: selectedDays.includes(day) ? '#e7f7ee' : '#fff',
                                    cursor: 'pointer',
                                    fontWeight: selectedDays.includes(day) ? 'bold' : 'normal',
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={makeRecurring}
                            onChange={() => setMakeRecurring(!makeRecurring)}
                        />
                        Make these times available weekly
                    </label>
                </>
            )}


            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <AdminActionButton onClick={handleSaveLessonTimes}>
                    Save Lesson Times
                </AdminActionButton>
                <AdminActionButton
                    onClick={onClose}
                    style={{ backgroundColor: '#6c757d' }}
                >
                    Cancel
                </AdminActionButton>
            </div>
        </div>
    )
}

export default LessonTimeManager