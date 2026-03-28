import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Layout, Typography } from '@/constants/theme';

export default function YarnGuidePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBackToContents = () => {
    router.back();
  };

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
            <Text style={styles.sectionTitle}>Yarn Guide</Text>
            <Text style={styles.subtitle}>Quick Reference for Yarn Weight Terminology</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>Weight</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>US Terms</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>UK/AUS/NZ</Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>Other</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Lace</Text>
              <Text style={[styles.tableCell, styles.col2]}>Lace, Thread</Text>
              <Text style={[styles.tableCell, styles.col3]}>2-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#0, Cobweb</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Fingering</Text>
              <Text style={[styles.tableCell, styles.col2]}>Fingering,{"\n"}Sock</Text>
              <Text style={[styles.tableCell, styles.col3]}>4-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#1, Super Fine</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Sport</Text>
              <Text style={[styles.tableCell, styles.col2]}>Sport, Baby</Text>
              <Text style={[styles.tableCell, styles.col3]}>5-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#2, Fine</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>DK</Text>
              <Text style={[styles.tableCell, styles.col2]}>DK, Light{"\n"}Worsted</Text>
              <Text style={[styles.tableCell, styles.col3]}>8-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#3, Light</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Worsted</Text>
              <Text style={[styles.tableCell, styles.col2]}>Worsted,{"\n"}Afghan</Text>
              <Text style={[styles.tableCell, styles.col3]}>10-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#4, Medium</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Aran</Text>
              <Text style={[styles.tableCell, styles.col2]}>Aran, Heavy{"\n"}Worsted</Text>
              <Text style={[styles.tableCell, styles.col3]}>10-ply (heavy)</Text>
              <Text style={[styles.tableCell, styles.col4]}>#4-5,{"\n"}Medium-Bulky</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Bulky</Text>
              <Text style={[styles.tableCell, styles.col2]}>Bulky, Chunky</Text>
              <Text style={[styles.tableCell, styles.col3]}>12-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#5, Bulky</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Super Bulky</Text>
              <Text style={[styles.tableCell, styles.col2]}>Super Bulky</Text>
              <Text style={[styles.tableCell, styles.col3]}>14-ply</Text>
              <Text style={[styles.tableCell, styles.col4]}>#6, Super{"\n"}Bulky</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>Jumbo</Text>
              <Text style={[styles.tableCell, styles.col2]}>Jumbo</Text>
              <Text style={[styles.tableCell, styles.col3]}>16-ply+</Text>
              <Text style={[styles.tableCell, styles.col4]}>#7, Jumbo</Text>
            </View>
          </View>

          <View style={styles.backSection}>
            <Text style={styles.ellipsis}>···</Text>
            <Button
              label="Contents"
              onPress={handleBackToContents}
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
    marginTop: Layout.spacing.xl,
    backgroundColor: '#F5F4F1',
    borderWidth: 1,
    borderColor: Colors.charcoal,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.charcoal,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
    backgroundColor: '#F5F4F1',
  },
  tableHeaderText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E4E1',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
    minHeight: 50,
  },
  tableCellBold: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  tableCell: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: Typography.weights.regular,
    color: Colors.charcoal,
    lineHeight: 16,
  },
  col1: {
    width: '22%',
  },
  col2: {
    width: '26%',
  },
  col3: {
    width: '26%',
  },
  col4: {
    width: '26%',
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
