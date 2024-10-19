import { RefreshControl } from "react-native";
import { Stack } from "one";
import { InfiniteFeed } from "~/code/ui/InfiniteFeed";
import { PageContainer } from "~/code/ui/PageContainer";
import { useNotifications } from "~/code/notifications/useNotifications";
import { NotificationCard } from "~/code/notifications/NotificationCard";
import { type Href } from "one";

export default () => <NotificationsPage />;

function NotificationsPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useNotifications();

  const handleRefetch = async () => {
    if (!isLoading && !isFetchingNextPage) {
      await refetch();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notifications",
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
            <NotificationCard key={item.most_recent_timestamp} notification={item} />
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