/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as Tooltip from '@radix-ui/react-tooltip';

const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

interface Sublevel {
  sublevel_id: number;
  sublevel_discription: string;
  isCompleted?: boolean;
}

interface Level {
  level_id: number;
  level_name: string;
  discription: string;
  sublevels: Sublevel[];
}

const LEVEL_DIAMETER = 126;
const SUB_DIAMETER = 92;
const STEP_Y = 160;
const STEP_X = 600;
const WAVELENGTH = 3;

type Node = {
  id: string;
  order: number;
  radius: number;
  label: string;
  isCompleted: boolean;
  progressPct?: number;
  description: string;
};

const CircleTip: React.FC<{ tip: React.ReactNode; children: React.ReactNode }> = ({
  tip,
  children,
}) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content
        className="rounded bg-black/80 text-white px-3 py-1 text-center text-xs shadow-md select-none"
        sideOffset={6}
      >
        {tip}
        <Tooltip.Arrow className="fill-black/80" />
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
);

const WaveMask: React.FC = () => (
  <svg width="0" height="0">
    <defs>
      <clipPath id="wave" clipPathUnits="objectBoundingBox">
        <path
          d="
          M0,0.8
          C0.25,0.9 0.25,0.7 0.5,0.8
          C0.75,0.9 0.75,0.7 1,0.8
          L1,1 L0,1 Z
        "
        />
      </clipPath>
    </defs>
  </svg>
);

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);

  // Redirects
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (user?.isAdmin) navigate('/admin');
    if (user && user.completedQuiz === false) navigate('/initial-quiz');
  }, [isAuthenticated, user, navigate]);

  // Fetch levels
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/admin/levels-sublevels`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        console.log("🚀 ~ data:", data)
        const ordered = [...data].sort(
          (a: Level, b: Level) =>
            Number(a.level_name.split(' ')[1]) - Number(b.level_name.split(' ')[1]),
        );
        setLevels(ordered);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'Failed to load levels',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // Build graph nodes
  const nodes: Node[] = useMemo(() => {
    const out: Node[] = [];
    levels.forEach((lvl) => {
      const completedSubs = lvl.sublevels.filter((s) => s.isCompleted).length;
      const pct = lvl.sublevels.length
        ? (completedSubs / lvl.sublevels.length) * 100
        : 0;
      out.push({
        id: `level-${lvl.level_id}`,
        order: out.length,
        radius: LEVEL_DIAMETER / 2,
        label: lvl.level_name,
        isCompleted: pct === 100,
        progressPct: pct,
        description: lvl.discription,
      });
      lvl.sublevels.forEach((sub, sIdx) => {
        out.push({
          id: `sub-${sub.sublevel_id}`,
          order: out.length,
          radius: SUB_DIAMETER / 2,
          label: `SubLevel ${sIdx + 1}`,
          isCompleted: Boolean(sub.isCompleted),
          description: lvl.discription,
        });
      });
    });
    return out;
  }, [levels]);

  const totalHeight = nodes.length * STEP_Y + LEVEL_DIAMETER;
  const logicalWidth = STEP_X + LEVEL_DIAMETER + 80;

  useEffect(() => {
    const calcScale = () => {
      const available = window.innerWidth - 300;
      const newScale = available < logicalWidth ? available / logicalWidth : 1;
      setScale(newScale);
    };
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, [logicalWidth]);

  const amplitude = STEP_X;
  const k = Math.PI / WAVELENGTH;

  const coords = (n: Node) => {
    const i = n.order;
    const y = i * STEP_Y;
    const angle = (i / WAVELENGTH) * Math.PI;
    const x = ((Math.sin(angle) + 1) / 2) * amplitude;
    return { x, y };
  };

  const df_di = (i: number) => (amplitude / 2) * k * Math.cos(k * i);

  const centers = nodes.map((n) => {
    const { x, y } = coords(n);
    const cx = x + n.radius;
    const cy = totalHeight - y - n.radius;
    return { cx, cy };
  });

  let pathData = '';
  if (centers.length > 0) {
    pathData = `M ${centers[0].cx} ${centers[0].cy}`;
    for (let i = 0; i < centers.length - 1; i++) {
      const P0 = centers[i];
      const P3 = centers[i + 1];
      const f_prime_i = df_di(i);
      const f_prime_i1 = df_di(i + 1);
      const P1 = {
        cx: P0.cx + (1 / 3) * f_prime_i,
        cy: P0.cy + (1 / 3) * (-STEP_Y),
      };
      const P2 = {
        cx: P3.cx - (1 / 3) * f_prime_i1,
        cy: P3.cy - (1 / 3) * (-STEP_Y),
      };
      pathData += ` C ${P1.cx} ${P1.cy}, ${P2.cx} ${P2.cy}, ${P3.cx} ${P3.cy}`;
    }
  }
  useEffect(() => {
    if (levels) {

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [levels]);
  return (
    <div className="min-h-screen bg-sky-100">
      <Header />
      <Link
        to="/practice"
        className="flex fixed bottom-2 right-4 items-center gap-3 bg-mathpath-purple hover:bg-white/60 text-white hover:text-black transition-colors p-3 rounded-xl"
      >
        <span>Continue Your Practice</span>
      </Link>

      <main className="ml-64 pt-8 px-12">
        {loading ? (
          'Loading...'
        ) : (
          <div className="overflow-x-auto mx-auto pb-24">
            <div
              className="relative mx-auto origin-bottom-left"
              style={{
                height: totalHeight * scale,
                width: logicalWidth * scale,
                transform: `scale(${scale})`,
              }}
            >
              <WaveMask />
              <svg
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: logicalWidth,
                  height: totalHeight,
                  pointerEvents: 'none',
                }}
              >
                <path d={pathData} stroke="#ec4899" strokeWidth="5" fill="none" />
              </svg>
              {nodes.map((n) => {
                const { x, y } = coords(n);
                const left = x;
                const top = totalHeight - y - n.radius * 2;
                const isLevel = n.radius === LEVEL_DIAMETER / 2;

                const baseClass = n.isCompleted
                  ? 'bg-pink-500 text-white'
                  : 'bg-yellow-400 text-black';

                const progressStyle =
                  isLevel && !n.isCompleted && n.progressPct
                    ? {
                      backgroundImage:
                        'linear-gradient( #ff7f00, #ffff00)',
                      transition: 'background-position 0.6s ease-in-out',
                      // backgroundSize: `100% ${n.progressPct}%`,
                      // backgroundRepeat: 'no-repeat',
                      backgroundPosition: `0 ${100 - n.progressPct}%`,
                      // clipPath: 'url(#wave)',
                    }
                    : {};

                return (
                  <CircleTip
                    key={n.id}
                    tip={
                      <>
                        <strong>{n.label}</strong>
                        <br />
                        {n.description}
                      </>
                    }
                  >
                    <div
                      className={`absolute flex items-center justify-center font-medium whitespace-nowrap rounded-full shadow ${baseClass}`}
                      style={{
                        left,
                        top,
                        width: n.radius * 2,
                        height: n.radius * 2,
                        fontSize: isLevel ? '1rem' : '0.8rem',
                        ...progressStyle,
                      }}
                    >
                      {n.label}
                    </div>
                  </CircleTip>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;