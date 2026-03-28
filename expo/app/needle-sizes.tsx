import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Layout, Typography } from '@/constants/theme';

interface NeedleSize {
  metric: string;
  us: string;
  uk: string;
}

const needleSizes: NeedleSize[] = [
  { metric: '2.0mm', us: 'US 0', uk: 'UK 14' },
  { metric: '2.25mm', us: 'US 1', uk: 'UK 13' },
  { metric: '2.5mm', us: 'US 1.5', uk: 'UK 12' },
  { metric: '2.75mm', us: 'US 2', uk: 'UK 12' },
  { metric: '3.0mm', us: 'US 2.5', uk: 'UK 11' },
  { metric: '3.25mm', us: 'US 3', uk: 'UK 10' },
  { metric: '3.5mm', us: 'US 4', uk: 'UK 9 or 10' },
  { metric: '3.75mm', us: 'US 5', uk: 'UK 9' },
  { metric: '4.0mm', us: 'US 6', uk: 'UK 8' },
  { metric: '4.5mm', us: 'US 7', uk: 'UK 7' },
  { metric: '5.0mm', us: 'US 8', uk: 'UK 6' },
  { metric: '5.5mm', us: 'US 9', uk: 'UK 5' },
  { metric: '6.0mm', us: 'US 10', uk: 'UK 4' },
  { metric: '6.5mm', us: 'US 10.5', uk: 'UK 3' },
  { metric: '8.0mm', us: 'US 11', uk: 'UK 0' },
  { metric: '9.0mm', us: 'US 13', uk: 'UK 00' },
  { metric: '10.0mm', us: 'US 15', uk: 'UK 000' },
  { metric: '12.75mm', us: 'US 17', uk: '—' },
  { metric: '15.0mm', us: 'US 19', uk: '—' },
  { metric: '19.0mm', us: 'US 35', uk: '—' },
  { metric: '25.0mm', us: 'US 50', uk: '—' },
];

export default function NeedleSizesPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>KNITKIT</Text>
            <Text style={styles.sectionTitle}>Needle Sizes</Text>
            <Text style={styles.subtitle}>Needle Size Conversion Chart</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colMetric]}>Metric (mm)</Text>
              <Text style={[styles.tableHeaderText, styles.colUs]}>US Size</Text>
              <Text style={[styles.tableHeaderText, styles.colUk]}>UK/Old CAN</Text>
            </View>

            {needleSizes.map((size, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 && styles.tableRowAlt,
                ]}
              >
                <Text style={[styles.tableCell, styles.colMetric]}>{size.metric}</Text>
                <Text style={[styles.tableCell, styles.colUs]}>{size.us}</Text>
                <Text style={[styles.tableCell, styles.colUk]}>{size.uk}</Text>
              </View>
            ))}
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
    marginBottom: Layout.spacing.xl * 1.5,
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
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  table: {
    marginBottom: Layout.spacing.xl * 1.5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,
    paddingBottom: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  tableHeaderText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tableRowAlt: {
    backgroundColor: '#FCFCFB',
  },
  tableCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    color: Colors.charcoal,
  },
  colMetric: {
    flex: 1.2,
  },
  colUs: {
    flex: 1,
  },
  colUk: {
    flex: 1.3,
  },
  backSection: {
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.xl,
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
});
