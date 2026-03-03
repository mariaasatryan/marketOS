/// <reference types="vite/client" />
// Global type declarations for environments that use `import.meta.env`
// Adjust keys as needed for your project; this generic shape avoids TS2339.

interface ImportMetaEnv {
  readonly NODE_ENV?: string;
  // Extend with your known env vars, e.g.:
  // readonly VITE_API_URL?: string;
  // Allow arbitrary keys to prevent type errors while keeping type safety reasonable
  readonly [key: string]: string | boolean | number | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


