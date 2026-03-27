/**
 * Electron API stub for Tauri migration.
 * All IPC calls are replaced with Tauri `invoke` in issue #43.
 */
const noop = () => {};
const noopAsync = () => Promise.resolve(null);

export const ipcRenderer = {
  send: (_channel: string, ..._args: unknown[]) => {},
  on: (_channel: string, _listener: (...args: unknown[]) => void) => ipcRenderer,
  once: (_channel: string, _listener: (...args: unknown[]) => void) => ipcRenderer,
  invoke: (_channel: string, ..._args: unknown[]) => noopAsync(),
  removeAllListeners: (_channel: string) => ipcRenderer,
  removeListener: (_channel: string, _listener: (...args: unknown[]) => void) => ipcRenderer,
};

export default { ipcRenderer };
