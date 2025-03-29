
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, Download, BarChart as BarChartIcon } from 'lucide-react';

// Sample data
const averageScores = [
  { name: 'Level 1', quiz: 78 },
  { name: 'Level 2', quiz: 72 },
  { name: 'Level 3', quiz: 65 },
];

const passRates = [
  { name: 'Level 1', passed: 85, failed: 15 },
  { name: 'Level 2', passed: 68, failed: 32 },
  { name: 'Level 3', passed: 55, failed: 45 },
];

const progressData = [
  { month: 'Jan', users: 10, quizzes: 45, avgScore: 68 },
  { month: 'Feb', users: 15, quizzes: 78, avgScore: 70 },
  { month: 'Mar', users: 18, quizzes: 95, avgScore: 72 },
  { month: 'Apr', users: 25, quizzes: 120, avgScore: 75 },
  { month: 'May', users: 30, quizzes: 150, avgScore: 76 },
  { month: 'Jun', users: 35, quizzes: 180, avgScore: 79 },
];

const recentQuizzes = [
  {
    id: '1',
    user: 'Alex Smith',
    level: 'Level 1',
    score: 8,
    total: 10,
    percentage: 80,
    date: '2023-10-25',
    passed: true
  },
  {
    id: '2',
    user: 'Jamie Brown',
    level: 'Level 2',
    score: 7,
    total: 10,
    percentage: 70,
    date: '2023-10-24',
    passed: true
  },
  {
    id: '3',
    user: 'Taylor Wilson',
    level: 'Level 1',
    score: 6,
    total: 10,
    percentage: 60,
    date: '2023-10-23',
    passed: false
  },
  {
    id: '4',
    user: 'Morgan Lee',
    level: 'Level 2',
    score: 9,
    total: 10,
    percentage: 90,
    date: '2023-10-22',
    passed: true
  }
];

const QuizReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <span className="text-2xl font-bold text-mathpath-purple">Quiz Reports</span>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Quiz Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">76%</div>
              <div className="text-xs text-green-500 mt-1">↑ 5% from previous period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quizzes Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">247</div>
              <div className="text-xs text-green-500 mt-1">↑ 12% from previous period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">68%</div>
              <div className="text-xs text-red-500 mt-1">↓ 3% from previous period</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="levels">By Level</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChartIcon className="mr-2 h-5 w-5" />
                    Quiz Performance by Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={averageScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="quiz" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChartIcon className="mr-2 h-5 w-5" />
                    Pass/Fail Rate by Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={passRates}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="passed" stackId="a" fill="#4ade80" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="failed" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="levels" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Level</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Select a level to see detailed statistics</p>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 bg-gray-100 p-3 text-sm font-medium">
                    <div>Level</div>
                    <div>Average Score</div>
                    <div>Pass Rate</div>
                    <div>Quizzes Taken</div>
                  </div>
                  
                  <div className="divide-y">
                    <div className="grid grid-cols-4 p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Level 1</div>
                      <div>78%</div>
                      <div>85%</div>
                      <div>124</div>
                    </div>
                    <div className="grid grid-cols-4 p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Level 2</div>
                      <div>72%</div>
                      <div>68%</div>
                      <div>98</div>
                    </div>
                    <div className="grid grid-cols-4 p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Level 3</div>
                      <div>65%</div>
                      <div>55%</div>
                      <div>25</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgScore" stroke="#9b87f5" strokeWidth={2} />
                      <Line type="monotone" dataKey="quizzes" stroke="#4ade80" strokeWidth={2} />
                      <Line type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
                <div className="col-span-3">Student</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Status</div>
              </div>
              
              <div className="divide-y">
                {recentQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="grid grid-cols-12 p-3 text-sm items-center"
                  >
                    <div className="col-span-3 font-medium">{quiz.user}</div>
                    <div className="col-span-2">{quiz.level}</div>
                    <div className="col-span-2">
                      {quiz.score}/{quiz.total} ({quiz.percentage}%)
                    </div>
                    <div className="col-span-2">{quiz.date}</div>
                    <div className="col-span-3">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quiz.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.passed ? 'Passed' : 'Failed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QuizReports;
