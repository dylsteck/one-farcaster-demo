import { useState, useEffect } from 'react'

export const useFeed = () => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  const fetchFeed = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/neynar/feed/for_you?fid=616')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        const errorData = await res.json()
        setError(errorData)
      }
    } catch (err) {
      setError(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return { data, isLoading, error, refresh: fetchFeed }
}