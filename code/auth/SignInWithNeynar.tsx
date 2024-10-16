import { useEffect } from 'react';
import { Button } from 'tamagui';
import { Stack } from 'one';

interface SIWNUser {
  username: string;
  display_name: string;
  profile: {
    bio: {
      text: string;
    };
  };
  verifications: string[];
  pfp_url: string;
}

interface SIWNResponseData {
  fid: string;
  is_authenticated: boolean;
  signer_permissions: string[];
  signer_uuid: string;
  user: SIWNUser;
}

export default () => <SignInWithNeynar />;

function SignInWithNeynar() {
  const neynarClientId = process.env.NEYNAR_CLIENT_ID!;

  const handleSignInSuccess = (data: SIWNResponseData) => {
    console.log('Sign-in successful:', data);
  };

  useEffect(() => {
    (window as any).onSignInSuccess = handleSignInSuccess;
    return () => {
      delete (window as any).onSignInSuccess;
    };
  }, []);

  const initiateSignIn = () => {
    const signInWindow = window.open(
      `https://app.neynar.com/login?client_id=${neynarClientId}`,
      'neynar-signin',
      'width=600,height=700'
    );

    if (signInWindow) {
      const signInListener = (event: MessageEvent) => {
        if (event.origin === 'https://app.neynar.com') {
          try {
            const parsedData: SIWNResponseData =
              typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            handleSignInSuccess(parsedData);
          } catch (error) {
            console.error('Failed to parse message data:', error);
          }
          window.removeEventListener('message', signInListener);
          signInWindow.close();
        }
      };
      window.addEventListener('message', signInListener);
    }
  };

  return (
    <Button size="$3" maxWidth="20%" themeInverse onPress={initiateSignIn}>
      Sign In
    </Button>
  );
}