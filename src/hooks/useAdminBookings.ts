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
    try {
      console.log('Attempting to cancel booking with ID:', bookingId)
      
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .select() // This returns the deleted rows to verify deletion worked

      if (error) {
        console.error('Database error cancelling booking:', error)
        throw new Error(`Failed to cancel booking: ${error.message}`)
      }

      // Check if any rows were actually deleted
      if (!data || data.length === 0) {
        console.error('No booking found with ID:', bookingId)
        throw new Error('No booking found to delete - booking may have already been cancelled')
      }

      console.log('Successfully cancelled booking:', data[0])

      // Refresh the bookings list
      await loadBookings()

      return { success: true, deletedBooking: data[0] }
    } catch (error) {
      console.error('Error in cancelBooking:', error)
      // Re-throw the error so the calling code can handle it
      throw error
    }
  }

  return { bookings, loadBookings, cancelBooking }
}
