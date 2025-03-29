
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calculator, Brain, BookOpen, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-mathpath-purple text-white p-2 rounded-full">
            <Calculator size={20} />
          </div>
          <span className="font-bold text-xl text-gray-900">MathPath</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-mathpath-purple flex items-center gap-1">
                <BookOpen size={18} />
                <span>Home</span>
              </Link>
              <Link to="/practice" className="text-gray-700 hover:text-mathpath-purple flex items-center gap-1">
                <Brain size={18} />
                <span>Practice</span>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Hello,</span>
                <span className="font-medium ml-1">{user?.username}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
