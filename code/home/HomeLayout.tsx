import { type ReactNode, useState } from 'react'
import {
  createStyledContext,
  isTouchable,
  ScrollView,
  styled,
  View,
  type ViewProps,
  XStack,
  YStack,
  useMedia,
  Paragraph,
  SizableText,
  Input,
  useTheme,
} from 'tamagui'
import { type Href, Link, Slot, usePathname } from 'one'
import { Logo } from '../brand/Logo'
import { useToggleTheme } from '../theme/ToggleThemeButton'
import { HomeIcons } from './HomeIcons'

const Context = createStyledContext({
  isVertical: false,
})

export function HomeLayout() {
  const media = useMedia()
  const pathname = usePathname()

  return (
    <Context.Provider isVertical={isTouchable}>
      {isTouchable || media.sm ? <HomeLayoutTouch /> : <HomeLayoutMouse />}
    </Context.Provider>
  )
}

function HomeLayoutTouch() {
  return (
    <YStack f={1}>
      <YStack f={1}>
        <ScrollView>
          <Slot />
        </ScrollView>
      </YStack>

      <XStack
        ai="center"
        jc="space-between"
        btw={1}
        btc="$borderColor"
        py="$1"
        gap="$1"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1}
        px="$4"
      >
        <NavLinks />
      </XStack>
    </YStack>
  )
}

function HomeLayoutMouse() {
  const theme = useTheme()

  return (
    <YStack f={1} mah="100vh">
      <XStack
        ai="center"
        jc="space-between"
        borderBottomWidth={1}
        borderBottomColor={theme.white075}
        pl="$4"
        pr="$4"
        py="$2"
        zIndex={2}
      >
        <XStack alignItems="center" space="$2">
          <Logo />
          <Paragraph fontSize="$6" opacity="0.7" fontWeight={400}>
            Cortex
          </Paragraph>
          <SearchBar />
        </XStack>
      </XStack>

      <XStack f={1}>
        <YStack
          ai="flex-start"
          brw={1}
          brc={theme.white075}
          pl="$12"
          pr="$3"
          py="$0"
          gap="$1"
          borderRightWidth={1}
          borderRightColor={theme.white075}
          $sm={{
            display: 'none',
          }}
        >
          <NavLinks />
          <View flex={1} />
        </YStack>

        <YStack f={7} maw="100%" $sm={{ f: 1 }}>
          <ScrollView
            borderLeftWidth={1}
            borderLeftColor={theme.borderColor}
          >
            <YStack mt="$2">
              <Slot />
            </YStack>
          </ScrollView>
        </YStack>
      </XStack>
    </YStack>
  )
}

function NavLinks() {
  return (
    <>
      <SideMenuLink href="/" subPaths={['/post/']} Icon={HomeIcons.Home} />
      <SideMenuLink href="/search" Icon={HomeIcons.Search} />
      {/* <SideMenuLink href="/profile" Icon={HomeIcons.User} /> */}
    </>
  )
}

function SearchBar() {
  return (
    <XStack w="100%" maxWidth={400} marginLeft="$4">
      <Input
        placeholder="Search Farcaster"
        w="100%"
        size="$4"
        borderWidth={1}
        borderColor="$color7"
        borderRadius="$10"
        px="$4"
        py="$1"
      />
    </XStack>
  )
}

const IconFrame = styled(View, {
  $gtXs: {
    scale: 0.8,
    m: -5,
  },
})

const ToggleThemeLink = (props: ViewProps) => {
  const { onPress, Icon } = useToggleTheme()
  return (
    <LinkContainer {...props} onPress={onPress}>
      <IconFrame>
        <Icon size={21} />
      </IconFrame>
    </LinkContainer>
  )
}

const SideMenuLink = ({
  href,
  subPaths,
  Icon,
}: {
  subPaths?: string[]
  href: Href
  Icon: (typeof HomeIcons)['Home']
}) => {
  const pathname = usePathname()
  const isActive = pathname === href || subPaths?.some((p) => pathname.startsWith(p))

  return (
    <Link asChild href={href}>
      <LinkContainer isActive={isActive}>
        <IconFrame>
          <Icon size={28} />
        </IconFrame>
      </LinkContainer>
    </Link>
  )
}

const LinkContainer = styled(XStack, {
  context: Context,
  tag: 'a',
  className: 'text-decoration-none',
  gap: '$4',
  br: '$6',
  cur: 'pointer',
  ai: 'center',
  hoverStyle: {
    bg: '$color3',
  },
  pressStyle: {
    bg: '$color3',
  },

  variants: {
    isActive: {
      true: {
        backgroundColor: '$color2',
      },
    },

    isVertical: {
      true: {
        f: 1,
        jc: 'center',
        px: '$2.5',
        py: '$2.5',
      },
      false: {
        w: '100%',
        px: '$3.5',
        py: '$3.5',

        $xs: {
          p: 0,
          w: '$6',
          h: '$6',
          ai: 'center',
          jc: 'center',
        },
      },
    },
  } as const,
})