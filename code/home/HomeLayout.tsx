import { type ReactNode } from 'react'
import {
  createStyledContext,
  isTouchable,
  ScrollView,
  styled,
  View,
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
import { Image } from '../ui/Image'

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
      <XStack
        position="fixed"
        ai="center"
        jc="space-between"
        width="100%"
        backgroundColor="#222121"
        borderBottomWidth={1}
        borderBottomColor={"$white"}
        pl="$4"
        pr="$4"
        py="$2"
        zIndex={2}
      >
        <XStack alignItems="center" space="$2">
          <Logo />
          <Paragraph fontSize="$6" opacity="0.7" fontWeight={400}>
            Tap
          </Paragraph>
          <SearchBar />
        </XStack>
      </XStack>
      <YStack f={1} pt="$7">
        <ScrollView pt="$5" pb="$6">
          <Slot />
        </ScrollView>
      </YStack>

      <XStack
        ai="center"
        jc="space-between"
        btw={1}
        btc="$borderColor"
        py="$2"
        gap="$1"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1}
        px="$4"
        backgroundColor= "#222121"
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
            Tap
          </Paragraph>
          <SearchBar />
        </XStack>
        {/* <Image src="" width={30} height={30} borderRadius={20} /> */}
        <XStack backgroundColor="$black050" borderRadius="$10" px="$4" py="$1" borderColor="$white" borderWidth={1}>
          <Paragraph fontWeight={400}>
            Login
          </Paragraph>
        </XStack>
      </XStack>

      <XStack f={1}>
        <YStack
          ai="flex-start"
          brw={1}
          brc={theme.white075}
          pl="$6"
          pr="$3"
          py="$0"
          gap="$1"
          $md={{
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
            <YStack>
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
      <SideMenuLink href="/" Icon={HomeIcons.Home} text="Home" />
      <SideMenuLink href="/trending" Icon={HomeIcons.Trending} text="Trending" />
      <SideMenuLink href="/explore" Icon={HomeIcons.Explore} text="Explore" />
    </>
  )
}

function SearchBar() {
  return (
    <XStack w="100%" maxWidth={400} marginLeft="$4">
      <Input
        placeholder="Search Farcaster"
        w="100%"
        size="$3"
        borderWidth={1}
        borderColor="$white075"
        borderRadius="$15"
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
    pl: "$2"
  },
})

const ToggleThemeLink = (props) => {
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
  text,
}: {
  subPaths?: string[]
  href: Href
  Icon: (typeof HomeIcons)['Home']
  text: string
}) => {
  const pathname = usePathname()
  const isActive = pathname === href || subPaths?.some((p) => pathname.startsWith(p))

  return (
    <Link asChild href={href}>
      <LinkContainer isActive={isActive}>
        <IconFrame>
          <Icon size={28} />
        </IconFrame>
        <LinkText>{text}</LinkText>
      </LinkContainer>
    </Link>
  )
}

const LinkText = styled(SizableText, {
  context: Context,
  userSelect: 'none',
  dsp: 'flex',
  f: 10,
  size: '$5',
  cur: 'pointer',
  $xs: {
    display: 'none',
  },

  variants: {
    isVertical: {
      true: {},
    },
  } as const,
})

const LinkContainer = styled(XStack, {
  context: Context,
  tag: 'a',
  className: 'text-decoration-none',
  gap: '$4',
  br: '$6',
  mt: '$2',
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
        px: '$2',
        py: '$2',

        $xs: {
          p: '$2',
          w: '$6',
          h: '$6',
          ai: 'center',
          jc: 'center',
        },
      },
    },
  } as const,
})