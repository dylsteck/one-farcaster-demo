import { Paragraph } from 'tamagui'
import Frame from '~/code/frames/Frames'
import { PageContainer } from '~/code/ui/PageContainer'

export default function ExplorePage() {

  return (
    <PageContainer ml="$0" pl="$5">
        <Paragraph size="$8" pt="$2">
            Explore Farcaster
        </Paragraph>
        <Frame />
    </PageContainer>
  )
}