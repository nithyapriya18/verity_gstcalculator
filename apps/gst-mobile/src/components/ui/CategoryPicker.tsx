import { Picker } from '@react-native-picker/picker'
import { StyleSheet, Text, View } from 'react-native'
import { GST_CATEGORIES } from '@/src/lib/gstCategories'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'

export function CategoryPicker(props: {
  value: string
  onChange: (id: string) => void
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>Product / service category (HSN/SAC style)</Text>
      <View style={styles.control}>
        <Picker selectedValue={props.value} onValueChange={(v) => props.onChange(String(v))} style={styles.picker}>
          {GST_CATEGORIES.map((c) => (
            <Picker.Item key={c.id} label={c.label} value={c.id} />
          ))}
        </Picker>
      </View>
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
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
  },
})

