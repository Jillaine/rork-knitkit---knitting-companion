import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { Colors, Layout, Typography } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({ label, onPress, style, textStyle, fullWidth = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.buttonPadding.vertical,
    paddingHorizontal: Layout.buttonPadding.horizontal,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    backgroundColor: '#F5F4F1',
  },
  text: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    textAlign: 'center',
  },
});
