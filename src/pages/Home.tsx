
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define level progression data
const levels = [
  {
    id: 1,
    name: "Level 1",
    color: "bg-pink-500",
    textColor: "text-white",
    sublevels: [
      { id: 1, name: "Sublevel 1", color: "bg-pink-500" },
    ]
  },
  {
    id: 2,
    name: "Level 2",
    color: "bg-yellow-400",
    textColor: "text-black",
    sublevels: [
      { id: 1, name: "Sublevel 1", color: "bg-yellow-400" },
      { id: 2, name: "Sublevel 2", color: "bg-yellow-400" },
      { id: 3, name: "Sublevel 3", color: "bg-yellow-400" },
    ]
  }
];

// Mock user progress data
const mockProgress = {
  currentLevel: 2,
  currentSublevel: 2,
  subLevels: {
    1: { completed: [true] },
    2: { completed: [true, false, false] },
  }
};

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(mockProgress);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }

    if (user) {
      if (user.isAdmin === true) {
        navigate("/admin");
      }
      if (user.completedQuiz !== true) {
        navigate("/initial-quiz");
      }
      // Set user progress
      setProgress({
        ...mockProgress,
        currentLevel: user.level || 1
      });
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen bg-sky-100">
      <Header />
      
      <main className="ml-64 pt-8 px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Home</h1>
        
        <div className="relative">
          {/* Learning Path Visualization */}
          <div className="learning-path">
            {/* Level 1 path - bottom right */}
            <div className="absolute bottom-4 right-20">
              <div className={`${levels[0].color} text-white px-6 py-2 rounded-full font-bold`}>
                {levels[0].name}
              </div>
              <div className="absolute -top-28 -left-4">
                <div className="relative">
                  <div className="absolute h-28 w-1 bg-pink-500 -top-2 left-1/2 transform -translate-x-1/2"></div>
                  <div className={`${levels[0].sublevels[0].color} w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold`}>
                    {levels[0].sublevels[0].name}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connecting path from Level 1 to Level 2 */}
            <div className="absolute bottom-36 right-64">
              <div className="h-40 w-1 bg-gradient-to-t from-pink-500 to-yellow-400 transform rotate-45 origin-bottom-right"></div>
            </div>
            
            {/* Level 2 path - middle */}
            <div className="absolute bottom-96 right-96">
              <div className={`${levels[1].color} ${levels[1].textColor} px-6 py-2 rounded-full font-bold`}>
                {levels[1].name}
              </div>
              
              {/* Sublevel 2-1 */}
              <div className="absolute top-20 left-36">
                <div className="relative">
                  <div className="absolute h-20 w-1 bg-yellow-400 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"></div>
                  <div className={`${levels[1].sublevels[1].color} w-24 h-24 rounded-full flex items-center justify-center ${levels[1].textColor} font-semibold`}>
                    {levels[1].sublevels[1].name}
                  </div>
                </div>
              </div>
              
              {/* Sublevel 2-2 */}
              <div className="absolute top-28 left-96">
                <div className="relative">
                  <div className="absolute h-28 w-1 bg-yellow-400 -top-28 left-1/2 transform -translate-x-1/2"></div>
                  <div className={`${levels[1].sublevels[0].color} w-24 h-24 rounded-full flex items-center justify-center ${levels[1].textColor} font-semibold`}>
                    {levels[1].sublevels[2].name}
                  </div>
                </div>
              </div>
              
              {/* Sublevel 2-3 */}
              <div className="absolute -top-36 left-52">
                <div className="relative">
                  <div className="absolute h-36 w-1 bg-yellow-400 bottom-0 left-1/2 transform -translate-x-1/2"></div>
                  <div className={`${levels[1].sublevels[0].color} w-24 h-24 rounded-full flex items-center justify-center ${levels[1].textColor} font-semibold animate-pulse-subtle shadow-lg`}>
                    {levels[1].sublevels[0].name}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Continue Practice Button */}
            <div className="absolute top-1/2 right-20 transform -translate-y-1/2">
              <Link to="/practice">
                <Button className="bg-mathpath-purple hover:bg-purple-700 text-white px-6 py-2 rounded-full flex items-center gap-2 text-lg shadow-lg">
                  Continue Practice
                  <ArrowRight className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
