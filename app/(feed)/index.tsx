import { RefreshControl } from "react-native";
import { Stack } from "one";
import { InfiniteFeed } from "~/code/ui/InfiniteFeed";
import { PageContainer } from "~/code/ui/PageContainer";
import { useFeed } from "~/code/feed/useFeed";
import { FeedCard } from "~/code/feed/FeedCard";

export default () => <FeedPage />;

function FeedPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFeed();

  const handleRefetch = async () => {
    if (!isLoading && !isFetchingNextPage) {
      await refetch();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feed",
        }}
      />
      <PageContainer style={{ padding: 0, margin: 0 }}>
        <InfiniteFeed
          data={data}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          ListHeaderComponent={null}
          refetch={handleRefetch}
          isRefetching={isLoading}
          renderItem={({ item }: { item: any }) => (
            <FeedCard key={item.hash} {...item} />
          )}
          numColumns={1}
          alwaysBounceVertical
          ItemSeparatorComponent={() => (
            <Stack width="100%" height={1} borderColor="gray" />
          )}
        />
      </PageContainer>
    </>
  );
}