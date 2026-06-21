import { useQuery } from '@tanstack/react-query'
import { deckService } from '../services/deckService'

export const useDecksQuery = () => {
  return useQuery({
    queryKey: ['decks'],
    queryFn: () => deckService.getAllDecks(),
    staleTime: 5 * 60 * 1000, // 5 phút
  })
}