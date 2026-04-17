import { useMemo, useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { INDIAN_STATES, getStateName } from '@/src/lib/states'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function StatePicker(props: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const options = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return INDIAN_STATES
    return INDIAN_STATES.filter((s) => s.name.toLowerCase().includes(q) || s.code.includes(q))
  }, [query])

  const selectedLabel = `${getStateName(props.value)} (${props.value})`

  return (
    <View style={styles.block}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <Pressable onPress={() => setOpen(true)} style={({ pressed }) => [styles.control, pressed && styles.pressed]}>
        <Text style={styles.valueText}>{selectedLabel}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select state</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search state or code"
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FlatList
              data={options}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const active = item.code === props.value
                return (
                  <Pressable
                    onPress={() => {
                      props.onChange(item.code)
                      setOpen(false)
                      setQuery('')
                    }}
                    style={({ pressed }) => [styles.optionRow, active && styles.optionActive, pressed && styles.pressed]}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {item.name} ({item.code})
                    </Text>
                  </Pressable>
                )
              }}
              ListEmptyComponent={<Text style={styles.emptyText}>No matching state.</Text>}
            />
            <View style={{ height: spacing.sm }} />
            <Pressable onPress={() => setOpen(false)} style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}>
              <Text style={styles.closeBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  control: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  valueText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  optionRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionActive: {
    backgroundColor: colors.accentSoft,
  },
  optionText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: typography.body,
  },
  optionTextActive: {
    color: colors.text,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.textMuted,
    fontWeight: '700',
    paddingVertical: spacing.md,
  },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.control,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: colors.chipTextActive,
    fontWeight: '800',
    fontSize: typography.body,
  },
})

