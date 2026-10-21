import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTypedSelector } from '../useTypedSelector'
import { useAction } from '../useAction'
import { errorMessage } from '../../utils/errors'
interface AccountMutationOptions<Data> {
  mutationFn: () => Promise<Data>
  onSuccess: (data: Data) => void
}
// Ignore results from a profile request after logout or an account switch.
export function useAccountMutation<Data>({ mutationFn, onSuccess }: AccountMutationOptions<Data>) {
  const account = useTypedSelector((state) => state.authSlice.user._id)
  const active = useRef(account)
  const { setError } = useAction()
  useEffect(() => {
    active.current = account
    return () => {
      active.current = ''
    }
  }, [account])
  return useMutation({
    mutationFn,
    onMutate: () => account,
    onError: (error, _variables, startedAccount) => {
      if (active.current === startedAccount) setError(errorMessage(error))
    },
    onSuccess: (data, _variables, startedAccount) => {
      if (active.current === startedAccount) onSuccess(data)
    }
  })
}
