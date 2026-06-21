import { useState, useEffect } from 'react'
import { deckService } from '../services/deckService'

export const useDecks = () => {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await deckService.getAllDecks()
      setDecks(data || [])
    } catch (err) {
      console.error('Error fetching decks:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { decks, loading, error, refetch: fetchDecks }
}