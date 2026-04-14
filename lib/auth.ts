export const GST_AUTH_COOKIE = 'gst_auth'

export function getExpectedGstPassword() {
  return process.env.GST_APP_PASSWORD || 'verity-gst-2026'
}

