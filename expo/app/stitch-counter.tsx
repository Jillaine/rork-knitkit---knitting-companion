import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Layout, Typography } from '@/constants/theme';

const STORAGE_KEY = 'stitch_counter_main';

interface StitchCountData {
  counter_id: string;
  stitch_value: number;
  total_stitches: number;
  step: number;
}

export default function StitchCounterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStitch, setCurrentStitch] = useState<number>(0);
  const [totalStitches, setTotalStitches] = useState<number>(100);
  const [step, setStep] = useState<number>(1);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const [showStepModal, setShowStepModal] = useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSavedValues();
  }, []);

  const loadSavedValues = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StitchCountData = JSON.parse(stored);
        if (typeof data.stitch_value === 'number') {
          setCurrentStitch(data.stitch_value);
        }
        if (typeof data.total_stitches === 'number') {
          setTotalStitches(data.total_stitches);
        }
        if (typeof data.step === 'number') {
          setStep(data.step);
        }
      }
    } catch (error) {
      console.error('Error loading stitch counter data:', error);
    }
  };

  const saveCurrentStitch = async () => {
    try {
      const dataToSave: StitchCountData = {
        counter_id: 'main_counter',
        stitch_value: currentStitch,
        total_stitches: totalStitches,
        step: step,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      showSavedConfirmation();
    } catch (error) {
      console.error('Error saving stitch counter data:', error);
    }
  };

  const showSavedConfirmation = () => {
    setShowSaved(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1300),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSaved(false));
  };

  const increment = useCallback(() => {
    setCurrentStitch(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCurrentStitch(prev => Math.max(prev - step, 0));
  }, [step]);

  const progress = totalStitches > 0 ? currentStitch / totalStitches : 0;

  const stepOptions = [1, 2, 5, 10, 20];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>STITCHES</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.counterSection}>
            <Text style={styles.counterNumber}>{currentStitch}</Text>
            <Text style={styles.counterSubtext}>of {totalStitches}</Text>
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              onPress={decrement}
              style={({ pressed }) => [
                styles.controlButton,
                styles.controlButtonLeft,
                pressed && styles.controlButtonPressed,
              ]}
            >
              <Text style={styles.controlButtonText}>−</Text>
            </Pressable>
            <Pressable
              onPress={increment}
              style={({ pressed }) => [
                styles.controlButton,
                styles.controlButtonRight,
                pressed && styles.controlButtonPressed,
              ]}
            >
              <Text style={styles.controlButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.countBySection}>
            <Text style={styles.countByLabel}>Count by</Text>
            <Pressable
              onPress={() => setShowStepModal(true)}
              style={({ pressed }) => [
                styles.countByPill,
                pressed && styles.countByPillPressed,
              ]}
            >
              <Text style={styles.countByText}>{step}</Text>
            </Pressable>
          </View>

          <View style={styles.saveSection}>
            <Button
              label="Save Current Stitch"
              onPress={saveCurrentStitch}
              fullWidth
            />
            {showSaved && (
              <Animated.View style={[styles.savedConfirmation, { opacity: fadeAnim }]}>
                <Text style={styles.savedText}>Saved ✓</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.backSection}>
            <Text style={styles.ellipsis}>···</Text>
            <Button
              label="Contents"
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showStepModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStepModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowStepModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Count by</Text>
            <View style={styles.stepOptions}>
              {stepOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setStep(option);
                    setShowStepModal(false);
                  }}
                  style={({ pressed }) => [
                    styles.stepOption,
                    step === option && styles.stepOptionSelected,
                    pressed && styles.stepOptionPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepOptionText,
                      step === option && styles.stepOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Platform.OS === 'web' ? 40 : 20,
    paddingHorizontal: Layout.spacing.xl,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl * 2,
  },
  pageTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.charcoal,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  progressContainer: {
    width: '100%',
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.lightGray,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.charcoal,
  },
  counterSection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl * 1.5,
  },
  counterNumber: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.counter,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    marginBottom: Layout.spacing.xs,
  },
  counterSubtext: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body + 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  controlButton: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  controlButtonLeft: {},
  controlButtonRight: {},
  controlButtonPressed: {
    backgroundColor: '#F5F4F1',
  },
  controlButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 28,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  countBySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.xl * 1.5,
  },
  countByLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
  countByPill: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    minWidth: 60,
    alignItems: 'center',
  },
  countByPillPressed: {
    backgroundColor: '#F5F4F1',
  },
  countByText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  saveSection: {
    marginBottom: Layout.spacing.xxl * 2,
    position: 'relative',
  },
  savedConfirmation: {
    position: 'absolute',
    bottom: -32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  savedText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    color: Colors.charcoal,
  },
  backSection: {
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  ellipsis: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading,
    color: Colors.charcoal,
    letterSpacing: 4,
  },
  backButton: {
    paddingHorizontal: Layout.spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cream,
    borderRadius: Layout.borderRadius,
    padding: Layout.spacing.xl,
    maxWidth: 280,
    width: '80%',
  },
  modalTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading - 2,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  stepOptions: {
    gap: Layout.spacing.sm,
  },
  stepOption: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
  },
  stepOptionSelected: {
    backgroundColor: Colors.black,
  },
  stepOptionPressed: {
    backgroundColor: '#F5F4F1',
  },
  stepOptionText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  stepOptionTextSelected: {
    color: Colors.cream,
  },
});
