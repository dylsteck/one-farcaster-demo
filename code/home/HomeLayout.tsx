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
} from 'tamagui'
import { type Href, Link, Slot, usePathname } from 'one'
import { Logo } from '../brand/Logo'
import { useToggleTheme } from '../theme/ToggleThemeButton'
import { HomeIcons } from './HomeIcons'
import LandingPage from '../auth/LandingPage'

const Context = createStyledContext({
  isVertical: false,
})

export function HomeLayout() {
  const loggedIn = false
  const media = useMedia()
  const pathname = usePathname()
  const renderPageName = () => {
    const pages = [
      {
        path: '/',
        name: 'Home',
      },
      {
        path: '/search',
        name: 'Search',
      },
      {
        path: '/notifications',
        name: 'Notifications',
      },
      {
        path: '/profile',
        name: 'Profile',
      },
    ]

    const currentPage = pages.find((page) => page.path === pathname)

    return currentPage ? currentPage.name : 'Page Not Found'
  }
  const name = renderPageName()

  if (!loggedIn) {
    return <LandingPage />
  }

  return (
    <Context.Provider isVertical={isTouchable}>
      {isTouchable || media.sm ? <HomeLayoutTouch name={name} /> : <HomeLayoutMouse name={name} />}
    </Context.Provider>
  )
}

function HomeLayoutTouch({ name }: { name: string }) {
  return (
    <YStack f={1}>
      <XStack ai="center" jc="space-between" px="$4" bbc="$borderColor" bbw={1}>
        <Paragraph fontSize={20} fontWeight={600}>
          {name}
        </Paragraph>
        <ToggleThemeLink f={0} />
      </XStack>

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
        backgroundColor="$background"
        px="$4"
      >
        <NavLinks />
      </XStack>
    </YStack>
  )
}

function HomeLayoutMouse({ name }: { name: string }) {
  const [activePill, setActivePill] = useState('Priority')
  const pillNames = ['Priority', 'Channels', 'Mentions', 'Likes', 'Follows', 'Other']
  return (
    <XStack f={1} mah="100vh">
      <YStack
        ai="flex-start"
        brw={1}
        brc="$borderColor"
        pl="$12"
        pr="$3"
        py="$0"
        gap="$1"
        $sm={{
          display: 'none',
        }}
      >
        <YStack>
          <Logo />
          <NavLinks />
        </YStack>
        <View flex={1} />
        <YStack ai="flex-start">
          <ToggleThemeLink f={0} />
        </YStack>
      </YStack>

      <YStack f={7} maw="100%" $sm={{ f: 1 }}>
        <ScrollView>
          <YStack bbc="$borderColor" bbw={1} brw={1} brc="$borderColor" maxWidth="60%" display="flex" flexDirection="column" gap="$2" alignItems="flex-start">
            <XStack ai="center" jc="space-between" px="$4" mt="$3" mb={name === 'Notifications' ? '$1.5' : '$3'}>
              <Paragraph fontSize={20} fontWeight={600} flex={1}>
                {name}
              </Paragraph>
            </XStack>
            {name === 'Notifications' ? (
              <XStack ai="center" jc="flex-start" gap="$2" px="$3" py="$2" mb="$1.5">
                {pillNames.map((pill) => (
                  <YStack
                    key={pill}
                    px="$3"
                    py="$1.5"
                    br={50}
                    borderColor="$borderColor"
                    borderWidth={1}
                    onPress={() => setActivePill(pill)}
                    cursor="pointer"
                    backgroundColor={pill === activePill ? '$color9' : 'transparent'}
                  >
                    <Paragraph fontSize={16} fontWeight={pill === activePill ? 700 : 500} color={pill === activePill ? 'white' : '$textColor'}>
                      {pill}
                    </Paragraph>
                  </YStack>
                ))}
              </XStack>
            ) : (
              <></>
            )}
          </YStack>
          <Slot />
        </ScrollView>
      </YStack>
    </XStack>
  )
}

function NavLinks() {
  return (
    <>
      <SideMenuLink href="/" subPaths={['/post/']} Icon={HomeIcons.Home} />
      <SideMenuLink href="/search" Icon={HomeIcons.Search} />
      <SideMenuLink href="/notifications" Icon={HomeIcons.Notifications} />
      <SideMenuLink href="/profile" Icon={HomeIcons.User} />
    </>
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
  children,
}: {
  subPaths?: string[]
  href: Href
  Icon: (typeof HomeIcons)['Home']
  children: ReactNode
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