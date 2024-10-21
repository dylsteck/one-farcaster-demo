import {
    type FarcasterSigner,
    signFrameAction,
  } from "@frames.js/render/farcaster";
  import { useFrame } from "@frames.js/render/use-frame";
  import { fallbackFrameContext } from "@frames.js/render";
  import {
    FrameUI,
    type FrameUIComponents,
    type FrameUITheme,
  } from "@frames.js/render/ui";
  import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
  import { View, Button, Text, Image, Spinner, XStack } from "tamagui";
  import { useEffect, useState } from "react";
  import { PROD_URL } from "../api/utils";
  
  type StylingProps = {
    style?: ImageStyle | TextStyle | ViewStyle;
  };
  
  const components: FrameUIComponents<StylingProps> = {
    ImageContainer(props, stylingProps) {
      return (
        <View
          width={350}
          height={350}
          style={{
            aspectRatio:
              typeof props.aspectRatio === "string" || props.aspectRatio === "auto"
                ? props.aspectRatio
                : props.aspectRatio
                ? props.aspectRatio
                : "1", 
            ...stylingProps.style,
          }}
        >
          {props.image ? (
            typeof props.image === "string" ? (
              <Image
                source={{ uri: props.image }} 
                style={{ width: 300, height: 300 }} 
                resizeMode="cover"
                borderRadius={20} 
              />
            ) : (
              props.image
            )
          ) : null}
          {props.messageTooltip && (
            <Text style={{ textAlign: "center", paddingTop: 10 }}>
              {props.messageTooltip}
            </Text>
          )}
        </View>
      );
    },
    ButtonsContainer(props, stylingProps) {
      return (
        <XStack space alignItems="center" justifyContent="center" mt="$2">
          {props.buttons.map((button, index) => (
            <View key={index} style={{ marginHorizontal: 10 }}>
              {button}
            </View>
          ))}
        </XStack>
      );
    },
    Button(props, stylingProps) {
      return (
        <Button
          onPress={props.onPress}
          style={{
            backgroundColor: props.isDisabled ? "gray" : "blue",
            padding: 10,
            borderRadius: 5,
            opacity: props.isDisabled ? 0.6 : 1,
            ...stylingProps.style,
          }}
          disabled={props.isDisabled}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {props.frameButton.label || "Button"}
          </Text>
        </Button>
      );
    },
    LoadingScreen(props) {
      return (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "gray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size="large" color="white" />
          <Text style={{ color: "white", paddingTop: 10 }}>Loading...</Text>
        </View>
      );
    },
  };
  

  const theme: FrameUITheme<StylingProps> = {
    Root: {
      style: {
        position: "relative",
      } satisfies ViewStyle,
    },
    LoadingScreen: {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "gray",
        zIndex: 10,
        justifyContent: "center",
        alignItems: "center",
      } satisfies ViewStyle,
    },
  };
  
  export default function Frame({ url }:  { url: string }) {
    const [loading, setLoading] = useState(true);
  
    // @TODO: replace with your farcaster signer
    const farcasterSigner: FarcasterSigner = {
      fid: 1,
      status: "approved",
      publicKey:
        "0x00000000000000000000000000000000000000000000000000000000000000000",
      privateKey:
        "0x00000000000000000000000000000000000000000000000000000000000000000",
    };
  
    const frameState = useFrame({
      homeframeUrl: url,
      frameActionProxy: `${PROD_URL}/api/v1/frames`,
      frameGetProxy: `${PROD_URL}/api/v1/frames`,
      connectedAddress: undefined,
      frameContext: fallbackFrameContext,
      signerState: {
        hasSigner: farcasterSigner.status === "approved",
        signer: farcasterSigner,
        isLoadingSigner: false,
        async onSignerlessFramePress() {
          console.log(
            "A frame button was pressed without a signer. Perhaps you want to prompt a login"
          );
        },
        signFrameAction,
        async logout() {
          console.log("logout");
        },
      },
    });
  
    useEffect(() => {
      if (frameState && frameState.homeframeUrl) {
        setLoading(false);
      }
    }, [frameState]);
  
    return (
      <View style={{ alignItems: 'flex-start' }}>
        {!loading ? (
          <FrameUI frameState={frameState as unknown as any} components={components} theme={theme} />
        ) : (
          components.LoadingScreen && (
            <components.LoadingScreen frameState={frameState as unknown as any} dimensions={{ width: 350, height: 350 }} />
          )
        )}
      </View>
    );
  }  