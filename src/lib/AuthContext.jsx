import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { clearLocalAuth } from '@/lib/clear-auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setAuthError(null);

      if (!appParams.token) {
        if (!cancelled) {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
        return;
      }

      try {
        const currentUser = await base44.auth.me();
        if (!cancelled) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn('Optional auth check failed, continuing as guest:', error?.message);
        clearLocalAuth();
        if (!cancelled) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  const logout = () => {
    clearLocalAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    // Auth disabled — no external redirect
  };

  const checkUserAuth = async () => {
    if (!appParams.token) {
      setIsAuthenticated(false);
      setUser(null);
      setAuthChecked(true);
      return;
    }
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      clearLocalAuth();
      setIsAuthenticated(false);
      setUser(null);
    }
    setAuthChecked(true);
  };

  const checkAppState = async () => {
    setAppPublicSettings(null);
    await checkUserAuth();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
