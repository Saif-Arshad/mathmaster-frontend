
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  username: string;
  age: number;
  level: number;
  completedQuiz: boolean;
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
    // Check for stored user in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('mathpath_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock user database - in a real app, this would be in your backend
  const mockUsers = [
    {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: 'Password123',
      age: 10,
      level: 1,
      completedQuiz: true
    }
  ];

  const register = async (email: string, username: string, password: string, age: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(
        u => u.email === email || u.username === username
      );
      
      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }
      
      // In a real app, we would send an OTP to the email
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any 6-digit OTP is considered valid
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        // In a real app, we would create the user in the database here
        const newUser = {
          id: String(mockUsers.length + 1),
          email: unverifiedEmail!,
          username: `user${Math.floor(Math.random() * 1000)}`,
          age: 10,
          level: 0, // Initial level before assessment
          completedQuiz: false
        };
        
        // Store user in localStorage (simulating persistence)
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would resend the OTP to the email
      // For now, we just show a success message
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage (simulating persistence)
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
