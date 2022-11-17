import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import { UseMutateAsyncFunction, useMutation } from 'react-query'
import { ChatService } from '../../service/chat/chat.service'
import { getAllMessage } from '../../types/Chat.interface'

interface useLoginType {
  asyncGetAllMessage: UseMutateAsyncFunction<AxiosResponse<getAllMessage[]>, AxiosError<unknown>, void, unknown>
  isLoading?: boolean
  messages: getAllMessage[]
  setMessages: React.Dispatch<React.SetStateAction<getAllMessage[]>>
}

export const useGetAllMessages = (from: string, to: string): useLoginType => {
  const [messages, setMessages] = React.useState<getAllMessage[]>([])

  const { mutateAsync: asyncGetAllMessage, isLoading } = useMutation('getAllMessages', async () => await ChatService.getAllMessage(from, to), {
    onError: (err: AxiosError) => {
      console.log(err)
    },
    onSuccess: ({ data }) => {
      setMessages(data)
    }
  })

  return { asyncGetAllMessage, isLoading, messages, setMessages }
}
