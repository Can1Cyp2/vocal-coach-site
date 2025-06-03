import { supabase } from './supabaseClient'

// Fetch all admins with emails
export const fetchAdminUsers = async () => {
  return await supabase
    .from('admins')
    .select('user_id, auth:auth_users ( email )')
    .order('created_at', { ascending: false })
    .maybeSingle()
}

// Add admin by email
export const addAdminByEmail = async (email: string) => {
  const { data: user, error: userError } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError || !user) return { error: 'User not found' }

  const { error } = await supabase
    .from('admins')
    .insert([{ user_id: user.id }])

  return { error }
}

// Remove admin by ID
export const removeAdmin = async (userId: string) => {
  const { error } = await supabase
    .from('admins')
    .delete()
    .eq('user_id', userId)

  return { error }
}
