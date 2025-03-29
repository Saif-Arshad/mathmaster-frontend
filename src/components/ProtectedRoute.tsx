
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireUnauth?: boolean;
  requireCompletedQuiz?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = false,
  requireUnauth = false,
  requireCompletedQuiz = false,
  requireAdmin = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    }

    if (requireUnauth && isAuthenticated) {
      navigate('/');
    }

    if (requireCompletedQuiz && isAuthenticated && !user?.completedQuiz) {
      navigate('/initial-quiz');
    }

    if (requireAdmin && (!isAuthenticated || !user?.isAdmin)) {
      navigate('/');
    }
  }, [
    isAuthenticated, 
    isLoading, 
    navigate, 
    requireAuth, 
    requireUnauth, 
    requireCompletedQuiz,
    requireAdmin,
    user
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto bg-mathpath-purple rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
