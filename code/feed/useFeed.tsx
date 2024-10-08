import { useState, useEffect } from 'react';

export const useFeed = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string>('');

  const fetchFeed = async (cursorParam = '') => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/neynar/feed/for_you?fid=616&cursor=${cursorParam}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const json = await res.json();
      console.log('json', json);
      setData((prev) => [...prev, ...json.casts]);
      setCursor(json.next.cursor || '');
      setHasNextPage(!!json.next.cursor);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!hasNextPage) return;
    setIsFetchingNextPage(true);
    await fetchFeed(cursor);
    setIsFetchingNextPage(false);
  };

  const refetch = async () => {
    setData([]);
    await fetchFeed('');
  };

  useEffect(() => {
    fetchFeed('');
  }, []);

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError: !!error,
    refetch,
  };
};