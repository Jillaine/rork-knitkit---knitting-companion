import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title}>This page doesn&apos;t exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to Contents</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.cream,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 24,
  },
  linkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
});
