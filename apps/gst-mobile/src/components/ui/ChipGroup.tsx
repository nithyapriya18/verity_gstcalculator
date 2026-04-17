import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function ChipGroup<T extends string>(props: {
  value: T | null
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <View style={styles.wrap}>
      {props.options.map((o) => {
        const active = props.value !== null && o.value === props.value
        return (
          <Pressable
            key={o.value}
            onPress={() => props.onChange(o.value)}
            style={({ pressed }) => [active ? styles.chipActive : styles.chip, pressed && styles.pressed]}
          >
            <Text style={active ? styles.textActive : styles.text}>{o.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.chipActive,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    color: colors.text,
    fontWeight: '800',
    fontSize: typography.small,
  },
  textActive: {
    color: colors.chipTextActive,
    fontWeight: '800',
    fontSize: typography.small,
  },
  pressed: {
    opacity: 0.86,
  },
})

