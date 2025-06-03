import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../util/supabaseClient'
import {
  AdminWrapper,
  AdminBox,
  AdminTitle,
  AdminSubtitle,
  AdminText,
  AdminDivider,
  UserWheel,
  UserCard,
  SelectedUserBox,
  AdminActionButton,
} from '../styles/AdminDashboard'

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const [verified, setVerified] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set())
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        navigate('/')
        return
      }

      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        setVerified(true)
      } else {
        navigate('/')
      }
    }

    verifyAdmin()
  }, [user, navigate])

  const loadUsersAndAdmins = async () => {
    const [{ data: allUsers }, { data: allAdmins }] = await Promise.all([
      supabase.from('public_users').select('id, email'),
      supabase.from('admins').select('user_id'),
    ])

    if (allUsers && allAdmins) {
      setUsers(allUsers)
      setAdminIds(new Set(allAdmins.map((a) => a.user_id)))
    }
  }

  useEffect(() => {
    if (verified) loadUsersAndAdmins()
  }, [verified])

  const handleAddAdmin = async (userId: string) => {
    const confirmed = window.confirm('Are you sure you want to grant admin privileges?')
    if (!confirmed) return

    await supabase.from('admins').insert([{ user_id: userId }])
    loadUsersAndAdmins()
  }

  const handleRemoveAdmin = async (userId: string) => {
    if (userId === user?.id) {
      alert("You can't remove yourself as an admin.")
      return
    }

    const confirmed = window.confirm('Are you sure you want to remove this admin?')
    if (!confirmed) return

    await supabase.from('admins').delete().eq('user_id', userId)
    loadUsersAndAdmins()
  }

  if (!verified || !user) return null

  return (
    <AdminWrapper>
      <AdminBox>
        <AdminTitle>Admin Dashboard</AdminTitle>
        <AdminSubtitle>Welcome, {user.email}</AdminSubtitle>
        <AdminDivider />
        <AdminText><strong>Admins</strong></AdminText>

        <UserWheel>
          {users.filter(u => adminIds.has(u.id)).map(u => (
            <UserCard
              key={u.id}
              $selected={selectedUser?.id === u.id}
              onClick={() => setSelectedUser(u)}
            >
              {u.email}
            </UserCard>
          ))}
        </UserWheel>

        <AdminDivider />
        <AdminText><strong>Regular Users</strong></AdminText>

        <UserWheel>
          {users.filter(u => !adminIds.has(u.id)).map(u => (
            <UserCard
              key={u.id}
              $selected={selectedUser?.id === u.id}
              onClick={() => setSelectedUser(u)}
            >
              {u.email}
            </UserCard>
          ))}
        </UserWheel>

        {selectedUser && (
          <SelectedUserBox>
            <p><strong>{selectedUser.email}</strong></p>
            {adminIds.has(selectedUser.id) ? (
              <AdminActionButton
                disabled={selectedUser.id === user.id}
                onClick={() => handleRemoveAdmin(selectedUser.id)}
              >
                Remove Admin
              </AdminActionButton>
            ) : (
              <AdminActionButton
                onClick={() => handleAddAdmin(selectedUser.id)}
              >
                Make Admin
              </AdminActionButton>
            )}
          </SelectedUserBox>
        )}
      </AdminBox>
    </AdminWrapper>
  )

}

export default AdminDashboard
