import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function TopTabs<T extends string>(props: {
  value: T
  onChange: (v: T) => void
  tabs: Array<{ value: T; label: string }>
}) {
  return (
    <View style={styles.wrap}>
      {props.tabs.map((t) => {
        const active = t.value === props.value
        return (
          <Pressable
            key={t.value}
            onPress={() => props.onChange(t.value)}
            style={({ pressed }) => [styles.tab, active ? styles.tabActive : styles.tabInactive, pressed && styles.pressed]}
          >
            <Text style={active ? styles.textActive : styles.textInactive}>{t.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tabInactive: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textInactive: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.small,
  },
  textActive: {
    color: '#fff',
    fontWeight: '900',
    fontSize: typography.small,
  },
  pressed: { opacity: 0.85 },
})

