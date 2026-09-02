import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { defineConfig, Plugin } from 'vite';

const ADMIN_EMAIL = 'ishaanthakur49@gmail.com';
const activeOtps = new Map<string, { code: string; expiresAt: number }>();
const validSessions = new Set<string>();

const adminApiPlugin: () => Plugin = () => ({
  name: 'admin-api-plugin',
  configureServer(server) {
    // 1. MPA Router Middleware
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0];
      if (url === '/privacy' || url === '/privacy/') {
        req.url = '/privacy/index.html';
      } else if (url === '/terms' || url === '/terms/') {
        req.url = '/terms/index.html';
      } else if (url === '/admin' || url === '/admin/') {
        req.url = '/admin/index.html';
      } else if (url?.endsWith('.apk')) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="Auralis-v1.0.0-universal.apk"');
      }
      next();
    });

    // 2. Admin API Endpoints Middleware
    server.middlewares.use(async (req, res, next) => {
      const parsedUrl = req.url?.split('?')[0];

      if (!parsedUrl?.startsWith('/api/admin/')) {
        return next();
      }

      const sendJson = (statusCode: number, data: unknown) => {
        res.writeHead(statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-token',
        });
        res.end(JSON.stringify(data));
      };

      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-token',
        });
        return res.end();
      }

      // Helper to collect request body buffer
      const getRawBody = (): Promise<Buffer> =>
        new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks)));
          req.on('error', reject);
        });

      try {
        // GET /api/admin/current-apk
        if (parsedUrl === '/api/admin/current-apk' && req.method === 'GET') {
          const metaPath = path.resolve(process.cwd(), 'public/downloads/apk-meta.json');
          if (fs.existsSync(metaPath)) {
            const content = fs.readFileSync(metaPath, 'utf8');
            return sendJson(200, JSON.parse(content));
          }

          // Fallback scan public/downloads
          const downloadsDir = path.resolve(process.cwd(), 'public/downloads');
          if (fs.existsSync(downloadsDir)) {
            const apks = fs.readdirSync(downloadsDir).filter((f) => f.endsWith('.apk'));
            if (apks.length > 0) {
              const apkName = apks[0];
              const apkPath = path.join(downloadsDir, apkName);
              const stats = fs.statSync(apkPath);
              const fileBuffer = fs.readFileSync(apkPath);
              const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
              const meta = {
                fileName: apkName,
                version: '1.0.0',
                releaseTag: 'v1.0.0',
                fileSizeBytes: stats.size,
                fileSizeFormatted: `${(stats.size / (1024 * 1024)).toFixed(1)} MB`,
                sha256,
                lastUpdated: stats.mtime.toISOString().split('T')[0],
                minAndroidVersion: 'Android 8.0+',
                downloadUrl: `/downloads/${apkName}`,
                releaseNotes: 'Universal release',
              };
              fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
              return sendJson(200, meta);
            }
          }

          return sendJson(404, { error: 'No APK found in public/downloads' });
        }

        // POST /api/admin/send-otp
        if (parsedUrl === '/api/admin/send-otp' && req.method === 'POST') {
          const raw = await getRawBody();
          const { email } = JSON.parse(raw.toString('utf8') || '{}');

          if (!email || email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            return sendJson(403, {
              success: false,
              error: `Unauthorized email address. Access is strictly granted only to ${ADMIN_EMAIL}.`,
            });
          }

          // Generate 6-digit numeric OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
          activeOtps.set(ADMIN_EMAIL.toLowerCase(), { code: otp, expiresAt });

          console.log('\n-----------------------------------------------------------');
          console.log(`\x1b[32m[Auralis Admin Security]\x1b[0m Verification code generated:`);
          console.log(`Target Admin: \x1b[36m${ADMIN_EMAIL}\x1b[0m`);
          console.log(`OTP Code:     \x1b[33m\x1b[1m${otp}\x1b[0m`);
          console.log(`Expires in:   5 minutes`);
          console.log('-----------------------------------------------------------\n');

          return sendJson(200, {
            success: true,
            message: `Verification code sent to ${ADMIN_EMAIL}.`,
            devOtp: otp, // Provided in development for rapid verification
          });
        }

        // POST /api/admin/verify-otp
        if (parsedUrl === '/api/admin/verify-otp' && req.method === 'POST') {
          const raw = await getRawBody();
          const { email, otp } = JSON.parse(raw.toString('utf8') || '{}');

          if (!email || email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            return sendJson(403, {
              success: false,
              error: `Unauthorized email address. Access is strictly restricted to ${ADMIN_EMAIL}.`,
            });
          }

          const record = activeOtps.get(ADMIN_EMAIL.toLowerCase());
          if (!record) {
            return sendJson(400, {
              success: false,
              error: 'No active verification code found. Please request a new code.',
            });
          }

          if (Date.now() > record.expiresAt) {
            activeOtps.delete(ADMIN_EMAIL.toLowerCase());
            return sendJson(400, {
              success: false,
              error: 'Verification code has expired. Please request a new one.',
            });
          }

          if (record.code !== String(otp).trim()) {
            return sendJson(400, {
              success: false,
              error: 'Incorrect verification code. Please check and try again.',
            });
          }

          // Code is valid! Consume it and grant session
          activeOtps.delete(ADMIN_EMAIL.toLowerCase());
          const sessionToken = crypto.randomUUID();
          validSessions.add(sessionToken);

          return sendJson(200, {
            success: true,
            token: sessionToken,
            email: ADMIN_EMAIL,
            expiresInMs: 24 * 60 * 60 * 1000,
          });
        }

        // POST /api/admin/upload-apk
        if (parsedUrl === '/api/admin/upload-apk' && req.method === 'POST') {
          const raw = await getRawBody();
          const payload = JSON.parse(raw.toString('utf8') || '{}');
          const {
            fileName,
            version,
            releaseTag,
            minAndroidVersion,
            releaseNotes,
            base64Data,
          } = payload;

          if (!fileName || !base64Data) {
            return sendJson(400, { success: false, error: 'Missing fileName or base64Data' });
          }

          // Ensure .apk extension
          const cleanFileName = fileName.endsWith('.apk') ? fileName : `${fileName}.apk`;
          const fileBuffer = Buffer.from(base64Data, 'base64');
          const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
          const fileSizeBytes = fileBuffer.length;
          const fileSizeFormatted = `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`;

          // Target paths
          const publicDownloads = path.resolve(process.cwd(), 'public/downloads');
          if (!fs.existsSync(publicDownloads)) {
            fs.mkdirSync(publicDownloads, { recursive: true });
          }

          const targetApkPath = path.join(publicDownloads, cleanFileName);
          fs.writeFileSync(targetApkPath, fileBuffer);

          // Update dist/downloads too if dist exists
          const distDownloads = path.resolve(process.cwd(), 'dist/downloads');
          if (fs.existsSync(distDownloads)) {
            fs.writeFileSync(path.join(distDownloads, cleanFileName), fileBuffer);
          }

          // Write updated apk-meta.json
          const meta = {
            fileName: cleanFileName,
            version: version || '1.0.1',
            releaseTag: releaseTag || `v${version || '1.0.1'}`,
            fileSizeBytes,
            fileSizeFormatted,
            sha256,
            lastUpdated: new Date().toISOString().split('T')[0],
            minAndroidVersion: minAndroidVersion || 'Android 8.0+',
            downloadUrl: `/downloads/${cleanFileName}`,
            releaseNotes: releaseNotes || 'Universal APK release.',
          };

          const metaPath = path.join(publicDownloads, 'apk-meta.json');
          fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
          if (fs.existsSync(distDownloads)) {
            fs.writeFileSync(path.join(distDownloads, 'apk-meta.json'), JSON.stringify(meta, null, 2), 'utf8');
          }

          // Also synchronize src/scripts/config.ts
          const configPath = path.resolve(process.cwd(), 'src/scripts/config.ts');
          if (fs.existsSync(configPath)) {
            let configContent = fs.readFileSync(configPath, 'utf8');
            configContent = configContent.replace(/apkDownloadUrl:\s*'[^']*'/, `apkDownloadUrl: '${meta.downloadUrl}'`);
            configContent = configContent.replace(/version:\s*'[^']*'/, `version: '${meta.version}'`);
            configContent = configContent.replace(/releaseTag:\s*'[^']*'/, `releaseTag: '${meta.releaseTag}'`);
            fs.writeFileSync(configPath, configContent, 'utf8');
          }

          console.log(`\x1b[32m[Auralis Admin]\x1b[0m Successfully updated APK: ${cleanFileName} (${fileSizeFormatted})`);

          return sendJson(200, { success: true, meta });
        }

        // POST /api/admin/update-metadata
        if (parsedUrl === '/api/admin/update-metadata' && req.method === 'POST') {
          const raw = await getRawBody();
          const update = JSON.parse(raw.toString('utf8') || '{}');

          const metaPath = path.resolve(process.cwd(), 'public/downloads/apk-meta.json');
          let meta: Record<string, any> = {};
          if (fs.existsSync(metaPath)) {
            meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          }

          meta = {
            ...meta,
            ...update,
            lastUpdated: new Date().toISOString().split('T')[0],
          };

          fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
          const distMetaPath = path.resolve(process.cwd(), 'dist/downloads/apk-meta.json');
          if (fs.existsSync(path.dirname(distMetaPath))) {
            fs.writeFileSync(distMetaPath, JSON.stringify(meta, null, 2), 'utf8');
          }

          return sendJson(200, { success: true, meta });
        }

        return sendJson(404, { error: 'Unknown admin endpoint' });
      } catch (err: any) {
        console.error('Admin API error:', err);
        return sendJson(500, { error: err.message || 'Internal server error' });
      }
    });
  },
});

export default defineConfig({
  appType: 'mpa',
  plugins: [adminApiPlugin()],
  server: {
    watch: {
      ignored: ['**/temp_unzip/**'],
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome90',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
      },
    },
  },
});
