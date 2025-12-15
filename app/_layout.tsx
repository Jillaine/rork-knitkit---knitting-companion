import { Stack } from "expo-router";
import Head from "expo-router/head";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2F4F4F" />
      </Head>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="contents" />
        <Stack.Screen name="needle-sizes" />
        <Stack.Screen name="pattern-converter" />
        <Stack.Screen name="row-counter" />
        <Stack.Screen name="size-guide" />
        <Stack.Screen name="stitch-counter" />
        <Stack.Screen name="yarn-guide" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
