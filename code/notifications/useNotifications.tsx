import { useState, useEffect, useRef } from "react";

export const useNotifications = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string>('');
  const initialFetchDone = useRef(false);

  const fetchNotifications = async (cursorParam = '') => {
    if (isLoading || isFetchingNextPage) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/v1/neynar/notifications?fid=616&cursor=${cursorParam}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData);
      }
      const json = await res.json();
      setData((prev) => [...prev, ...json.notifications]);
      setCursor(json.next?.cursor || '');
      setHasNextPage(!!json.next?.cursor);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPageNotifications = async () => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;
    setIsFetchingNextPage(true);
    await fetchNotifications(cursor);
    setIsFetchingNextPage(false);
  };

  const refetchNotifications = async () => {
    if (!isLoading && !isFetchingNextPage) {
      setData([]);
      await fetchNotifications('');
    }
  };

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchNotifications('');
      initialFetchDone.current = true;
    }
  }, []);

  return {
    data,
    error,
    fetchNextPage: fetchNextPageNotifications,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError: !!error,
    refetch: refetchNotifications,
  };
};