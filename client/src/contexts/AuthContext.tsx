import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  likedSongs?: any[];
  playlists?: any[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email, password) => Promise<void>;
  register: (name, email, password) => Promise<void>;
  logout: () => void;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await api.auth.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    checkUser().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    localStorage.setItem('token', data.token); // Store token
    setUser(data);
  };

  const register = async (name, email, password) => {
    const data = await api.auth.register(name, email, password);
    localStorage.setItem('token', data.token); // Store token
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  console.log("AuthProvider Rendering", { hasUser: !!user });
  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
