import React, { useMemo } from 'react';
import { Heart, Repeat, Reply } from '@tamagui/lucide-icons';
import { Paragraph, SizableText, XStack, YStack } from 'tamagui';
import { Card } from '../ui/Card';
import { Image } from '../ui/Image';
import { useWindowDimensions } from 'react-native';
import { Link } from 'one';

type FeedItem = {
  hash: string;
  text: string;
  timestamp: string;
  author: {
    display_name: string;
    username: string;
    pfp_url: string;
  };
  reactions: {
    likes_count: number;
    recasts_count: number;
  };
  replies: {
    count: number;
  };
  channel: {
    object: 'channel_dehydrated';
    id: string;
    name: string;
    image_url: string;
  } | null;
  embeds: Array<{
    url: string;
    metadata: {
      _status?: string;
      html?: object;
      content_type?: string;
      image?: {
        width_px?: number;
        height_px?: number;
      };
      video?: {
        streams: Array<{
          codec_name: string;
          height_px: number;
          width_px: number;
        }>;
        duration_s: number;
      };
    };
  }> | undefined;
};

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

export const FeedCard = React.memo((props: FeedItem) => {
  const { author, channel, text, timestamp, reactions, replies, embeds } = props;
  const { width } = useWindowDimensions();

  const filteredText = useMemo(() => {
    let result = embeds?.reduce((acc, embed) => acc.replace(embed.url, ''), text);
    if (result && result.length > 320) {
      result = `${result.slice(0, 320)}...`;
    }
    return result;
  }, [text, embeds]);

  const limitedEmbeds = useMemo(() => embeds?.slice(0, 2) || [], [embeds]);

  const renderImage = (embed, index = 0) => {
    const imageMeta = embed.metadata?.image;
    if (!imageMeta) return null;

    const { width_px = 450, height_px = 300 } = imageMeta;
    const aspectRatio = width_px / height_px;
    const maxHeight = 200;
    const calculatedWidth = Math.min(width - 40, maxHeight * aspectRatio);

    if (!embed.url) return null;

    return (
      <Image
        key={index}
        src={embed.url}
        style={{
          width: calculatedWidth,
          height: Math.min(calculatedWidth / aspectRatio, maxHeight),
          resizeMode: 'cover',
        }}
      />
    );
  };

  const renderEmbeds = useMemo(() => {
    if (limitedEmbeds.length === 2 && width >= 500) {
      return (
        <XStack key="embed-stack" space="$2">
          {limitedEmbeds.map((embed, index) => renderImage(embed, index))}
        </XStack>
      );
    }

    return limitedEmbeds.map((embed, index) => {
      if (embed.metadata?.content_type?.startsWith('image')) {
        return <YStack key={index}>{renderImage(embed, index)}</YStack>;
      } else if (embed.metadata?.content_type?.startsWith('text/html')) {
        if (embed.metadata._status && embed.metadata._status === 'RESOLVED') {
          const imageUrl = (embed.metadata.html as any).ogImage?.[0]?.url || (embed.metadata.html as any).twitterImage?.[0]?.url || '';
          const siteTitle = (embed.metadata.html as any).ogTitle || (embed.metadata.html as any).twitterTitle || (embed.metadata.html as any).alAndroidAppName || (embed.metadata.html as any).alIphoneAppName || '';
          const siteDomain = new URL(embed.url).hostname;

          return (
            <XStack
              key={index}
              paddingTop="$0"
              marginTop="$0"
              space="$2"
              borderColor="$color10"
              borderWidth={1}
              borderRadius="$3"
              width="90%"
              $gtSm={{
                width: '50%',
              }}
              overflow="hidden"
            >
              {imageUrl && <Image width={120} height={120} src={imageUrl} />}
              <Link href={embed.url}>
                <YStack flex={1} padding="$3" justifyContent="space-between">
                  <Paragraph fontWeight="bold" numberOfLines={2}>
                    {siteTitle}
                  </Paragraph>
                  <Paragraph fontSize={12} numberOfLines={1}>
                    {siteDomain}
                  </Paragraph>
                </YStack>
              </Link>
            </XStack>
          );
        } else {
          return (
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
              <Paragraph color="$color10" numberOfLines={1} flex={1}>
                {embed.url}
              </Paragraph>
            </XStack>
          );
        }
      } else if (!embed.metadata) {
        return null;
      }
    });
  }, [limitedEmbeds, width]);

  return (
    <Card padding="$4" margin="$2" marginTop="$0" marginLeft="$0" style={{ overflow: 'hidden', width: width - 40 }}>
      <XStack alignItems="flex-start" space="$2" width="100%">
        <Image width={30} height={30} borderRadius={20} src={author.pfp_url} />
        <YStack flex={1} space="$2" paddingTop="$0" width="100%">
          <XStack alignItems="center" space="$1" flexWrap="wrap" width="100%" flexShrink={1}>
            <Paragraph
              fontWeight="bold"
              numberOfLines={1}
              paddingRight="$1"
              flexShrink={1}
              style={{ maxWidth: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflow: 'hidden' }}
            >
              {author.username}
            </Paragraph>
            {channel && (
              <>
                <Paragraph numberOfLines={1} paddingRight="$1.5" flexShrink={1} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  in
                </Paragraph>
                <XStack
                  alignItems="center"
                  space="$1"
                  backgroundColor="#342942"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$10"
                  marginRight="$1.5"
                  flexShrink={1}
                  style={{ maxWidth: '100%' }}
                >
                  <Image width={16} height={16} borderRadius={8} src={channel.image_url} />
                  <Paragraph paddingLeft="$1" numberOfLines={1} color="white" flexShrink={1} style={{ maxWidth: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {channel.id}
                  </Paragraph>
                </XStack>
              </>
            )}
            <Paragraph numberOfLines={1} flexShrink={1} style={{ maxWidth: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word', opacity: 0.7 }}>
              {timeAgo(timestamp)}
            </Paragraph>
          </XStack>
          <Paragraph
            size="$4"
            width="90%"
            $gtSm={{
              width: '40%',
            }}
            style={{ flexShrink: 1, whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflow: 'hidden' }}
          >
            {filteredText}
          </Paragraph>
          <YStack space="$2" width="100%">
            {renderEmbeds}
          </YStack>
          <XStack justifyContent="flex-start" space="$5">
            <StatItem Icon={Reply} count={replies.count} />
            <StatItem Icon={Repeat} count={reactions.recasts_count} />
            <StatItem Icon={Heart} count={reactions.likes_count} />
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
});

const StatItem = ({ Icon, count }: { Icon: any; count: number }) => {
  return (
    <XStack alignItems="center" justifyContent="flex-start" space="$2">
      <Icon color="$color10" size={14} />
      <SizableText fontWeight="700" color="$color10" userSelect="none">
        {count}
      </SizableText>
    </XStack>
  );
};