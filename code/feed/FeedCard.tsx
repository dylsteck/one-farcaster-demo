import { Heart, Repeat, Reply } from '@tamagui/lucide-icons'
import { Paragraph, SizableText, XStack, YStack } from 'tamagui'
import { Link } from 'one'
import { Card } from '../ui/Card'
import { Image } from '../ui/Image'

type FeedItem = {
  hash: string
  text: string
  timestamp: string
  author: {
    display_name: string
    username: string
    pfp_url: string
  }
  reactions: {
    likes_count: number
    recasts_count: number
  }
  replies: {
    count: number
  }
  embeds: Array<{
    url: string
    metadata: {
      content_type?: string
      image?: {
        width_px: number
        height_px: number
      }
      video?: {
        streams: Array<{
          codec_name: string
          height_px: number
          width_px: number
        }>
        duration_s: number
      }
    }
  }> | undefined
}

export const FeedCard = (props: FeedItem) => {
  const { author, text, timestamp, reactions, replies, embeds } = props

  const content = (
    <Card tag="a" padding="$4" margin="$2">
      <XStack>
        <Image width={40} height={40} br={20} src={author.pfp_url} />
        <YStack f={1} ml="$3">
          <Paragraph size="$5" fow="bold">
            {author.display_name} @{author.username}
          </Paragraph>
          <Paragraph
            size="$4"
            whiteSpace="pre-wrap"
            $gtSm={{
              size: '$5',
            }}
          >
            {text}
          </Paragraph>
          {embeds?.map((embed, index) => {
            if (embed.metadata?.content_type?.startsWith('image')) {
              return <Image key={index} src={embed.url} width="100%" height={200} mt="$2" />
            }
            if (embed.metadata?.content_type?.startsWith('video')) {
              return (
                <video key={index} controls width="100%" height={200} mt="$2">
                  <source src={embed.url} type={embed.metadata.content_type} />
                </video>
              )
            }
            return null
          })}
          <XStack mt="$2" jc="flex-end" px="$1" gap="$5">
            <StatItem Icon={Reply} count={replies.count} />
            <StatItem Icon={Repeat} count={reactions.recasts_count} />
            <StatItem Icon={Heart} count={reactions.likes_count} />
          </XStack>
        </YStack>
      </XStack>
    </Card>
  )

  return (
    <Link asChild href={`/post/${encodeURIComponent(props.hash)}`}>
      {content}
    </Link>
  )
}

const StatItem = ({ Icon, count }: { Icon: any; count: number }) => {
  return (
    <XStack ai="center" jc="center" gap="$2">
      <Icon color="$color10" size={14} />
      <SizableText fow="700" color="$color10" userSelect="none">
        {count}
      </SizableText>
    </XStack>
  )
}