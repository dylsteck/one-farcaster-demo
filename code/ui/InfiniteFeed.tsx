import { Spinner, View } from "tamagui";
import { InfiniteScrollList } from "./InfiniteScrollList";
import { type ReactElement } from "react";

export const InfiniteFeed = ({
  data,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  ListHeaderComponent,
  refetch,
  isRefetching,
  paddingTop,
  paddingBottom,
  asTabs,
  renderItem,
  numColumns,
  ItemSeparatorComponent,
  alwaysBounceVertical,
}: {
  data: unknown[];
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  ListHeaderComponent?: ReactElement;
  refetch?: () => Promise<void>;
  isRefetching?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  asTabs?: boolean;
  renderItem: ({ item }: { item: unknown }) => ReactElement;
  numColumns?: number;
  ItemSeparatorComponent?: () => ReactElement;
  alwaysBounceVertical?: boolean;
}) => {
  return (
    <InfiniteScrollList
      data={data}
      renderItem={renderItem}
      onEndReached={fetchNextPage}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View marginVertical="$3">
            <Spinner />
          </View>
        ) : null
      }
      ListHeaderComponent={ListHeaderComponent}
      numColumns={numColumns}
      ItemSeparatorComponent={ItemSeparatorComponent}
      alwaysBounceVertical={alwaysBounceVertical}
    />
  );
};