import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion } = appParams;

const appBaseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : (import.meta.env.VITE_BASE44_APP_BASE_URL || '');

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
});
