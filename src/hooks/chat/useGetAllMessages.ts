import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { ChatService } from '../../service/chat/chat.service'
import { getAllMessage } from '../../types/Chat.interface'
import { useAction } from '../useAction'
import { useTypedSelector } from '../useTypedSelector'

interface useLoginType {
  asyncGetAllMessage: UseMutateAsyncFunction<AxiosResponse<getAllMessage[]>, AxiosError<unknown>, void, unknown>
  isLoading?: boolean
}

export const useGetAllMessages = (from: string, to: string, page: number, setPage: React.Dispatch<React.SetStateAction<number>>): useLoginType => {
  const { messages } = useTypedSelector((state) => state.selectedUserSlice)
  const { setMessages, setLazyMessages } = useAction()
  const limit = 30

  const { mutateAsync: asyncGetAllMessage, isLoading } = useMutation(['getAllMessages', page], async () => await ChatService.getAllMessage(from, to, page, limit), {
    onError: (err: AxiosError) => {
      console.log(err)
    },
    onSuccess: ({ data }) => {
      if (data.length > 0) {
        setMessages([...data, ...messages])
        setPage((prev) => prev + 1)
      }
      setLazyMessages(data)
    }
  })

  return { asyncGetAllMessage, isLoading }
}
