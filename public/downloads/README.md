# APK Downloads Folder

Hosted local APK:
- `Auralis-v1.1.1-universal.apk`

The site reads version, size, SHA-256 and download link from `apk-meta.json`
(`src/lib/useApkMetadata.ts`); `src/data/apps.ts` holds the same values as a fallback.
To publish a new version: replace the APK here, update `apk-meta.json` and `src/data/apps.ts`,
and add an entry to the release ledger in `src/components/Builds.tsx`.
