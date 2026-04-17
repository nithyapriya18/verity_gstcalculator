import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function Button(props: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  iconLeft?: React.ReactNode
  disabled?: boolean
}) {
  const variant = props.variant ?? 'primary'
  const style =
    variant === 'primary'
      ? styles.primary
      : variant === 'secondary'
        ? styles.secondary
        : styles.ghost

  const textStyle =
    variant === 'primary' ? styles.primaryText : variant === 'secondary' ? styles.secondaryText : styles.ghostText

  return (
    <Pressable onPress={props.onPress} disabled={props.disabled} style={({ pressed }) => [style, pressed && styles.pressed, props.disabled && styles.disabled]}>
      <View style={styles.inner}>
        {props.iconLeft ? <View style={styles.icon}>{props.iconLeft}</View> : null}
        <Text style={textStyle}>{props.label}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginTop: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.control,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: typography.body,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderRadius: radius.control,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: typography.body,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: radius.control,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  ghostText: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: typography.body,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
})

