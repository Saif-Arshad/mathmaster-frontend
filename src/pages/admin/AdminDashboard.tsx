
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, BarChart, Settings, Layers, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-mathpath-purple">MathMaster Admin</span>
            </div>
            <div>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your MathPath application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/users" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-mathpath-purple" />
                  Manage Users
                </CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Block/unblock accounts, view progress, reset passwords
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/questions" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-mathpath-purple" />
                  Manage Questions
                </CardTitle>
                <CardDescription>Add, edit or delete questions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Modify practice and quiz questions across all levels
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/levels" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-mathpath-purple" />
                  Manage Levels
                </CardTitle>
                <CardDescription>Configure learning levels</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Add, edit or remove learning levels and sublevels
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/reports" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-mathpath-purple" />
                  Quiz Reports
                </CardTitle>
                <CardDescription>View student performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Generate and analyze student progress and quiz results
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-mathpath-purple" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Adjust quiz passing percentages and other system settings
              </p>
              <Button className="w-full bg-mathpath-purple hover:bg-purple-600">
                Edit Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
