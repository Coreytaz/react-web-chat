import { act, renderHook, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { harness, user } from '../../test/helpers'
import { authActions } from '../../redux/slice/authSlice'
import { useAccountMutation } from './useAccountMutation'

it('ignores a profile response started by the previous account', async () => {
  let finish!: (value: string) => void
  const response = new Promise<string>((resolve) => {
    finish = resolve
  })
  const onSuccess = vi.fn()
  const h = harness()
  const { result } = renderHook(
    () => useAccountMutation({ mutationFn: () => response, onSuccess }),
    { wrapper: h.wrapper }
  )
  act(() => result.current.mutate())
  await waitFor(() => expect(result.current.isPending).toBe(true))
  act(() => h.store.dispatch(authActions.isAuth({ user: { ...user, _id: 'another-account' } })))
  await act(async () => {
    finish('old profile')
    await response
  })
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(onSuccess).not.toHaveBeenCalled()
})

it('applies a completed profile request to its active account', async () => {
  const h = harness()
  const onSuccess = vi.fn()
  const { result } = renderHook(
    () => useAccountMutation({ mutationFn: async () => 'updated profile', onSuccess }),
    { wrapper: h.wrapper }
  )
  await act(async () => {
    await result.current.mutateAsync()
  })
  expect(onSuccess).toHaveBeenCalledWith('updated profile')
})
