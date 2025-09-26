/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_APP_ENVIRONMENT?: string
  readonly VITE_ENCRYPTION_KEY?: string
  readonly VITE_JWT_SECRET?: string
  readonly VITE_PEPPER_SECRET?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_DEBUG_MODE?: string
  readonly VITE_ENABLE_SOURCE_MAPS?: string
  readonly VITE_ENABLE_PARENTAL_VERIFICATION?: string
  readonly VITE_DATA_RETENTION_DAYS?: string
  readonly VITE_CSP_ENABLED?: string
  readonly VITE_SECURE_COOKIES?: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly BASE_URL: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}