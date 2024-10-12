import { Heart, Repeat, Reply } from '@tamagui/lucide-icons'
import { Paragraph, SizableText, XStack, YStack } from 'tamagui'
import { Card } from '../ui/Card'
import { Image } from '../ui/Image'
import { useWindowDimensions } from 'react-native'

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
      _status?: string
      html?: object
      content_type?: string
      image?: {
        width_px?: number
        height_px?: number
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
  const { width } = useWindowDimensions()
  const filteredText = embeds?.reduce((acc, embed) => {
    return acc.replace(embed.url, '');
  }, text);
  
  return (
    <Card tag="a" padding="$4" margin="$2" marginLeft="$0" style={{ overflow: 'hidden', width: width - 40 }}>
      <XStack alignItems="flex-start" space="$4" width="100%">
        <Image width={40} height={40} borderRadius={20} src={author.pfp_url} />
        <YStack flex={1} space="$2" width="100%">
          <XStack alignItems="center" space="$2" flexWrap="wrap" width="100%">
            <Paragraph fontWeight="bold" numberOfLines={1}>{author.username}</Paragraph>
            {channel && (
              <>
                <Paragraph numberOfLines={1}>in</Paragraph>
                <XStack
                  alignItems="center"
                  space="$1"
                  backgroundColor="#342942"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$10"
                  flexShrink={1}
                >
                  <Image width={16} height={16} borderRadius={8} src={channel.image_url} />
                  <Paragraph paddingLeft="$1" color="$color10" numberOfLines={1}>{channel.id}</Paragraph>
                </XStack>
              </>
            )}
            <Paragraph numberOfLines={1}>{timeAgo(timestamp)}</Paragraph>
          </XStack>
          <Paragraph
            size="$4"
            numberOfLines={10}
            ellipsizeMode="tail"
          >
            {filteredText}
          </Paragraph>
          <YStack space="$2" width="100%">
            {embeds?.map((embed, index) => {
              if (embed.metadata?.content_type?.startsWith('image')) {
                const { width_px = 200, height_px = 150 } = embed.metadata.image || {};
                return (
                  <Image
                    key={index}
                    src={embed.url}
                    width={width_px}
                    height={height_px}
                    resizeMode="cover"
                    borderRadius={10}
                    style={{ maxWidth: '100%' }}
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
                    style={{ borderRadius: 10, objectFit: 'cover' }}
                  >
                    <source src={embed.url} type={embed.metadata.content_type} />
                  </video>
                )
              }
              if (embed.metadata?.content_type?.startsWith('text/html')) {
                if(embed.metadata._status && embed.metadata._status === "RESOLVED"){
                  const imageUrl = (embed.metadata.html as any).ogImage?.[0]?.url || (embed.metadata.html as any).twitterImage?.[0]?.url || "";
                  const siteTitle = (embed.metadata.html as any).ogTitle || (embed.metadata.html as any).twitterTitle || (embed.metadata.html as any).alAndroidAppName || (embed.metadata.html as any).alIphoneAppName || "";
                  const siteDomain = new URL(embed.url).hostname;
                  return(
                    <XStack
                      key={index}
                      space="$2"
                      borderColor="$color10"
                      borderWidth={1}
                      borderRadius="$3"
                      width="100%"
                      overflow="hidden"
                    >
                      <Image width={120} height={120} src={imageUrl} resizeMode="cover" />
                      <YStack flex={1} padding="$3" justifyContent="space-between">
                        <Paragraph color="$color10" fontWeight="bold" numberOfLines={2}>
                          {siteTitle}
                        </Paragraph>
                        <Paragraph color="#666" fontSize={12} numberOfLines={1}>
                          {siteDomain}
                        </Paragraph>
                      </YStack>
                    </XStack>
                  )
                } else {
                  return(
                    <XStack
                      key={index}
                      alignItems="center"
                      space="$2"
                      padding="$3"
                      borderColor="$color10"
                      borderWidth={1}
                      borderRadius="$3"
                      width="100%"
                    >
                      <Paragraph color="$color10" numberOfLines={1} flex={1}>{embed.url}</Paragraph>
                    </XStack>
                  )
                }
              }
              else if(!embed.metadata?.content_type && embed.url){
                return(
                  <XStack
                    key={index}
                    alignItems="center"
                    space="$2"
                    padding="$3"
                    borderColor="$color10"
                    borderWidth={1}
                    borderRadius="$3"
                    width="100%"
                  >
                    <Paragraph color="$color10" numberOfLines={1} flex={1}>{embed.url}</Paragraph>
                  </XStack>
                )
              }
              return null
            })}
          </YStack>
          <XStack justifyContent="flex-start" space="$5">
            <StatItem Icon={Reply} count={replies.count} />
            <StatItem Icon={Repeat} count={reactions.recasts_count} />
            <StatItem Icon={Heart} count={reactions.likes_count} />
          </XStack>
        </YStack>
      </XStack>
    </Card>
  )
}

const StatItem = ({ Icon, count }: { Icon: any; count: number }) => {
  return (
    <XStack alignItems="center" justifyContent="flex-start" space="$2">
      <Icon color="$color10" size={14} />
      <SizableText fontWeight="700" color="$color10" userSelect="none">
        {count}
      </SizableText>
    </XStack>
  )
}