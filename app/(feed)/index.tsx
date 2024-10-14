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
      <PageContainer
        padding={0}
        margin={0}
        maxWidth="60%"
        borderRightWidth={1}
        borderRightColor="$borderColor"
        $sm={{
          maxWidth: "100%",
        }}
      >
        <InfiniteFeed
          data={data}
          fetchMore={fetchNextPage}
          isLoading={isFetchingNextPage}
          hasMore={hasNextPage}
          renderItem={({ item }: { item: any }) => (
            <FeedCard key={item.hash} {...item} />
          )}
          refetch={handleRefetch}
        />
      </PageContainer>
    </>
  );
}