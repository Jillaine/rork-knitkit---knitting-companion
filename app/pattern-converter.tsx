// Replace the Image import source
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Layout, Typography } from '@/constants/theme';
import { ChevronDown } from 'lucide-react-native';

// Load local yarn image
const FOOTER_YARN_IMAGE = require('../assets/images/landing_skein.png');

export default function PatternConverterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ... all your state hooks and calculation functions remain the same ...

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />

      {/* Replace the URL with local image */}
      <Image
        source={FOOTER_YARN_IMAGE} 
        style={[styles.footerYarnBackground, { bottom: insets.bottom }]}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* all your content, input fields, buttons, and results boxes stay unchanged */}
        </View>
      </ScrollView>
    </View>
  );
}

// styles remain exactly the same as your previous PatternConverterPage
