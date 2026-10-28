import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { loginWithUsernamePassword } from './services/authService';
import type { FitnessMember } from './types';

interface AuthContextValue {
  user: FitnessMember | null;
  login: (username: string, password: string) => Promise<FitnessMember | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<FitnessMember | null>(null);

  async function login(username: string, password: string) {
    const profile = await loginWithUsernamePassword(username, password);
    setUser(profile);
    return profile;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
