import { supabase } from './supabaseClient'

export const adminBookSession = async (
  userId: string,
  sessionTime: string,
  duration: number = 60,
  coachId: string | null = null
) => {
  const { data, error } = await supabase
    .rpc('admin_book_session', {
      target_user_id: userId,
      booking_time_param: sessionTime,
      duration_param: duration,
      coach_id_param: coachId,
    })

  if (error) {
    console.error('Error booking session:', error)
    return { success: false, error: error.message }
  }

  return data
}
