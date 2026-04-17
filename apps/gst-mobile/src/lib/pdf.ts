import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'

export async function exportHtmlAsPdf(args: { title: string; html: string }) {
  const file = await Print.printToFileAsync({
    html: args.html,
    base64: false,
  })

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      UTI: 'com.adobe.pdf',
      mimeType: 'application/pdf',
      dialogTitle: args.title,
    })
    return
  }

  // Fallback: open system print dialog if sharing isn't available.
  await Print.printAsync({ html: args.html })
}

