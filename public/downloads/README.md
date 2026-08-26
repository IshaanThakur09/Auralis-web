# APK Downloads Folder

Place your Android `.apk` file directly in this folder.

### Recommended filename:
- `auralis.apk` or `auralis-v1.0.0.apk`

Once placed, this file will be automatically served by the website at:
- `/downloads/auralis.apk`

To connect it to the download buttons, update `apkDownloadUrl` in `src/scripts/config.ts`:
```typescript
apkDownloadUrl: '/downloads/auralis.apk',
```
