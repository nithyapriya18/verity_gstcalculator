# GST Mobile Store Submission Runbook

## Build Commands

Run inside `apps/gst-mobile`.

- Install deps: `npm install`
- Type check: `npx tsc --noEmit`
- Start Expo: `npm run start`

## Release Inputs Required

- App name:
  - `GST Calculator - <Brand>`
- Short description:
  - `GST calculator with invoice totals for Indian businesses.`
- Privacy policy URL:
  - Replace placeholder in `App.tsx` before release.
- Support URL/email:
  - Replace placeholder in `App.tsx` before release.

## Store Listing Asset Checklist

- Icon:
  - Apple: 1024x1024 (no alpha)
  - Google: 512x512
- Screenshots:
  - Apple: 6.7-inch and 6.1-inch sets
  - Google: minimum 2, recommended 4-8
- Feature graphics and optional promo video if available

## Google Play Release Flow (Personal Account)

1. Create app in Play Console.
2. Fill Data Safety form.
3. Upload Android App Bundle (`.aab`) to internal test.
4. Create closed testing track with 12+ testers.
5. Complete 14-day test activity.
6. Push at least 2 build updates during test cycle.
7. Submit Production Access Questionnaire.
8. Promote release to production.

## Apple App Store Flow

1. Create app in App Store Connect.
2. Upload TestFlight build.
3. Fill App Privacy labels.
4. Add screenshots and metadata.
5. Add Notes for Review:
   - test calculator modes
   - test invoice sharing
   - privacy policy location in Settings
6. Submit for review.

## Rejection Response Template

Use this in review notes after fixing a rejection:

`Issue addressed in version <x.y.z>. We fixed <specific issue>. Reviewer can verify by opening <screen> and completing <exact steps>.`
