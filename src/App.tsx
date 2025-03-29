
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import InitialQuiz from "./pages/InitialQuiz";
import Practice from "./pages/Practice";
import QuizResults from "./pages/QuizResults";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ManageLevels from "./pages/admin/ManageLevels";
import ManageUsers from "./pages/admin/ManageUsers";
import QuizReports from "./pages/admin/QuizReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* User routes */}
            <Route path="/" element={<Home />} />
            <Route path="/initial-quiz" element={<InitialQuiz />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/questions" element={<ManageQuestions />} />
            <Route path="/admin/levels" element={<ManageLevels />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<QuizReports />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
