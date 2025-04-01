
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
import ManageInitialQuiz from "./pages/admin/ManageInitialQuiz";
import ManageLevels from "./pages/admin/ManageLevels";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/UserDetails";
import SystemSettings from "./pages/admin/SystemSettings";
import QuizReports from "./pages/admin/QuizReports";
import NewPassword from "./pages/NewPassword";
import AdminLogin from "./pages/admin/AdminLogin";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={
                <ProtectedRoute requireUnauth={true}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireUnauth={true}>
                  <Register />
                </ProtectedRoute>
              } />
              <Route path="/verify" element={
                <ProtectedRoute requireUnauth={true}>
                  <VerifyOTP />
                </ProtectedRoute>
              } />
              <Route path="/forgot-password" element={
                <ProtectedRoute requireUnauth={true}>
                  <ForgotPassword />
                </ProtectedRoute>
              } />
              <Route path="/admin-login" element={
                <ProtectedRoute requireUnauth={true}>
                  <AdminLogin />
                </ProtectedRoute>
              } />
              <Route path="/new-password" element={
                <ProtectedRoute requireUnauth={true}>
                  <NewPassword />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={
                <ProtectedRoute requireAuth={true}>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/initial-quiz" element={
                <ProtectedRoute requireAuth={true}>
                  <InitialQuiz />
                </ProtectedRoute>
              } />
              <Route path="/practice" element={
                <ProtectedRoute requireAuth={true}>
                  <Practice />
                </ProtectedRoute>
              } />
              <Route path="/quiz-results" element={
                <ProtectedRoute requireAuth={true}>
                  <QuizResults />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/questions" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <ManageQuestions />
                </ProtectedRoute>
              } />
              <Route path="/admin/initial-quiz" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <ManageInitialQuiz />
                </ProtectedRoute>
              } />
              <Route path="/admin/levels" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <ManageLevels />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/users/:userId" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <UserDetails />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <SystemSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <QuizReports />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
