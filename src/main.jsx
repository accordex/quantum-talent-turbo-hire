import React from 'react'
import ReactDOM from 'react-dom/client'
import { clearLocalAuth } from '@/lib/clear-auth'
import App from '@/App.jsx'
import '@/index.css'

// Drop stale platform tokens/URLs so SDK logout does not send users to base44.app
if (typeof window !== 'undefined') {
  const staleBase = localStorage.getItem('base44_app_base_url');
  if (staleBase?.includes('base44.app')) {
    localStorage.removeItem('base44_app_base_url');
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('clear_access_token') === 'true') {
    clearLocalAuth();
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
