// Web preview shim — lets the renderer run in a plain browser (no Electron).
// Real app gets the full `window.goat` bridge from preload.js.
if (!window.goat) {
  window.goat = {
    save: async () => ({ ok: true }),
    load: async () => null,
    openFile: async () => [],
    openExternal: async (u) => window.open(u, '_blank'),
    appInfo: async () => ({ version: '1.0.0', platform: 'web-preview', arch: 'x64' }),
    onNav: () => {}
  };
}