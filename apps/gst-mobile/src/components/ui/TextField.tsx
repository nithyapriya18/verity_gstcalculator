import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function TextField(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  keyboardType?: 'default' | 'numeric'
  prefix?: string
  hint?: string
  editable?: boolean
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.controlWrap}>
        {props.prefix ? <Text style={styles.prefix}>{props.prefix}</Text> : null}
        <TextInput
          value={props.value}
          onChangeText={props.onChange}
          placeholder={props.placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={props.keyboardType ?? 'default'}
          editable={props.editable ?? true}
          style={[styles.input, props.prefix ? styles.inputWithPrefix : null, props.editable === false ? styles.inputDisabled : null]}
        />
      </View>
      {props.hint ? (
        <Text style={styles.hint}>{props.hint}</Text>
      ) : null}
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
  controlWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  prefix: {
    position: 'absolute',
    left: 12,
    zIndex: 2,
    color: colors.textMuted,
    fontWeight: '800',
    fontSize: typography.body,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  inputWithPrefix: {
    paddingLeft: 28,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  hint: {
    marginTop: spacing.xs,
    fontSize: typography.small,
    color: colors.textMuted,
    fontWeight: '600',
  },
})

