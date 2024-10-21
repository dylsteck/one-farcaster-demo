import { Paragraph, XStack } from 'tamagui'
import Frame from '~/code/frames/Frames'
import { PageContainer } from '~/code/ui/PageContainer'

export default function ExplorePage() {

  return (
    <PageContainer ml="$0" pl="$5">
        <Paragraph size="$8" pt="$2">
            Explore Farcaster
        </Paragraph>
        <XStack gap="$4" marginTop="$3">
            <Frame url="https://fctrivia.xyz" />
            <Frame url="https://fctrivia.xyz" />
            <Frame url="https://fctrivia.xyz" />
        </XStack>
        <Paragraph size="$8" pt="$2">
            Top Apps
        </Paragraph>
        <Paragraph size="$8" pt="$2">
            Top Channels
        </Paragraph>
    </PageContainer>
  )
}