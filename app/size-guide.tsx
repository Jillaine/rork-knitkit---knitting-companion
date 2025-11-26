import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout, Typography } from '@/constants/theme';
import { Picker } from '@react-native-picker/picker';

type Measurements = {
  bust: string;
  waist: string;
  hips: string;
  shoulder: string;
  armLength: string;
};

export default function SizeGuidePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [measurements, setMeasurements] = useState<Measurements>({
    bust: '36',
    waist: '28',
    hips: '38',
    shoulder: '15',
    armLength: '24',
  });

  const [ease, setEase] = useState<string>('7');

  const easeOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '14', '16', '18', '20'];

  const patternSizes = useMemo(() => {
    const easeNum = parseFloat(ease) || 0;
    const bustNum = parseFloat(measurements.bust) || 0;
    const waistNum = parseFloat(measurements.waist) || 0;
    const hipsNum = parseFloat(measurements.hips) || 0;
    const shoulderNum = parseFloat(measurements.shoulder) || 0;
    const armLengthNum = parseFloat(measurements.armLength) || 0;

    const inchesToCm = (inches: number) => Math.round(inches * 2.54);

    return {
      bust: { inches: bustNum + easeNum, cm: inchesToCm(bustNum + easeNum) },
      waist: { inches: waistNum + easeNum, cm: inchesToCm(waistNum + easeNum) },
      hips: { inches: hipsNum + easeNum, cm: inchesToCm(hipsNum + easeNum) },
      shoulder: { inches: shoulderNum + easeNum, cm: inchesToCm(shoulderNum + easeNum) },
      armLength: { inches: armLengthNum + easeNum, cm: inchesToCm(armLengthNum + easeNum) },
    };
  }, [measurements, ease]);

  const updateMeasurement = (key: keyof Measurements, value: string) => {
    setMeasurements(prev => ({ ...prev, [key]: value }));
  };

  const inchesToCm = (inches: string) => {
    const num = parseFloat(inches) || 0;
    return Math.round(num * 2.54);
  };

  const handleSave = () => {
    console.log('Saving measurements:', measurements, 'Ease:', ease);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <ImageBackground
        source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0nquajkzoofiscysfz6v9' }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>KNITKIT</Text>
            <View style={styles.divider} />
            <Text style={styles.pageTitle}>Size Guide</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Measurements</Text>

            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Bust:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={measurements.bust}
                  onChangeText={(text) => updateMeasurement('bust', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>in</Text>
                <Text style={styles.separator}>/</Text>
                <Text style={styles.convertedValue}>{inchesToCm(measurements.bust)}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>

            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Waist:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={measurements.waist}
                  onChangeText={(text) => updateMeasurement('waist', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>in</Text>
                <Text style={styles.separator}>/</Text>
                <Text style={styles.convertedValue}>{inchesToCm(measurements.waist)}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>

            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Hips:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={measurements.hips}
                  onChangeText={(text) => updateMeasurement('hips', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>in</Text>
                <Text style={styles.separator}>/</Text>
                <Text style={styles.convertedValue}>{inchesToCm(measurements.hips)}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>

            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Shoulder:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={measurements.shoulder}
                  onChangeText={(text) => updateMeasurement('shoulder', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>in</Text>
                <Text style={styles.separator}>/</Text>
                <Text style={styles.convertedValue}>{inchesToCm(measurements.shoulder)}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>

            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Arm Length:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={measurements.armLength}
                  onChangeText={(text) => updateMeasurement('armLength', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>in</Text>
                <Text style={styles.separator}>/</Text>
                <Text style={styles.convertedValue}>{inchesToCm(measurements.armLength)}</Text>
                <Text style={styles.unit}>cm</Text>
              </View>
            </View>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Positive Ease</Text>
            <Text style={styles.helperText}>Select ease for this project:</Text>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ease}
                onValueChange={(value: string) => setEase(value)}
                style={styles.picker}
              >
                {easeOptions.map(option => (
                  <Picker.Item key={option} label={`${option}"`} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Pattern Size</Text>
            
            <View style={styles.resultBox}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Bust + Ease:</Text>
                <Text style={styles.resultValue}>
                  {patternSizes.bust.inches}&quot; / {patternSizes.bust.cm} cm
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Waist + Ease:</Text>
                <Text style={styles.resultValue}>
                  {patternSizes.waist.inches}&quot; / {patternSizes.waist.cm} cm
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Hips + Ease:</Text>
                <Text style={styles.resultValue}>
                  {patternSizes.hips.inches}&quot; / {patternSizes.hips.cm} cm
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Shoulder + Ease:</Text>
                <Text style={styles.resultValue}>
                  {patternSizes.shoulder.inches}&quot; / {patternSizes.shoulder.cm} cm
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Arm Length + Ease:</Text>
                <Text style={styles.resultValue}>
                  {patternSizes.armLength.inches}&quot; / {patternSizes.armLength.cm} cm
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Size for Project</Text>
          </TouchableOpacity>

          <View style={styles.backSection}>
            <Text style={styles.ellipsis}>···</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.contentsLink}>Contents</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginBottom: Layout.spacing.xl * 2,
  },
  appTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading + 4,
    fontWeight: Typography.weights.semibold,
    color: Colors.charcoal,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.charcoal,
    marginBottom: Layout.spacing.lg,
  },
  dividerLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.charcoal,
    marginVertical: Layout.spacing.xl,
  },
  pageTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading - 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body + 1,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  helperText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body - 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  measurementLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  input: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    borderBottomWidth: 1,
    borderBottomColor: Colors.charcoal,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 40,
    textAlign: 'center',
  },
  unit: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body - 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
  separator: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body - 2,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    marginHorizontal: Layout.spacing.xs,
  },
  convertedValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    minWidth: 30,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.cream,
  },
  picker: {
    height: 50,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body + 2,
  },
  resultBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 16,
    padding: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
  resultValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.charcoal,
  },
  saveButton: {
    backgroundColor: Colors.black,
    borderRadius: 24,
    paddingVertical: Layout.spacing.md + 2,
    paddingHorizontal: Layout.spacing.xl,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  saveButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.cream,
  },
  backSection: {
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.xl * 1.5,
  },
  ellipsis: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading,
    color: Colors.charcoal,
    letterSpacing: 4,
  },
  contentsLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
});
