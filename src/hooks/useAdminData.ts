import { useState, useCallback } from 'react'
import { supabase } from '../util/supabaseClient'

export const useAdminData = () => {
  const [users, setUsers] = useState<any[]>([])
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set())

  const loadUsersAndAdmins = useCallback(async () => {
    const [{ data: allUsers, error: usersError }, { data: allAdmins, error: adminsError }] =
      await Promise.all([
        supabase.from('public_users').select('id, email'),
        supabase.from('admins').select('user_id'),
      ])

    if (allUsers && allAdmins) {
      setUsers(allUsers)
      setAdminIds(new Set(allAdmins.map((a) => a.user_id)))
    }

    return {
      success: !usersError && !adminsError,
      usersError,
      adminsError,
    }
  }, [])
  

  return { users, adminIds, loadUsersAndAdmins }
}
