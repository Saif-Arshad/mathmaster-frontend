/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Mail, Ban, RotateCw, LineChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import axios from 'axios';



const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const getUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`)
      if (res.data) {
        setUser(res.data)
      }

    } catch (error) {
      console.log("🚀 ~ getAllUsers ~ error:", error)

    }
  }

  useEffect(() => {
    if (userId) {
      getUser()
    }
  }, [userId])

  const downloadUserReport = async () => {
    setLoading(true);
    try {
      const user_id = userId
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/report/${user_id}`,
        { responseType: "blob" }
      );
      console.log("🚀 ~ downloadUserReport ~ res:", res.data)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user_report_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("🚀 ~ downloadUserReport ~ error:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/users')}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="text-2xl font-bold text-mathpath-purple">User Details</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {
          user ?
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-mathpath-purple text-white flex items-center justify-center text-2xl font-bold mb-2">
                        {user?.username.charAt(0)}
                      </div>
                      <h3 className="text-lg font-bold">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <Badge className={!user.is_blocked ? 'bg-green-500 mt-2' : 'bg-red-500 mt-2'}>
                      { !user.is_blocked ? 'Active' : 'Blocked'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Age:</span>
                        <span className="font-medium">{user.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Level:</span>
                        <span className="font-medium">{user.currentLevel ? user.currentLevel : "Level 1"}</span>
                      </div>

                    </div>

                    <div className="mt-6 space-y-2">

                      <button
                        onClick={downloadUserReport}
                      className="bg-mathpath-purple w-full text-white p-2 rounded">
                       {
                          loading ? "Loading" :"   User Report"
                       }
                     
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-3">
                <Tabs defaultValue="quizzes" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="quizzes">Quiz History</TabsTrigger>
                    <TabsTrigger value="contact">Contact Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="quizzes">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quiz History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Level</TableHead>
                              <TableHead>Sublevel</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Performance</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user?.progressData?.map((quiz: any) => (
                              <TableRow key={quiz.performance_id}>
                                <TableCell>{quiz.level.level_name}</TableCell>
                                <TableCell>Sublevel {quiz.sublevel_id}</TableCell>
                                <TableCell>{quiz.quiz_score}%</TableCell>
                                <TableCell>
                                  {quiz.correct_answers}/{quiz.total_questions} correct
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      quiz.quiz_score >= quiz.level.min_passing_percentage
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                    }
                                  >
                                    {quiz.quiz_score >= quiz.level.min_passing_percentage ? 'Passed' : 'Failed'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contact">
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">

                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="mt-1">{user.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                            <p className="mt-1">Not Provided</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            :
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading user details...</p>
            </div>
        }

     
      </main>
    </div>
  );
};

export default UserDetails;
