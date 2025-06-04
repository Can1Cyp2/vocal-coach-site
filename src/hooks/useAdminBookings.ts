import { useCallback, useState } from "react";
import { supabase } from "../util/supabaseClient";

export const useAdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([])

  const loadBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, booking_time, user_id, public_users(email)')

    if (error) {
      console.error('Error loading bookings:', error)
      return
    }

    const formatted = data.map((b: any) => ({
      id: b.id,
      booking_time: b.booking_time,
      user_id: b.user_id,
      email: b.public_users?.email || 'Unknown',
    }))

    setBookings(formatted)
  }

  const cancelBooking = async (bookingId: string) => {
    await supabase.from('bookings').delete().eq('id', bookingId)
    loadBookings()
  }

  return { bookings, loadBookings, cancelBooking }
}
