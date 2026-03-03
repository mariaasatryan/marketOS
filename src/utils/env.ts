// Environment configuration validation
interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_APP_MODE: 'MOCK' | 'LIVE';
  VITE_API_RETRY_ATTEMPTS: number;
  VITE_API_RETRY_DELAY: number;
  VITE_API_TIMEOUT: number;
  VITE_CACHE_TTL: number;
  VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  VITE_GOOGLE_REDIRECT_URI: string;
  VITE_FEATURE_CALENDAR_AUTO_REMINDER: string;
  VITE_FEATURE_SHEETS_PREVIEW: string;
  VITE_FEATURE_ADS_MODULE: string;
  VITE_FEATURE_AI_ASSISTANT: string;
  WB_API_TOKEN: string;
  OZON_API_CLIENT_ID: string;
  OZON_API_KEY: string;
  YM_API_TOKEN: string;
  YM_CAMPAIGN_ID: string;
  VITE_AI_API_KEY: string;
  VITE_AI_PROVIDER: string;
  VITE_AI_MODEL: string;
}

// const requiredEnvVars = [
//   'VITE_SUPABASE_URL',
//   'VITE_SUPABASE_ANON_KEY',
// ] as const;


export function validateEnvironment(): EnvConfig {
  // All secrets must come from environment variables
  // Never hardcode secrets in production code
  const config: EnvConfig = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    VITE_APP_MODE: (import.meta.env.VITE_APP_MODE as 'MOCK' | 'LIVE') || 'MOCK',
    VITE_API_RETRY_ATTEMPTS: 3,
    VITE_API_RETRY_DELAY: 1000,
    VITE_API_TIMEOUT: 30000,
    VITE_CACHE_TTL: 300000,
    VITE_GOOGLE_OAUTH_CLIENT_ID: '',
    VITE_GOOGLE_REDIRECT_URI: (typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '/auth/google/callback'),
    VITE_FEATURE_CALENDAR_AUTO_REMINDER: 'true',
    VITE_FEATURE_SHEETS_PREVIEW: 'true',
    VITE_FEATURE_ADS_MODULE: 'true',
    VITE_FEATURE_AI_ASSISTANT: 'false',
    WB_API_TOKEN: '',
    OZON_API_CLIENT_ID: '',
    OZON_API_KEY: '',
    YM_API_TOKEN: '',
    YM_CAMPAIGN_ID: '',
    VITE_AI_API_KEY: '',
    VITE_AI_PROVIDER: 'openai',
    VITE_AI_MODEL: 'gpt-4',
  };

  // Override with environment variables if available
  if (import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID) {
    config.VITE_GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string;
  }
  if (import.meta.env.VITE_GOOGLE_REDIRECT_URI) {
    config.VITE_GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI as string;
  }
  if (import.meta.env.WB_API_TOKEN) {
    config.WB_API_TOKEN = import.meta.env.WB_API_TOKEN as string;
  }
  if (import.meta.env.OZON_API_CLIENT_ID) {
    config.OZON_API_CLIENT_ID = import.meta.env.OZON_API_CLIENT_ID as string;
  }
  if (import.meta.env.OZON_API_KEY) {
    config.OZON_API_KEY = import.meta.env.OZON_API_KEY as string;
  }
  if (import.meta.env.YM_API_TOKEN) {
    config.YM_API_TOKEN = import.meta.env.YM_API_TOKEN as string;
  }
  if (import.meta.env.YM_CAMPAIGN_ID) {
    config.YM_CAMPAIGN_ID = import.meta.env.YM_CAMPAIGN_ID as string;
  }
  if (import.meta.env.VITE_AI_API_KEY) {
    config.VITE_AI_API_KEY = import.meta.env.VITE_AI_API_KEY as string;
  }

  return config;
}

export const envConfig = validateEnvironment();
