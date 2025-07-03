"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

interface UserFormProps {
  initialData?: User | null
  onSubmit: (data: any) => void
  onCancel: () => void
  submitting: boolean
  submitLabel: string
}

export function UserForm({ initialData, onSubmit, onCancel, submitting, submitLabel }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
      })
    } else {
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          placeholder="Enter email address"
          required
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange("firstName")}
          placeholder="Enter first name"
          required
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange("lastName")}
          placeholder="Enter last name"
          required
          disabled={submitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

