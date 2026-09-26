import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export type ToastMessage = {
  id: string
  message: string
  variant: 'error' | 'status'
}

const initialState: ToastMessage[] = []

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    showToast: {
      reducer: (toasts, { payload }: PayloadAction<ToastMessage>) => {
        toasts.push(payload)
      },
      prepare: (toast: Omit<ToastMessage, 'id'>) => ({ payload: { ...toast, id: nanoid() } }),
    },
    dismissToast: (toasts, { payload: id }: PayloadAction<string>) =>
      toasts.filter((toast) => toast.id !== id),
  },
})

export const { showToast, dismissToast } = toastsSlice.actions
