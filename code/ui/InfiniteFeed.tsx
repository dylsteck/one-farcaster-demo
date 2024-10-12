import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { View } from 'react-native';

interface InfiniteScrollListProps {
  data: any[];
  fetchMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  renderItem: ({ item }: { item: any }) => React.ReactNode;
  refetch: () => void;
}

const InfiniteScrollList: React.FC<InfiniteScrollListProps> = ({
  data,
  fetchMore,
  isLoading,
  hasMore,
  renderItem,
  refetch,
}) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleEndReached = () => {
    if (!isLoading && hasMore && Platform.OS !== 'web') {
      setIsFetching(true);
      fetchMore();
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      onEndReached={Platform.OS !== 'web' ? handleEndReached : undefined}
      ListFooterComponent={() =>
        isFetching && <ActivityIndicator size="large" color="#0000ff" />
      }
      ListFooterComponentStyle={{ paddingVertical: 20 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
};

const InfiniteFeed: React.FC<InfiniteScrollListProps> = (props) => {
  return <InfiniteScrollList {...props} />;
};

export { InfiniteFeed };