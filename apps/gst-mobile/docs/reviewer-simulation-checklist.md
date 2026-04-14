# GST Mobile Reviewer Simulation Checklist

Use this before every build submission to App Store and Play Store.

## 1) Core Stability

- Fresh install on a physical Android device and iPhone.
- Open app and complete calculator flow:
  - forward exclusive
  - forward inclusive
  - reverse from inclusive total
  - reverse from GST amount
- Complete invoice flow:
  - add 2+ items
  - verify totals
  - share invoice text
- Open history and confirm saved entries persist after relaunch.
- Turn airplane mode on and ensure app remains usable.

## 2) Compliance Surfaces

- Settings screen contains working Privacy Policy link.
- Settings screen contains working Support link.
- Financial disclaimer is visible.
- No placeholders, TODO text, broken tabs, or dead buttons.

## 3) Metadata Parity

- Screenshots are taken from current build only.
- Store descriptions match actual app features exactly.
- Data safety declarations match installed SDKs:
  - AsyncStorage
  - expo-clipboard

## 4) Platform-Specific Gates

### Google Play (Personal account)
- Internal test build uploaded.
- Closed testing configured with 12+ real testers.
- 14-day testing period completed.
- At least 2 updates pushed during closed test window.
- Production access questionnaire completed.

### Apple App Store
- TestFlight build installed and tested.
- App Privacy labels completed.
- Notes for Review include exact test path.
