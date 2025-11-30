import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image } from "expo-image";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="contents" />
      <Stack.Screen name="row-counter" />
      <Stack.Screen name="stitch-counter" />
      <Stack.Screen name="pattern-converter" />
      <Stack.Screen name="size-guide" />
      <Stack.Screen name="yarn-guide" />
      <Stack.Screen name="needle-sizes" />
    </Stack>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('Preloading images...');
        await Promise.all([
          Image.prefetch(require('@/assets/images/landing_skein.png')),
          Image.prefetch(require('@/assets/images/background_yarn.png')),
          Image.prefetch(require('@/assets/images/dressmakers_dummy.png')),
          Image.prefetch(require('@/assets/images/nobackground_blue_skein.png')),
        ]);
        console.log('Images preloaded successfully');
      } catch (e) {
        console.error('Error preloading images:', e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      console.log('App ready, hiding splash');
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
