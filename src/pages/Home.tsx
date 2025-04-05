
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

interface Sublevel { sublevel_id: number; sublevel_discription: string; }
interface Level { level_id: number; level_name: string; sublevels: Sublevel[]; }

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (user?.isAdmin) navigate('/admin');
    if (user && user.completedQuiz === false) navigate('/initial-quiz');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/admin/levels`);
        setLevels(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load levels', variant: 'destructive' });
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading…</div>;

  return (
    <div className="min-h-screen bg-sky-100">
      <Header />

      <main className="ml-64 pt-8 px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Home</h1>

        <div className="relative overflow-x-auto pb-24">
          {/* Level progression visualization */}
          <div className="learning-path min-h-[400px] w-full px-6 relative">
            {levels.map((level, i) => (
              <div key={level.level_id} className="level-container relative">
                {/* Level bubble */}
                <div 
                  className={`level-bubble absolute ${i % 2 === 0 ? 'right-10' : 'left-10'} ${i === 0 ? 'bottom-0' : ''}`}
                  style={{
                    bottom: `${i * 80}px`,
                    transform: i % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)',
                  }}
                >
                  <div className={`${i % 2 === 0 ? 'bg-pink-500' : 'bg-yellow-400'} text-white font-bold px-6 py-3 rounded-lg shadow-lg`}>
                    {level.level_name}
                  </div>
                  
                  {/* Sublevels */}
                  {level.sublevels.map((sublevel, j) => (
                    <div 
                      key={sublevel.sublevel_id}
                      className="sublevel-bubble absolute"
                      style={{
                        left: i % 2 === 0 ? `-${180 + j * 20}px` : `${100 + j * 20}px`,
                        bottom: `${50 + j * 70}px`,
                        zIndex: level.sublevels.length - j,
                      }}
                    >
                      <div className="relative">
                        {/* Connector line */}
                        <div 
                          className={`absolute ${i % 2 === 0 ? 'right-full' : 'left-full'} top-1/2 h-1 ${i % 2 === 0 ? 'bg-pink-400' : 'bg-yellow-500'}`} 
                          style={{ 
                            width: `${40 + j * 5}px`,
                            transform: 'translateY(-50%)'
                          }}
                        ></div>
                        
                        {/* Sublevel circle */}
                        <div className="relative z-10 bg-yellow-300 w-16 h-16 rounded-full flex items-center justify-center font-bold text-black shadow-md">
                          Sublevel {j + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Continue Practice Button */}
            <div className="absolute bottom-0 right-0 mb-10">
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
