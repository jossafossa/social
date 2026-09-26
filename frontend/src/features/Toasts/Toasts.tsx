import { dismissToast, useAppDispatch, useAppSelector } from '~/api'
import { Toast, ToastRegion } from '~/components'

export const Toasts = () => {
  const toasts = useAppSelector((state) => state.toasts)
  const dispatch = useAppDispatch()

  return (
    <ToastRegion>
      {toasts.map(({ id, message, variant }) => (
        <Toast
          key={id}
          message={message}
          variant={variant}
          onDismiss={() => dispatch(dismissToast(id))}
        />
      ))}
    </ToastRegion>
  )
}
