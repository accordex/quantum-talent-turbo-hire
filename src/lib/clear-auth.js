import { removeAccessToken } from '@base44/sdk';

/** Clear stored tokens without redirecting to Base44 login/logout URLs. */
export function clearLocalAuth() {
  removeAccessToken();
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('token');
  }
}
