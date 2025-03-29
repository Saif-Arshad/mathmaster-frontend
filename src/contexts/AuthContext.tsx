import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  username: string;
  age: number;
  level: number;
  completedQuiz: boolean;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
  register: (email: string, username: string, password: string, age: number) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  resendOTP: () => Promise<void>;
  unverifiedEmail: string | null;
  error: string | null;
  setError: (error: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('mathpath_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const mockUsers = [
    {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123',
      age: 10,
      level: 1,
      completedQuiz: true,
      isAdmin: true
    }
  ];

  const register = async (email: string, username: string, password: string, age: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUser = mockUsers.find(
        u => u.email === email || u.username === username
      );
      
      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }
      
      setUnverifiedEmail(email);
      setIsVerifying(true);
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        const newUser = {
          id: String(mockUsers.length + 1),
          email: unverifiedEmail!,
          username: `user${Math.floor(Math.random() * 1000)}`,
          age: 10,
          level: 0,
          completedQuiz: false,
          isAdmin: false
        };
        
        localStorage.setItem('mathpath_user', JSON.stringify(newUser));
        setUser(newUser);
        setIsVerifying(false);
        setUnverifiedEmail(null);
        return true;
      } else {
        throw new Error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setError('OTP resent successfully!');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      localStorage.setItem('mathpath_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mathpath_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isVerifying,
        register,
        login,
        logout,
        verifyOTP,
        resendOTP,
        unverifiedEmail,
        error,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
