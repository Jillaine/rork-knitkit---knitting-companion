import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Layout, Typography } from '@/constants/theme';
import { ChevronDown } from 'lucide-react-native';

export default function PatternConverterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [patternGauge, setPatternGauge] = useState<string>('');
  const [yourGauge, setYourGauge] = useState<string>('');
  const [patternCastOn, setPatternCastOn] = useState<string>('');
  const [maxCastOn, setMaxCastOn] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);

  const [helperPatternGauge, setHelperPatternGauge] = useState<string>('');
  const [helperPatternSizes, setHelperPatternSizes] = useState<string>('');
  const [helperBody, setHelperBody] = useState<string>('');
  const [helperEase, setHelperEase] = useState<string>('');
  const [showHelperResults, setShowHelperResults] = useState<boolean>(false);
  const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState<boolean>(false);

  const calculateConversion = () => {
    if (!patternGauge || !yourGauge || !patternCastOn) return null;

    const pg = parseFloat(patternGauge);
    const yg = parseFloat(yourGauge);
    const pco = parseFloat(patternCastOn);

    if (isNaN(pg) || isNaN(yg) || isNaN(pco)) return null;

    const spiPattern = pg / 4;
    const patternInches = pco / spiPattern;
    const spiYou = yg / 4;
    const newCastOn = Math.round(patternInches * spiYou);
    const gaugeDifference = Math.abs(spiPattern - spiYou) / spiPattern;
    
    const gaugeAbsoluteDiff = Math.abs(spiPattern - spiYou);
    const isSmallGaugeDiff = gaugeAbsoluteDiff < 0.5;
    
    const maxCastOnValue = maxCastOn ? parseFloat(maxCastOn) : null;
    const exceedsMax = maxCastOnValue && !isNaN(maxCastOnValue) && newCastOn > maxCastOnValue;
    const withinMax = maxCastOnValue && !isNaN(maxCastOnValue) && newCastOn <= maxCastOnValue;

    return {
      spiPattern: spiPattern.toFixed(2),
      patternInches: patternInches.toFixed(1),
      spiYou: spiYou.toFixed(2),
      newCastOn,
      hasWarning: gaugeDifference > 0.1,
      isSmallGaugeDiff,
      exceedsMax,
      withinMax,
      maxCastOnValue,
    };
  };

  const calculateSizeHelper = () => {
    if (!helperPatternGauge || !helperPatternSizes || !helperBody || !helperEase) return null;

    const pg = parseFloat(helperPatternGauge);
    const body = parseFloat(helperBody);
    const ease = parseFloat(helperEase);

    if (isNaN(pg) || isNaN(body) || isNaN(ease)) return null;

    const spi = pg / 4;
    const target = body + ease;

    const sizes = helperPatternSizes
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));

    if (sizes.length === 0) return null;

    const sizesWithInches = sizes.map(castOn => ({
      castOn,
      finishedInches: castOn / spi,
    }));

    let closest = sizesWithInches[0];
    let minDiff = Math.abs(closest.finishedInches - target);

    sizesWithInches.forEach(size => {
      const diff = Math.abs(size.finishedInches - target);
      if (diff < minDiff) {
        minDiff = diff;
        closest = size;
      }
    });

    return {
      spi: spi.toFixed(2),
      target: target.toFixed(1),
      body,
      ease,
      sizes: sizesWithInches,
      closestCastOn: closest.castOn,
      closestInches: closest.finishedInches.toFixed(1),
    };
  };

  const results = showResults ? calculateConversion() : null;
  const helperResults = showHelperResults ? calculateSizeHelper() : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <Image
        source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/9t8sc84a5tl4d53krz3yf' }}
        style={[styles.footerYarnBackground, { bottom: insets.bottom }]}
        resizeMode="cover"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>KNITKIT</Text>
            <Text style={styles.sectionTitle}>Pattern Converter</Text>
            <Text style={styles.subtitle}>Adjust a pattern to work with a different yarn or gauge.</Text>
            
            <TouchableOpacity
              style={styles.collapsibleHeader}
              onPress={() => setIsHowItWorksExpanded(!isHowItWorksExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.collapsibleTitle}>How this works</Text>
              <ChevronDown
                size={18}
                color={Colors.charcoal}
                style={[
                  styles.chevron,
                  isHowItWorksExpanded && styles.chevronExpanded,
                ]}
              />
            </TouchableOpacity>
            
            {isHowItWorksExpanded && (
              <View style={styles.collapsibleContent}>
                <Text style={styles.bulletPoint}>• Enter the pattern gauge, your gauge, and the pattern cast-on.</Text>
                <Text style={styles.bulletPoint}>• We calculate the new cast-on stitches for your gauge.</Text>
                <Text style={styles.bulletPoint}>• If the gauge difference is small, we'll suggest just changing needle size.</Text>
                <Text style={styles.bulletPoint}>• Optionally enter a maximum cast-on and we'll warn you if the new number is too high.</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pattern gauge (sts / 4")</Text>
              <TextInput
                style={styles.input}
                value={patternGauge}
                onChangeText={setPatternGauge}
                placeholder="e.g., 20"
                placeholderTextColor={Colors.lightGray}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your gauge (sts / 4")</Text>
              <TextInput
                style={styles.input}
                value={yourGauge}
                onChangeText={setYourGauge}
                placeholder="e.g., 16"
                placeholderTextColor={Colors.lightGray}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pattern cast-on (sts)</Text>
              <TextInput
                style={styles.input}
                value={patternCastOn}
                onChangeText={setPatternCastOn}
                placeholder="e.g., 120"
                placeholderTextColor={Colors.lightGray}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Maximum cast-on stitches you're willing to do (optional)</Text>
              <TextInput
                style={styles.input}
                value={maxCastOn}
                onChangeText={setMaxCastOn}
                placeholder="e.g., 200"
                placeholderTextColor={Colors.lightGray}
                keyboardType="number-pad"
              />
            </View>

            <Button
              label="Convert"
              onPress={() => setShowResults(true)}
              fullWidth
            />

            {results && (
              <View style={styles.resultsBox}>
                <Text style={styles.resultsTitle}>Results</Text>
                <Text style={styles.resultText}>Pattern stitches per inch: {results.spiPattern}</Text>
                <Text style={styles.resultText}>Pattern body width: {results.patternInches}" (approx)</Text>
                <Text style={styles.resultText}>Your stitches per inch: {results.spiYou}</Text>
                {!results.exceedsMax && (
                  <Text style={[styles.resultText, styles.highlightResult]}>
                    New cast-on: {results.newCastOn} sts (approx)
                    {results.withinMax && ` – within your maximum of ${results.maxCastOnValue} sts.`}
                  </Text>
                )}
                {results.exceedsMax && (
                  <Text style={styles.maxWarningText}>
                    New cast-on: {results.newCastOn} sts (approx), which is over your maximum of {results.maxCastOnValue} sts. This yarn/gauge probably won't work for this pattern.
                  </Text>
                )}
                {results.isSmallGaugeDiff && (
                  <Text style={styles.helperInfoText}>
                    Your gauge is very close to the pattern gauge. Instead of changing the stitch count, try going up or down one needle size and swatch again.
                  </Text>
                )}
                {results.hasWarning && !results.isSmallGaugeDiff && (
                  <Text style={styles.warningText}>
                    Note: Your gauge differs significantly from the pattern. Check fit carefully.
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Pattern Size</Text>
            <Text style={styles.helperSubtitle}>Size helper (optional)</Text>
            <Text style={styles.subtitle}>Figure out which written size is closest to your body + ease.</Text>

            <View style={styles.sectionSpacer} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pattern Gauge (sts / 4")</Text>
              <TextInput
                style={styles.input}
                value={helperPatternGauge}
                onChangeText={setHelperPatternGauge}
                placeholder="e.g., 13"
                placeholderTextColor={Colors.lightGray}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pattern Sizes (Cast-on sts)</Text>
              <TextInput
                style={styles.input}
                value={helperPatternSizes}
                onChangeText={setHelperPatternSizes}
                placeholder="e.g., 130, 138, 146, 154"
                placeholderTextColor={Colors.lightGray}
                keyboardType="numbers-and-punctuation"
              />
              <Text style={styles.helperText}>(comma-separated)</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Body (inches)</Text>
              <TextInput
                style={styles.input}
                value={helperBody}
                onChangeText={setHelperBody}
                placeholder="e.g., 35"
                placeholderTextColor={Colors.lightGray}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Desired Ease (inches)</Text>
              <TextInput
                style={styles.input}
                value={helperEase}
                onChangeText={setHelperEase}
                placeholder="e.g., 10"
                placeholderTextColor={Colors.lightGray}
                keyboardType="decimal-pad"
              />
            </View>

            <Button
              label="Suggest Size"
              onPress={() => setShowHelperResults(true)}
              fullWidth
            />

            {helperResults && (
              <View style={styles.resultsBox}>
                <Text style={styles.resultsTitle}>Size Suggestions</Text>
                <Text style={styles.resultText}>Pattern stitches per inch: {helperResults.spi}</Text>
                <Text style={styles.resultText}>
                  Target finished size: {helperResults.target}" ({helperResults.body} body + {helperResults.ease} ease)
                </Text>

                <View style={styles.sizesList}>
                  {helperResults.sizes.map((size) => (
                    <View
                      key={size.castOn}
                      style={[
                        styles.sizeRow,
                        size.castOn === helperResults.closestCastOn && styles.sizeRowHighlight,
                      ]}
                    >
                      <Text style={styles.sizeText}>
                        {size.castOn} sts → ~{size.finishedInches.toFixed(1)}"
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.resultText, styles.highlightResult]}>
                  Suggested pattern size: {helperResults.closestCastOn} stitches (~{helperResults.closestInches}"), closest to your target {helperResults.target}".
                </Text>
              </View>
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
    paddingBottom: 120,
    zIndex: 1,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  pageTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.title - 6,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading - 2,
    fontWeight: Typography.weights.semibold,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  helperSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.helper,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionSpacer: {
    height: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.black,
    marginVertical: Layout.spacing.xxl,
  },
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.regular,
    color: Colors.black,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    color: Colors.black,
  },
  helperText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.helper,
    color: Colors.charcoal,
    marginTop: Layout.spacing.xs,
    textAlign: 'center',
  },
  resultsBox: {
    marginTop: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Layout.spacing.md,
    backgroundColor: Colors.cream,
  },
  resultsTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body + 2,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    marginBottom: Layout.spacing.md,
  },
  resultText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    color: Colors.charcoal,
    marginBottom: Layout.spacing.sm,
    lineHeight: 20,
  },
  highlightResult: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    marginTop: Layout.spacing.sm,
  },
  warningText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.helper,
    color: Colors.charcoal,
    marginTop: Layout.spacing.sm,
  },
  maxWarningText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
    color: Colors.charcoal,
    marginTop: Layout.spacing.sm,
    lineHeight: 20,
  },
  helperInfoText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.helper,
    color: Colors.charcoal,
    marginTop: Layout.spacing.sm,
    lineHeight: 18,
  },
  sizesList: {
    marginVertical: Layout.spacing.md,
    gap: Layout.spacing.xs,
  },
  sizeRow: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.spacing.sm,
  },
  sizeRowHighlight: {
    backgroundColor: '#F5F4F1',
    borderWidth: 1,
    borderColor: Colors.charcoal,
  },
  sizeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    color: Colors.charcoal,
  },
  backSection: {
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.xxl,
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
  footerYarnBackground: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    width: '150%',
    height: 180,
    marginLeft: '-75%',
    zIndex: 0,
    backgroundColor: Colors.cream,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.xs,
    marginTop: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
  },
  collapsibleTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
  },
  chevron: {
    transition: 'transform 0.2s',
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  collapsibleContent: {
    marginTop: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  bulletPoint: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label - 1,
    color: Colors.charcoal,
    lineHeight: 20,
  },
});
