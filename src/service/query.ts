import { QueryClient } from '@tanstack/react-query'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false }
  }
})
export const keys = {
  friends: (id: string) => ['friends', id] as const,
  requests: (id: string) => ['requests', id] as const,
  user: (id: string, other: string) => ['user', id, other] as const,
  search: (id: string, search: string) => ['search', id, search] as const,
  messages: (id: string, other: string) => ['messages', id, other] as const
}

// Preserve the mounted session query so its observers receive the logged-out state.
export async function clearPrivateQueries(client: QueryClient) {
  const filter = {
    predicate: (query: { queryKey: readonly unknown[] }) => query.queryKey[0] !== 'session'
  }
  await client.cancelQueries(filter)
  client.removeQueries(filter)
  client.getMutationCache().clear()
}
