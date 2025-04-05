
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Settings, 
  Mail, 
  LogOut, 
  Calculator 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-mathpath-purple text-white p-2 rounded-full">
              <Calculator size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900">MathMaster</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full bg-mathpath-purple text-white w-64 p-6 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Hi, {user?.username}</h2>
        <div className="mt-4 bg-white/10 p-4 rounded-xl">
          <div className="text-sm mb-2">Level Progress:</div>
          <Progress value={0} className="bg-white/20 h-2" />
          <div className="text-right text-sm mt-1">0%</div>
        </div>
      </div>
      
      <div className="flex-1 border-2 border-dashed border-white/30 rounded-xl p-4 flex flex-col gap-3">
        <Link to="/" className="flex items-center gap-3 bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-xl">
          <Home size={20} />
          <span>Home</span>
        </Link>
        
        <Link to="/practice" className="flex items-center gap-3 bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-xl">
          <BookOpen size={20} />
          <span>Practice</span>
        </Link>

        <Link to="/contact" className="flex items-center gap-3 bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-xl">
          <Mail size={20} />
          <span>Contact Us</span>
        </Link>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-xl mt-auto"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
