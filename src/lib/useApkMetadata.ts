import { useEffect, useState } from "react";
import { APPS, type App } from "../data/apps";

export interface DynamicApkMeta {
  fileName: string;
  version: string;
  releaseTag: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256: string;
  lastUpdated: string;
  minAndroidVersion: string;
  downloadUrl: string;
  releaseNotes: string;
}

export function useApkMetadata() {
  const [meta, setMeta] = useState<DynamicApkMeta | null>(null);
  const [appData, setAppData] = useState<App[]>(APPS);

  useEffect(() => {
    let isMounted = true;

    async function fetchMetadata() {
      try {
        const res = await fetch("/downloads/apk-meta.json?t=" + Date.now());
        if (!res.ok) return;
        const data: DynamicApkMeta = await res.json();
        if (!isMounted || !data || !data.downloadUrl) return;

        setMeta(data);

        // Dynamically update Auralis in appData
        setAppData((prev) =>
          prev.map((app) => {
            if (app.id === "auralis") {
              return {
                ...app,
                version: data.version || app.version,
                updated: data.lastUpdated || app.updated,
                size: data.fileSizeFormatted || app.size,
                minAndroid: data.minAndroidVersion?.replace(/[^0-9.]/g, "") || app.minAndroid,
                builds: [
                  {
                    arch: "universal",
                    size: data.fileSizeFormatted || app.size,
                    sha: data.sha256 || app.builds[0]?.sha,
                    url: data.downloadUrl || app.builds[0]?.url,
                  },
                ],
              };
            }
            return app;
          })
        );
      } catch {
        // Fallback to static data
      }
    }

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  return { meta, appData };
}
