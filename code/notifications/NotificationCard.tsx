import { Paragraph, Text, XStack, YStack, Image as TImage } from 'tamagui'
import { Link } from 'one'
import { Card } from '../ui/Card'
import { Image } from '../ui/Image'

type Notification = {
    type: string
    follows?: Array<{
      user: {
        username: string
        pfp_url: string | null
      }
    }>
    cast?: {
      reactions: {
        likes: Array<{
          fname: string
        }>
      }
      author: {
        username: string
      }
    }
    reactions?: Array<{
      user: {
        username: string
      }
    }>
}

export const NotificationCard = ({ key, notification }: { key: string, notification: Notification }) => {
  switch (notification.type) {
    case 'follows':
      return (
        <Card p="$3" backgroundColor="$background" borderRadius="$4" elevation="$2">
          <XStack ai="center" space="$2">
            {notification?.follows && notification?.follows.length === 1 ? (
              <Paragraph>
                <Text fontWeight="bold">{notification?.follows[0].user.username}</Text> followed you
              </Paragraph>
            ) : (
              notification?.follows && notification?.follows.length > 1 && (
                <>
                  <Paragraph>
                    <XStack space="$2" mt="$2" mb="$3">
                      {notification?.follows.slice(0, 5).map((follower, index) => (
                        <Image
                          key={index}
                          width={32}
                          height={32}
                          br={100}
                          src={follower.user.pfp_url || '/default-avatar.png'}
                        />
                      ))}
                    </XStack>
                    <Text fontWeight="bold">{notification?.follows[0].user.username}</Text> and{' '}
                    <Text fontWeight="bold">
                      {(notification?.follows.length - 1).toLocaleString()} others
                    </Text>{' '}
                    followed you
                  </Paragraph>
                </>
              )
            )}
          </XStack>
        </Card>
      )
    case 'likes':
      return (
        <Card p="$3" backgroundColor="$background" borderRadius="$4" elevation="$2">
          {notification.cast && notification.cast.reactions.likes.length > 0 && (
            <>
              {notification.cast.reactions.likes.length === 1 ? (
                <Paragraph>
                  <Text fontWeight="bold">
                    {notification.cast.reactions.likes[0].fname}
                  </Text>{' '}
                  liked your cast
                </Paragraph>
              ) : (
                <Paragraph>
                  <Text fontWeight="bold">
                    {notification.cast.reactions.likes[0].fname} and{' '}
                    {(notification.cast.reactions.likes.length - 1).toLocaleString()} others
                  </Text>{' '}
                  liked your cast
                </Paragraph>
              )}
            </>
          )}
        </Card>
      )
    case 'mention':
      return (
        <Card p="$3" backgroundColor="$background" borderRadius="$4" elevation="$2">
          <Paragraph>
            <Text fontWeight="bold">{notification.cast?.author.username}</Text> mentioned you
          </Paragraph>
        </Card>
      )
    case 'recasts':
      return (
        <Card p="$3" backgroundColor="$background" borderRadius="$4" elevation="$2">
          {notification.reactions && notification.reactions.length > 0 && (
            <>
              {notification.reactions.length === 1 ? (
                <Paragraph>
                  <Text fontWeight="bold">{notification.reactions[0].user.username}</Text>{' '}
                  recasted your cast
                </Paragraph>
              ) : (
                <Paragraph>
                  <Text fontWeight="bold">
                    {notification.reactions[0].user.username} and{' '}
                    {(notification.reactions.length - 1).toLocaleString()} others
                  </Text>{' '}
                  recasted your cast
                </Paragraph>
              )}
            </>
          )}
        </Card>
      )
    case 'reply':
      return (
        <Card p="$3" backgroundColor="$background" borderRadius="$4" elevation="$2">
          <Paragraph>
            <Text fontWeight="bold">{notification.cast?.author.username}</Text> replied to your
            cast
          </Paragraph>
        </Card>
      )
    default:
      return (
        <Card p="$3" backgroundColor="$background" borderRadius="$4" elevation="$2">
          <Paragraph>Unknown notification type: {notification.type}</Paragraph>
        </Card>
      )
  }
}