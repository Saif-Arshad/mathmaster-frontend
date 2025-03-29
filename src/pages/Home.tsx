
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { ArrowRight, Trophy, Star, Layers, Sparkles } from 'lucide-react';

// Define level progression data
const levels = [
  {
    id: 1,
    name: "Counting & Basic Addition",
    description: "Learn to count and add small numbers",
    color: "bg-mathpath-blue",
    icon: <Layers className="h-5 w-5" />
  },
  {
    id: 2,
    name: "Subtraction Starter",
    description: "Master the basics of subtraction",
    color: "bg-mathpath-green",
    icon: <Star className="h-5 w-5" />
  },
  {
    id: 3,
    name: "Multiplication Explorer",
    description: "Begin your multiplication journey",
    color: "bg-mathpath-yellow",
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    id: 4,
    name: "Division Discoverer",
    description: "Unlock the secrets of division",
    color: "bg-mathpath-red",
    icon: <Trophy className="h-5 w-5" />
  },
  {
    id: 5,
    name: "Math Master",
    description: "Combine all your skills",
    color: "bg-mathpath-purple",
    icon: <Trophy className="h-5 w-5" />
  }
];

// Mock user progress data - in a real app, this would come from the backend
const mockProgress = {
  currentLevel: 2,
  subLevels: {
    1: { completed: [true, true, true] },
    2: { completed: [true, false, false] },
    3: { completed: [false, false, false] },
    4: { completed: [false, false, false] },
    5: { completed: [false, false, false] }
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
    
    // In a real app, you would fetch the user's progress from the backend
    // For now, we'll just use mock data
    if (user) {
      setProgress({
        ...mockProgress,
        currentLevel: user.level || 1
      });
    }
  }, [isAuthenticated, navigate, user]);

  const renderSubLevelMarker = (levelId: number, subLevelIndex: number) => {
    const isCompleted = progress.subLevels[levelId]?.completed[subLevelIndex] || false;
    const isCurrentLevel = levelId === progress.currentLevel;
    const isPreviousSubLevelCompleted = 
      subLevelIndex === 0 || progress.subLevels[levelId]?.completed[subLevelIndex - 1];
    const isActive = isCurrentLevel && isPreviousSubLevelCompleted && !isCompleted;
    
    return (
      <div 
        className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
          isCompleted 
            ? "bg-mathpath-green text-white" 
            : isActive
              ? "bg-mathpath-purple text-white animate-pulse-subtle"
              : "bg-gray-200 text-gray-400"
        }`}
      >
        {subLevelIndex === 2 && isCompleted && (
          <div className="absolute -top-1 -right-1">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
        )}
        {subLevelIndex + 1}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Math Journey</h1>
          <p className="text-gray-600 mt-2">
            Track your progress and continue learning
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
                <CardDescription>
                  Follow the path to improve your math skills
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-10">
                  {levels.map((level, index) => (
                    <div key={level.id} className="relative">
                      {/* Connect line between levels */}
                      {index < levels.length - 1 && (
                        <div className="absolute left-6 top-14 w-0.5 h-14 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start">
                        <div className={`shrink-0 w-12 h-12 rounded-full ${level.color} text-white flex items-center justify-center`}>
                          {level.icon}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-lg text-gray-900">
                            Level {level.id}: {level.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4">
                            {level.description}
                          </p>
                          
                          <div className="flex items-center space-x-6">
                            {[0, 1, 2].map((subLevel) => (
                              <div key={subLevel} className="flex flex-col items-center">
                                {renderSubLevelMarker(level.id, subLevel)}
                                <span className="text-xs mt-1 text-gray-500">
                                  {subLevel === 2 ? "Quiz" : `Sublevel ${subLevel + 1}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-md mb-6">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${levels[progress.currentLevel - 1]?.color} text-white`}>
                    <span className="text-2xl font-bold">{progress.currentLevel}</span>
                  </div>
                  <h3 className="font-medium text-lg text-gray-900">
                    {levels[progress.currentLevel - 1]?.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {levels[progress.currentLevel - 1]?.description}
                  </p>
                </div>
                
                <div className="mt-6">
                  <Link to="/practice">
                    <Button className="w-full bg-mathpath-purple hover:bg-purple-600 flex items-center justify-center">
                      Continue Practice
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex">
                    <div className="bg-mathpath-lightGreen p-2 rounded-full mr-3">
                      <span className="text-mathpath-green">✓</span>
                    </div>
                    <span>Practice regularly, even if just for 10 minutes</span>
                  </li>
                  <li className="flex">
                    <div className="bg-mathpath-lightBlue p-2 rounded-full mr-3">
                      <span className="text-mathpath-blue">✓</span>
                    </div>
                    <span>Use the hint button when you're truly stuck</span>
                  </li>
                  <li className="flex">
                    <div className="bg-mathpath-lightYellow p-2 rounded-full mr-3">
                      <span className="text-mathpath-yellow">✓</span>
                    </div>
                    <span>Review questions you got wrong to learn from them</span>
                  </li>
                  <li className="flex">
                    <div className="bg-mathpath-lightPurple p-2 rounded-full mr-3">
                      <span className="text-mathpath-purple">✓</span>
                    </div>
                    <span>Take quizzes when you feel confident and ready</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
