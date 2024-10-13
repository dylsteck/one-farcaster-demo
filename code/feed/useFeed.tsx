import { useState, useEffect, useRef } from "react";
import { PROD_URL } from "../api/utils";

export const useFeed = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string>('');
  const initialFetchDone = useRef(false);

  const fetchFeed = async (cursorParam = '') => {
    if (isLoading || isFetchingNextPage) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${PROD_URL}/api/v1/neynar/feed/for_you?fid=616&cursor=${cursorParam}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const json = await res.json();
      setData((prev) => [...prev, ...json.casts]);
      setCursor(json.next?.cursor || '');
      setHasNextPage(!!json.next?.cursor);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;
    setIsFetchingNextPage(true);
    await fetchFeed(cursor);
    setIsFetchingNextPage(false);
  };

  const refetch = async () => {
    if (!isLoading && !isFetchingNextPage) {
      setData([]);
      await fetchFeed('');
    }
  };

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchFeed('');
      initialFetchDone.current = true;
    }
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