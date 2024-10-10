import { Heart, Repeat, Reply } from '@tamagui/lucide-icons'
import { Paragraph, SizableText, XStack, YStack } from 'tamagui'
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
  channel: {
    object: "channel_dehydrated"
    id: string
    name: string
    image_url: string
  } | null;
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

function timeAgo(isoString: string): string {
  const now = new Date();
  const timestamp = new Date(isoString);

  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else {
    return `${days}d`;
  }
}

export const FeedCard = (props: FeedItem) => {
  const { author, channel, text, timestamp, reactions, replies, embeds } = props

  const content = (
    <Card tag="a" padding="$4" paddingLeft="$3" margin="$2" marginLeft="$0" style={{ overflow: 'hidden' }}>
      <XStack>
        <Image width={40} height={40} br={20} src={author.pfp_url} />
        <YStack f={1} ml="$2">
          <Paragraph size="$5">
            <XStack alignItems="center" space="$2">
              <Paragraph fontWeight="bold">{author.username}</Paragraph>
              {channel && (
                <>
                  <Paragraph paddingRight="$2">in</Paragraph>
                  <XStack
                    alignItems="center"
                    space="$1"
                    backgroundColor="#342942"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$10"
                  >
                    <Image width={16} height={16} br={8} src={channel.image_url} />
                    <Paragraph paddingLeft="$1" color="white">{channel.id}</Paragraph>
                  </XStack>
                </>
              )}
              <Paragraph marginLeft={channel ? "0" : "$3"}>{timeAgo(timestamp)}</Paragraph>
            </XStack>
          </Paragraph>
          <Paragraph
            size="$4"
            whiteSpace="pre-wrap"
            maxWidth="100%"
            overflow="hidden"
            textOverflow="ellipsis"
            wordBreak="break-word"
            style={{ paddingRight: 10 }}
          >
            {text}
          </Paragraph>
          {embeds?.map((embed, index) => {
            if (embed.metadata?.content_type?.startsWith('image')) {
              return (
                <Image
                  key={index}
                  src={embed.url}
                  width="100%"
                  height={200}
                  mt="$2"
                  style={{ objectFit: 'contain', maxWidth: '100%' }}
                />
              )
            }
            if (embed.metadata?.content_type?.startsWith('video')) {
              return (
                <video
                  key={index}
                  controls
                  width="100%"
                  height={200}
                  mt="$2"
                  style={{ maxWidth: '100%' }}
                >
                  <source src={embed.url} type={embed.metadata.content_type} />
                </video>
              )
            }
            return null
          })}
          <XStack mt="$2" jc="flex-start" px="$1" gap="$5">
            <StatItem Icon={Reply} count={replies.count} />
            <StatItem Icon={Repeat} count={reactions.recasts_count} />
            <StatItem Icon={Heart} count={reactions.likes_count} />
          </XStack>
        </YStack>
      </XStack>
    </Card>
  )

  return content
}

const StatItem = ({ Icon, count }: { Icon: any; count: number }) => {
  return (
    <XStack ai="center" jc="flex-start" gap="$2">
      <Icon color="$color10" size={14} />
      <SizableText fow="700" color="$color10" userSelect="none">
        {count}
      </SizableText>
    </XStack>
  )
}