import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useLocalStorage('techTrackerAuth', {
    isAuthenticated: false,
    user: null
  });

  const login = (userName = 'Администратор') => {
    setAuthState({
      isAuthenticated: true,
      user: {
        name: userName
      }
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
  };

  const value = useMemo(() => ({
    ...authState,
    login,
    logout
  }), [authState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }

  return context;
}

