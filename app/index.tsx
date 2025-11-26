import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Typography } from '@/constants/theme';

const YARN_IMAGE_URL = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ef5yu9zcuyqs8z9e8raox';

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: YARN_IMAGE_URL }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>KnitKit</Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.push('/contents')}
          >
            <Text style={styles.buttonText}>START</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 112,
    fontWeight: Typography.weights.bold,
    color: '#e8e5dd',
    letterSpacing: 4,
    textAlign: 'center',
    position: 'absolute',
    top: '30%',
    transform: [{ translateY: -56 }],
  },
  button: {
    backgroundColor: '#e8e5dd',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 80,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 24,
    fontWeight: Typography.weights.semibold,
    color: '#2c2c2c',
    letterSpacing: 2,
  },
});
