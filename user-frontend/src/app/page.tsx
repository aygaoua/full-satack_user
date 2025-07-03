"use client"

import { useState, useEffect, useCallback } from "react"
import { UserForm } from "./components/user-form"
import { DeleteConfirmDialog } from "./components/delete-confirm-dialog"

// Types
interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

interface CreateUserDto {
  email: string
  firstName: string
  lastName: string
}

interface UpdateUserDto {
  email?: string
  firstName?: string
  lastName?: string
}

// API Base URL
const API_BASE_URL = "http://localhost:3000/users"

export default function UserManagement() {
  // State
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  // API Functions
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_BASE_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: User[] = await response.json()
      setUsers(data)
    } catch (err: any) {
      setError(`Failed to fetch users: ${err.message}`)
      console.error("Fetch users error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = async (dto: CreateUserDto) => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (response.status === 409) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Email already exists.")
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchUsers()
      setShowCreateModal(false)
    } catch (err: any) {
      setError(`Failed to create user: ${err.message}`)
      console.error("Create user error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const updateUser = async (id: number, dto: UpdateUserDto) => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })

      if (response.status === 409) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Email already exists for another user.")
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchUsers()
      setShowUpdateModal(false)
      setSelectedUser(null)
    } catch (err: any) {
      setError(`Failed to update user: ${err.message}`)
      console.error("Update user error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteUser = async (id: number) => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchUsers()
      setShowDeleteDialog(false)
      setSelectedUser(null)
    } catch (err: any) {
      setError(`Failed to delete user: ${err.message}`)
      console.error("Delete user error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  // Event Handlers
  const handleCreateSubmit = (data: CreateUserDto) => {
    createUser(data)
  }

  const handleUpdateSubmit = (data: UpdateUserDto) => {
    if (selectedUser) {
      updateUser(selectedUser.id, data)
    }
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setShowUpdateModal(true)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
    }
  }

  // Effects
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage your users with full CRUD operations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Add User Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-lg text-gray-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <p className="text-lg text-gray-500 mb-4">No users found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add your first user
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New User</h2>
                <p className="text-gray-600 mb-6">Create a new user account with the form below.</p>
                <UserForm
                  onSubmit={handleCreateSubmit}
                  onCancel={() => setShowCreateModal(false)}
                  submitting={submitting}
                  submitLabel="Create User"
                />
              </div>
            </div>
          </div>
        )}

        {/* Update User Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit User</h2>
                <p className="text-gray-600 mb-6">Update the user information below.</p>
                <UserForm
                  initialData={selectedUser}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => {
                    setShowUpdateModal(false)
                    setSelectedUser(null)
                  }}
                  submitting={submitting}
                  submitLabel="Update User"
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false)
            setSelectedUser(null)
          }}
          userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""}
          submitting={submitting}
        />
      </div>
    </div>
  )
}

