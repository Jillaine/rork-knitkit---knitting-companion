import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Layout, Typography } from '@/constants/theme';

// Load local background image
const BACKGROUND_IMAGE = require('../assets/images/background_yarn.png');

export default function ContentsPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background: image + overlay, behind everything */}
      <View style={styles.backgroundWrapper}>
        <Image source={BACKGROUND_IMAGE} style={styles.backgroundImage} />
        <View style={styles.overlay} />
      </View>

      {/* Content always on top */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>KNITKIT</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>CONTENTS</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.linkList}>
            <Pressable
              style={({ pressed }) => [
                styles.linkItem,
                pressed && styles.linkItemPressed,
              ]}
              onPress={() => router.push('/row-counter')}
            >
              <Text style={styles.linkText}>Row / Stitch Counter</Text>
            </Pressable>
            <View style={styles.divider} />

            <Pressable
              style={({ pressed }) => [
                styles.linkItem,
                pressed && styles.linkItemPressed,
              ]}
              onPress={() => router.push('/size-guide')}
            >
              <Text style={styles.linkText}>Size Guide</Text>
            </Pressable>
            <View style={styles.divider} />

            <Pressable
              style={({ pressed }) => [
                styles.linkItem,
                pressed && styles.linkItemPressed,
              ]}
              onPress={() => router.push('/yarn-guide')}
            >
              <Text style={styles.linkText}>Yarn Guide</Text>
            </Pressable>
            <View style={styles.divider} />

            <Pressable
              style={({ pressed }) => [
                styles.linkItem,
                pressed && styles.linkItemPressed,
              ]}
              onPress={() => router.push('/needle-sizes')}
            >
              <Text style={styles.linkText}>Needle Sizes</Text>
            </Pressable>
            <View style={styles.divider} />

            <Pressable
              style={({ pressed }) => [
                styles.linkItem,
                pressed && styles.linkItemPressed,
              ]}
              onPress={() => router.push('/pattern-converter')}
            >
              <Text style={styles.linkText}>Pattern Converter</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.backLink,
              pressed && styles.backLinkPressed,
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.backLinkText}>‹ Back to Counter</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F3',
  },

  // Full-screen wrapper that holds image + overlay only
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    zIndex: 0,
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.6,
    transform: [{ translateY: -10 }],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 246, 243, 0.55)',
  },

  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    paddingVertical: Platform.OS === 'web' ? 40 : 60,
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: 240,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    justifyContent: 'space-between',
    paddingBottom: Layout.spacing.xl,
    position: 'relative',
    zIndex: 2,
  },

  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },

  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.title + 4,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },

  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading - 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    letterSpacing: 2,
    textAlign: 'center',
    marginVertical: Layout.spacing.lg,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.black,
  },

  linkList: {
    justifyContent: 'flex-start',    // start at top
  paddingVertical: Layout.spacing.lg,
  
  },

  linkItem: {
    paddingVertical: Layout.spacing.xl,
    alignItems: 'center',
  },

  linkItemPressed: {
    opacity: 0.5,
  },

  linkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.black,
    textAlign: 'center',
  },

  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
  },

  backLinkPressed: {
    opacity: 0.6,
  },

  backLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body - 2,
    fontWeight: Typography.weights.regular,
    color: Colors.black,
    marginLeft: Layout.spacing.xs,
  },
});