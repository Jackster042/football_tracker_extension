import { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Football Match Tracker",
  version: "1.0.0",
  description: "Track live football match results with notifications",
  permissions: ["alarms", "storage", "notifications"],
  host_permissions: ["https://www.openligadb.de/*","https://api.openligadb.de/*"],
  content_security_policy: {
    extension_pages:
      "script-src 'self'; object-src 'self'; connect-src 'self' https://www.openligadb.de https://api.openligadb.de;",
  },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      16: "icons/icon16.png",
      48: "icons/icon48.png",
      128: "icons/icon128.png",
    },
    default_title: "Football Tracker",
  },
  options_page: "src/options/index.html",
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  icons: {
    16: "icons/icon16.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png",
  },
};

export default manifest;
