export const getNextDateForDay = (day: string, time: string): string => {
  const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
  let date = new Date()
  const currentDay = date.getDay()

  let offset = targetDay - currentDay
  if (offset < 0) offset += 7 // go to next week if necessary

  date.setDate(date.getDate() + offset)

  // Add time
  const [hour, minutePart] = time.split(':')
  const [minutes, meridian] = minutePart.split(' ')
  let h = parseInt(hour, 10)
  if (meridian === 'PM' && h < 12) h += 12
  if (meridian === 'AM' && h === 12) h = 0
  date.setHours(h, parseInt(minutes), 0, 0)

  return date.toISOString()
}