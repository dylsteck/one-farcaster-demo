import { RefreshControl } from 'react-native'
import { ScrollView } from 'tamagui'
import { Stack } from 'one'
import { FeedCard } from '~/code/feed/FeedCard'
import { PageContainer } from '~/code/ui/PageContainer'
import { useFeed } from '~/code/feed/useFeed'

export default () => <FeedPage />

function FeedPage() {
  const { data, isLoading, error, refresh } = useFeed()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Feed',
        }}
      />
      <PageContainer>
        <ScrollView
          maxHeight="100%"
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        >
          {data?.casts.map((cast) => (
            <FeedCard key={cast.hash} {...cast} />
          ))}
        </ScrollView>
      </PageContainer>
    </>
  )
}