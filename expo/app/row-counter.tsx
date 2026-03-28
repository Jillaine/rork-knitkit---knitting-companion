import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Animated, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Layout, Typography } from '@/constants/theme';

const STORAGE_KEY_ROW = 'row_counter_main';
const STORAGE_KEY_STITCH = 'stitch_counter_main';

interface RowCountData {
  counter_id: string;
  row_value: number;
  total_rows: number;
}

interface StitchCountData {
  counter_id: string;
  stitch_value: number;
  total_stitches: number;
  step: number;
}

export default function RowCounterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [totalRows, setTotalRows] = useState<number>(150);
  const [totalRowsInput, setTotalRowsInput] = useState<string>('150');
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const [currentStitch, setCurrentStitch] = useState<number>(0);
  const [totalStitches, setTotalStitches] = useState<number>(100);
  const [totalStitchesInput, setTotalStitchesInput] = useState<string>('100');
  const [step, setStep] = useState<number>(1);
  const [showStitchSaved, setShowStitchSaved] = useState<boolean>(false);
  const fadeAnimStitch = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSavedValues();
  }, []);

  const loadSavedValues = async () => {
    try {
      const storedRow = await AsyncStorage.getItem(STORAGE_KEY_ROW);
      if (storedRow) {
        const data: RowCountData = JSON.parse(storedRow);
        if (typeof data.row_value === 'number') {
          setCurrentRow(data.row_value);
        }
        if (typeof data.total_rows === 'number') {
          setTotalRows(data.total_rows);
          setTotalRowsInput(data.total_rows.toString());
        }
      }

      const storedStitch = await AsyncStorage.getItem(STORAGE_KEY_STITCH);
      if (storedStitch) {
        const data: StitchCountData = JSON.parse(storedStitch);
        if (typeof data.stitch_value === 'number') {
          setCurrentStitch(data.stitch_value);
        }
        if (typeof data.total_stitches === 'number') {
          setTotalStitches(data.total_stitches);
          setTotalStitchesInput(data.total_stitches.toString());
        }
        if (typeof data.step === 'number') {
          setStep(data.step);
        }
      }
    } catch (error) {
      console.error('Error loading counter data:', error);
    }
  };

  const saveCurrentRow = async () => {
    try {
      const dataToSave: RowCountData = {
        counter_id: 'main_counter',
        row_value: currentRow,
        total_rows: totalRows,
      };
      await AsyncStorage.setItem(STORAGE_KEY_ROW, JSON.stringify(dataToSave));
      showSavedConfirmation();
    } catch (error) {
      console.error('Error saving row counter data:', error);
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
      await AsyncStorage.setItem(STORAGE_KEY_STITCH, JSON.stringify(dataToSave));
      showStitchSavedConfirmation();
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

  const showStitchSavedConfirmation = () => {
    setShowStitchSaved(true);
    Animated.sequence([
      Animated.timing(fadeAnimStitch, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1300),
      Animated.timing(fadeAnimStitch, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowStitchSaved(false));
  };

  const increment = useCallback(() => {
    setCurrentRow(prev => Math.min(prev + 1, totalRows));
  }, [totalRows]);

  const decrement = useCallback(() => {
    setCurrentRow(prev => Math.max(prev - 1, 0));
  }, []);

  const incrementStitch = useCallback(() => {
    setCurrentStitch(prev => prev + step);
  }, [step]);

  const decrementStitch = useCallback(() => {
    setCurrentStitch(prev => Math.max(prev - step, 0));
  }, [step]);

  const handleTotalRowsChange = (text: string) => {
    setTotalRowsInput(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalRows(parsed);
    }
  };

  const handleTotalStitchesChange = (text: string) => {
    setTotalStitchesInput(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalStitches(parsed);
    }
  };

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  const progress = totalRows > 0 ? currentRow / totalRows : 0;
  const progressStitch = totalStitches > 0 ? currentStitch / totalStitches : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>ROWS</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.counterSection}>
            <Text style={styles.counterNumber}>{currentRow}</Text>
            <View style={styles.counterSubtextRow}>
              <Text style={styles.counterSubtext}>of </Text>
              <TextInput
                style={styles.totalInput}
                value={totalRowsInput}
                onChangeText={handleTotalRowsChange}
                keyboardType="number-pad"
                selectTextOnFocus
              />
            </View>
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

          <View style={styles.saveSection}>
            <Button
              label="Save Current Row"
              onPress={saveCurrentRow}
              fullWidth
            />
            {showSaved && (
              <Animated.View style={[styles.savedConfirmation, { opacity: fadeAnim }]}>
                <Text style={styles.savedText}>Saved ✓</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.header}>
            <Text style={styles.pageTitle}>STITCHES</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressStitch * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.counterSection}>
            <Text style={styles.counterNumber}>{currentStitch}</Text>
            <View style={styles.counterSubtextRow}>
              <Text style={styles.counterSubtext}>of </Text>
              <TextInput
                style={styles.totalInput}
                value={totalStitchesInput}
                onChangeText={handleTotalStitchesChange}
                keyboardType="number-pad"
                selectTextOnFocus
              />
            </View>
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              onPress={decrementStitch}
              style={({ pressed }) => [
                styles.controlButton,
                styles.controlButtonLeft,
                pressed && styles.controlButtonPressed,
              ]}
            >
              <Text style={styles.controlButtonText}>−</Text>
            </Pressable>
            <Pressable
              onPress={incrementStitch}
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
            <View style={styles.stepButtonsRow}>
              {[1, 10, 20, 50].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => handleStepChange(value)}
                  style={({ pressed }) => [
                    styles.stepButton,
                    step === value && styles.stepButtonActive,
                    pressed && styles.controlButtonPressed,
                  ]}
                >
                  <Text style={[
                    styles.stepButtonText,
                    step === value && styles.stepButtonTextActive,
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.saveSection}>
            <Button
              label="Save Current Stitch"
              onPress={saveCurrentStitch}
              fullWidth
            />
            {showStitchSaved && (
              <Animated.View style={[styles.savedConfirmation, { opacity: fadeAnimStitch }]}>
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
    marginBottom: Layout.spacing.xl * 1.5,
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
  counterSubtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalInput: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body + 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    borderBottomWidth: 1,
    borderBottomColor: Colors.charcoal,
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 50,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.charcoal,
    marginVertical: Layout.spacing.xxl * 2,
    opacity: 0.3,
  },
  countBySection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl * 1.5,
    marginTop: -Layout.spacing.md,
  },
  countByLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    marginBottom: Layout.spacing.sm,
    letterSpacing: 1,
  },
  stepButtonsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  stepButton: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonActive: {
    backgroundColor: Colors.charcoal,
  },
  stepButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
  stepButtonTextActive: {
    color: Colors.cream,
  },
});
