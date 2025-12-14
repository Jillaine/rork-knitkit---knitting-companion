import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const blueSkeinImage = require('../assets/images/nobackground_blue_skein.png');

export default function PatternConverterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Top converter
  const [patternGauge, setPatternGauge] = useState('');
  const [yourGauge, setYourGauge] = useState('');
  const [patternCastOn, setPatternCastOn] = useState('');
  const [maxCastOn, setMaxCastOn] = useState('');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [convertedStitches, setConvertedStitches] = useState<number | null>(null);
  const [convertSummary, setConvertSummary] = useState<string | null>(null);

  // Size helper
  const [sizePatternGauge, setSizePatternGauge] = useState('');
  const [sizePatternSizes, setSizePatternSizes] = useState('');
  const [sizeBody, setSizeBody] = useState('');
  const [sizeEase, setSizeEase] = useState('');
  const [suggestedSize, setSuggestedSize] = useState<string | null>(null);

  const handleConvert = () => {
    const pg = parseFloat(patternGauge);
    const yg = parseFloat(yourGauge);
    const castOn = parseFloat(patternCastOn);
    const maxVal = maxCastOn ? parseFloat(maxCastOn) : null;

    if (isNaN(pg) || isNaN(yg) || isNaN(castOn) || pg <= 0 || yg <= 0) {
      alert('Please enter valid numbers for gauges and cast-on.');
      return;
    }

    // Pattern + your stitches per inch
    const patternStsPerInch = pg / 4;
    const yourStsPerInch = yg / 4;

    // Pattern body width in inches
    const patternBodyWidth = castOn / patternStsPerInch;

    // New cast-on for your gauge
    const newCastOn = Math.round(patternBodyWidth * yourStsPerInch);
    setConvertedStitches(newCastOn);

    // Build base lines
    const gaugeDiff = Math.abs(patternStsPerInch - yourStsPerInch);
    const hasMax = maxVal !== null && !isNaN(maxVal);

    let mainLine = '';
    let noteLine: string | null = null;

    if (gaugeDiff < 0.25) {
      // Very close gauge — suggest needle size change
      mainLine = `New cast-on: ${newCastOn} sts (approx)${
        hasMax ? ` – within your maximum of ${maxVal} sts.` : '.'
      }`;
      noteLine =
        'Your gauge is very close to the pattern gauge. Instead of changing the stitch count, try going up or down one needle size and swatch again.';
    } else if (hasMax && newCastOn > (maxVal as number)) {
      // Over maximum cast-on
      mainLine = `New cast-on: ${newCastOn} sts (approx), which is over your maximum of ${maxVal} sts. This yarn/gauge probably won't work for this pattern.`;
      noteLine =
        'Note: Your gauge differs significantly from the pattern. Check fit carefully.';
    } else {
      // Normal case
      mainLine = `New cast-on: ${newCastOn} sts (approx)${
        hasMax ? ` – within your maximum of ${maxVal} sts.` : '.'
      }`;
      if (gaugeDiff >= 0.25) {
        noteLine =
          'Note: Your gauge differs significantly from the pattern. Check fit carefully.';
      }
    }

    setConvertSummary(
      JSON.stringify({
        patternStsPerInch,
        patternBodyWidth,
        yourStsPerInch,
        mainLine,
        noteLine,
      })
    );
  };

  const handleSuggestSize = () => {
    const pg = parseFloat(sizePatternGauge);
    const bodyVal = parseFloat(sizeBody);
    const easeVal = parseFloat(sizeEase);

    if (isNaN(pg) || isNaN(bodyVal) || isNaN(easeVal) || pg <= 0) {
      alert('Please enter valid numbers for the size helper.');
      return;
    }

    const sizes = sizePatternSizes
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((s) => !isNaN(s));

    if (!sizes.length) {
      alert('Please enter at least one pattern size (comma-separated).');
      return;
    }

    const targetCircumference = bodyVal + easeVal;
    const stitchesPerInch = pg / 4; // sts per inch
    const targetStitches = targetCircumference * stitchesPerInch;

    const sizeList = sizes.map((sts) => {
      const finishedInches = sts / stitchesPerInch;
      return { sts, inches: finishedInches };
    });

    let best = sizeList[0];
    let bestDiff = Math.abs(sizeList[0].sts - targetStitches);
    for (let i = 1; i < sizeList.length; i++) {
      const diff = Math.abs(sizeList[i].sts - targetStitches);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = sizeList[i];
      }
    }

    setSuggestedSize(
      JSON.stringify({
        stitchesPerInch,
        targetCircumference,
        sizes: sizeList,
        best,
      })
    );
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar style="dark" />

      {/* Static skein background at bottom, bigger */}
      <Image source={blueSkeinImage} style={styles.skein} resizeMode="cover" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.appName}>KNITKIT</Text>
          <Text style={styles.pageTitle}>Pattern Converter</Text>
          <Text style={styles.subtitle}>
            Adjust a pattern to work with a different yarn or gauge.
          </Text>

          <TouchableOpacity
            style={styles.howRow}
            onPress={() => setShowHowItWorks(!showHowItWorks)}
            activeOpacity={0.7}
          >
            <Text style={styles.howText}>How this works</Text>
            <Text style={styles.howChevron}>{showHowItWorks ? '˄' : '˅'}</Text>
          </TouchableOpacity>

          {showHowItWorks && (
            <View style={styles.howPanel}>
              <Text style={styles.howBullet}>
                • Enter the pattern gauge, your gauge, and the pattern cast-on.
              </Text>
              <Text style={styles.howBullet}>
                • We calculate the new cast-on stitches for your gauge.
              </Text>
              <Text style={styles.howBullet}>
                • If the gauge difference is small, we'll suggest just changing
                needle size.
              </Text>
              <Text style={styles.howBullet}>
                • Optionally enter a maximum cast-on and we'll warn you if the
                new number is too high.
              </Text>
            </View>
          )}

          {/* Top converter fields */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pattern gauge (sts / 4")</Text>
            <TextInput
              style={styles.input}
              value={patternGauge}
              onChangeText={setPatternGauge}
              keyboardType="decimal-pad"
              placeholder="e.g., 20"
              placeholderTextColor="#dfdfdf"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Your gauge (sts / 4")</Text>
            <TextInput
              style={styles.input}
              value={yourGauge}
              onChangeText={setYourGauge}
              keyboardType="decimal-pad"
              placeholder="e.g., 16"
              placeholderTextColor="#dfdfdf"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pattern cast-on (sts)</Text>
            <TextInput
              style={styles.input}
              value={patternCastOn}
              onChangeText={setPatternCastOn}
              keyboardType="number-pad"
              placeholder="e.g., 120"
              placeholderTextColor="#dfdfdf"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Maximum cast-on stitches you're willing to do (optional)
            </Text>
            <TextInput
              style={styles.input}
              value={maxCastOn}
              onChangeText={setMaxCastOn}
              keyboardType="number-pad"
              placeholder="e.g., 200"
              placeholderTextColor="#dfdfdf"
            />
          </View>

          <View style={styles.convertWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConvert}
              style={styles.convertButton}
            >
              <Text style={styles.convertText}>Convert</Text>
            </TouchableOpacity>
          </View>

          {/* Results card for top converter */}
          {convertSummary && (() => {
            const data = JSON.parse(convertSummary as string) as {
              patternStsPerInch: number;
              patternBodyWidth: number;
              yourStsPerInch: number;
              mainLine: string;
              noteLine: string | null;
            };

            return (
              <View style={styles.convertResultsCard}>
                <Text style={styles.convertResultsTitle}>Results</Text>

                <Text style={styles.convertResultsLine}>
                  Pattern stitches per inch: {data.patternStsPerInch.toFixed(2)}
                </Text>
                <Text style={styles.convertResultsLine}>
                  Pattern body width: {data.patternBodyWidth.toFixed(1)}
                  " (approx)
                </Text>
                <Text style={styles.convertResultsLine}>
                  Your stitches per inch: {data.yourStsPerInch.toFixed(2)}
                </Text>

                <Text style={styles.convertResultsMain}>{data.mainLine}</Text>

                {data.noteLine && (
                  <Text style={styles.convertResultsNote}>{data.noteLine}</Text>
                )}
              </View>
            );
          })()}

          {/* Size helper */}
          <View style={styles.sizeSection}>
            <Text style={styles.sizeTitle}>Choose Pattern Size</Text>
            <Text style={styles.sizeSubtitle}>Size helper (optional)</Text>
            <Text style={styles.sizeHelperLine}>
              Figure out which written size is closest to your body + ease.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pattern Gauge (sts / 4")</Text>
              <TextInput
                style={styles.input}
                value={sizePatternGauge}
                onChangeText={setSizePatternGauge}
                keyboardType="decimal-pad"
                placeholder="e.g., 13"
                placeholderTextColor="#dfdfdf"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Pattern Sizes (Cast-on sts)</Text>
              <TextInput
                style={styles.input}
                value={sizePatternSizes}
                onChangeText={setSizePatternSizes}
                keyboardType="default"
                placeholder="e.g., 130,140,155,185,220,240"
                placeholderTextColor="#dfdfdf"
              />
              <Text style={styles.sizeHint}>(comma-separated)</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Your Body (inches)</Text>
              <TextInput
                style={styles.input}
                value={sizeBody}
                onChangeText={setSizeBody}
                keyboardType="decimal-pad"
                placeholder="e.g., 35"
                placeholderTextColor="#dfdfdf"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Desired Ease (inches)</Text>
              <TextInput
                style={styles.input}
                value={sizeEase}
                onChangeText={setSizeEase}
                keyboardType="decimal-pad"
                placeholder="e.g., 10"
                placeholderTextColor="#dfdfdf"
              />
            </View>

            <View style={styles.sizeButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSuggestSize}
                style={styles.convertButton}
              >
                <Text style={styles.convertText}>Suggest Size</Text>
              </TouchableOpacity>
            </View>

            {suggestedSize && (() => {
              const data = JSON.parse(suggestedSize as string) as {
                stitchesPerInch: number;
                targetCircumference: number;
                sizes: { sts: number; inches: number }[];
                best: { sts: number; inches: number };
              };

              return (
                <View style={styles.sizeResultsCard}>
                  <Text style={styles.sizeResultsTitle}>Size Suggestions</Text>

                  <Text style={styles.sizeResultsLine}>
                    Pattern stitches per inch:{' '}
                    {data.stitchesPerInch.toFixed(2)}
                  </Text>
                  <Text style={styles.sizeResultsLine}>
                    Target finished size: {data.targetCircumference.toFixed(1)}
                    " ({sizeBody} body + {sizeEase} ease)
                  </Text>

                  <View style={styles.sizeResultsSpacer} />

                  {data.sizes.map((s) => {
                    const line = `${s.sts} sts → ~${s.inches.toFixed(1)}"`;
                    const isBest = s.sts === data.best.sts;

                    if (isBest) {
                      return (
                        <View
                          key={s.sts}
                          style={styles.sizeRowHighlightedWrapper}
                        >
                          <Text style={styles.sizeRowHighlightedText}>
                            {line}
                          </Text>
                        </View>
                      );
                    }

                    return (
                      <Text key={s.sts} style={styles.sizeRow}>
                        {line}
                      </Text>
                    );
                  })}

                  <Text style={styles.sizeResultsFinal}>
                    Suggested pattern size: {data.best.sts} stitches (~
                    {data.best.inches.toFixed(1)}
                    "), closest to your target{' '}
                    {data.targetCircumference.toFixed(1)}
                    ".
                  </Text>
                </View>
              );
            })()}
          </View>

          {/* Contents button appears AFTER size helper + size suggestions */}
          <View style={styles.bottomNavWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/contents')}
              style={styles.contentsButton}
            >
              <Text style={styles.contentsButtonText}>Contents</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#faf9f6',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  appName: {
    fontSize: 18,
    letterSpacing: 3,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    color: '#333333',
    lineHeight: 22,
    marginHorizontal: 8,
    marginBottom: 28,
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  howText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222222',
  },
  howChevron: {
    fontSize: 18,
    color: '#222222',
  },
  howPanel: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  howBullet: {
    fontSize: 16,
    color: '#222222',
    lineHeight: 22,
    marginBottom: 10,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
  },
  input: {
    fontSize: 17,
    fontWeight: '400',
    color: '#111111',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  convertWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  convertButton: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#111111',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  convertText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111111',
  },
  convertResultsCard: {
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: '#ffffff',
  },
  convertResultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  convertResultsLine: {
    fontSize: 17,
    color: '#111111',
    lineHeight: 22,
    marginBottom: 6,
  },
  convertResultsMain: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  convertResultsNote: {
    fontSize: 16,
    color: '#111111',
    lineHeight: 22,
  },
  // Static skein background at bottom, bigger
  skein: {
    position: 'absolute',
    bottom: 0,
    width: '120%',   // bigger and wider than screen
    height: 260,     // taller
    alignSelf: 'center',
    opacity: 0.95,
  },
  sizeSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  sizeTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
    marginBottom: 4,
  },
  sizeSubtitle: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 4,
  },
  sizeHelperLine: {
    fontSize: 17,
    textAlign: 'center',
    color: '#333333',
    lineHeight: 22,
    marginHorizontal: 8,
    marginBottom: 24,
  },
  sizeHint: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
    marginTop: 4,
  },
  sizeButtonWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  sizeResultsCard: {
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: '#ffffff',
  },
  sizeResultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  sizeResultsLine: {
    fontSize: 17,
    color: '#111111',
    lineHeight: 22,
    marginBottom: 4,
  },
  sizeResultsSpacer: {
    height: 16,
  },
  sizeRow: {
    fontSize: 17,
    color: '#111111',
    lineHeight: 24,
    marginBottom: 6,
  },
  sizeRowHighlightedWrapper: {
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
    backgroundColor: '#ffffff',
  },
  sizeRowHighlightedText: {
    fontSize: 17,
    color: '#111111',
  },
  sizeResultsFinal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 24,
    marginTop: 12,
  },
  bottomNavWrapper: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  contentsButton: {
    width: '80%',
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#111111',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  contentsButtonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111111',
  },
});