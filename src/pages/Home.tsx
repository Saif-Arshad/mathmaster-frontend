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

const BUBBLE = 96;            // px diameter for level bubble
const SUB_BUBBLE = 72;        // px diameter for sub‑level bubble
const GAP_X = 220;            // horizontal gap between levels
const GAP_Y = 140;            // vertical distance from level to its sub‑levels

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

  const levelColor = (i: number) => ['bg-pink-500', 'bg-yellow-400', 'bg-sky-400'][i % 3];
  const levelText = (i: number) => (i === 1 ? 'text-black' : 'text-white');

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading…</div>;

  return (
    <div className="min-h-screen bg-sky-100">
      <Header />

      <main className="ml-64 pt-8 px-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Home</h1>

        <div className="overflow-x-auto pb-24">
          <div className="relative h-[260px] w-max pl-10 pr-40">{/* timeline container */}
            {levels.map((lvl, lIdx) => {
              const x = lIdx * GAP_X;
              const color = levelColor(lIdx);
              const txt = levelText(lIdx);

              return (
                <div key={lvl.level_id} className="absolute top-[160px]" style={{ left: x }}>
                  <div className={`${color} ${txt} w-[${BUBBLE}px] h-[${BUBBLE}px] rounded-full flex items-center justify-center font-bold shadow-lg`}>
                    {lvl.level_name}
                  </div>
                  {lvl.sublevels.map((sub, sIdx) => {
                    const subX = x + (sIdx + 1) * (SUB_BUBBLE + 40);
                    const subY = 0;
                    const levelCenterX = x + BUBBLE / 2;
                    const levelCenterY = 160 + BUBBLE / 2;
                    const subCenterX = subX + SUB_BUBBLE / 2;
                    const subCenterY = subY + SUB_BUBBLE / 2;

                    // SVG quadratic curve path
                    const path = `M${levelCenterX},${levelCenterY} Q${levelCenterX},${subCenterY} ${subCenterX},${subCenterY}`;

                    return (
                      <React.Fragment key={sub.sublevel_id}>
                        {/* curve */}
                        <svg className="absolute pointer-events-none" style={{ left: 0, top: 0 }} width={subCenterX} height={levelCenterY}>
                          <path d={path} strokeWidth={4} stroke={color.replace('bg-', '').replace('-500', '') || '#000'} fill="none" />
                        </svg>
                        {/* sub‑bubble */}
                        <div className={`absolute ${color} ${txt} w-[${SUB_BUBBLE}px] h-[${SUB_BUBBLE}px] rounded-full flex items-center justify-center font-semibold shadow`} style={{ left: subX, top: subY }}>
                          {`Sub ${sIdx + 1}`}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}

            {/* Continue button fixed to the right */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 pr-10">
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