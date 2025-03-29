
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-mathpath-purple text-white p-4 rounded-full mb-6">
        <Calculator size={36} />
      </div>
      
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Oops! We couldn't find this page.
      </p>
      
      <div className="space-y-4 w-full max-w-xs">
        <Link to="/">
          <Button className="w-full bg-mathpath-purple hover:bg-purple-600">
            Go to Home
          </Button>
        </Link>
        
        <Link to="/practice">
          <Button variant="outline" className="w-full">
            Go to Practice
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
