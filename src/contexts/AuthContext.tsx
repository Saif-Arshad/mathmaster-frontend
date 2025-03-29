/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  const [userId, setUserId] = useState()
  useEffect(() => {
    const storedUser = localStorage.getItem('mathmaster_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem('mathmaster_userID');
    if (storedUser) {
      setUserId(JSON.parse(storedUser).id);
    }
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
    const payload = {
      email,
      username,
      password,
      age
    }



    try {

      setIsLoading(true);
      setError(null);


      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, payload)
      console.log("🚀 ~ register ~ res:", res.data)
      if (res.data) {
        localStorage.setItem("mathmaster_userID", JSON.stringify({
          id: res.data.user_id
        }))
        window.location.href = "/verify"
        toast.success(res.data.message)
      }
      else {
        toast.error("Something went wrong")
      }


    } catch (err) {
      console.log("🚀 ~ register ~ err:", err)
      console.log("🚀 ~ register ~ err:", err.response)
      setError((err as any).response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!userId) {
      setError('Please Register First');
      return
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp`, { user_id: userId, code: otp })
      if (res.data) {
        localStorage.setItem('mathmaster_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsVerifying(false);
        setUnverifiedEmail(null);
        toast.success(res.data.message)
        window.location.href = "/login"

      }

    } catch (err) {
      console.log("🚀 ~ verifyOTP ~ err:", err)
      setError((err as any).response.data.message);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!userId) {
      setError('Please Register First');
      return
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resend-otp`, { user_id: userId })
      if (res.data) {
        toast.success(res.data.message)
      }
    } catch (err) {
      setError((err as any).response.data.message);

    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        username,
        password
      }
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, payload)


      if (res.data) {


        const { password: _, ...userWithoutPassword } = res.data.user;
        const userData = {
          ...userWithoutPassword,
          token: res.data.token
        }

        localStorage.setItem('mathmaster_user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (err) {
      setError((err as any).response.data.message);

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mathmaster_user');
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
