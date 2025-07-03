"use client"

interface DeleteConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  userName: string
  submitting: boolean
}

export function DeleteConfirmDialog({ open, onConfirm, onCancel, userName, submitting }: DeleteConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={submitting}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

