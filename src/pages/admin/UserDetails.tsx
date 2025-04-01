
import React, { useState } from 'react';
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

// Sample data - would come from API in real application
const sampleUserDetails = {
  id: '1',
  name: 'Alex Smith',
  email: 'alex@example.com',
  age: 8,
  level: 2,
  status: 'active',
  joinDate: '2023-09-15',
  quizzesTaken: 5,
  lastLogin: '2023-10-25',
  parentName: 'Jane Smith',
  parentEmail: 'jane@example.com',
  phoneNumber: '(555) 123-4567',
  recentActivity: [
    { date: '2023-10-25', activity: 'Completed practice session', result: 'Solved 8/10 questions' },
    { date: '2023-10-23', activity: 'Took level 2 quiz', result: 'Passed with 85%' },
    { date: '2023-10-20', activity: 'Completed practice session', result: 'Solved 7/10 questions' },
  ],
  quizHistory: [
    { date: '2023-10-23', level: 2, score: '85%', passed: true },
    { date: '2023-10-15', level: 2, score: '65%', passed: false },
    { date: '2023-10-10', level: 1, score: '90%', passed: true },
  ]
};

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  
  // In a real app, we would fetch the user details based on userId
  const userDetails = sampleUserDetails;
  
  const handleAction = (action: string) => {
    switch (action) {
      case 'email':
        setIsEmailDialogOpen(true);
        break;
      case 'block':
        toast({
          title: userDetails.status === 'active' ? "User blocked" : "User unblocked",
          description: `${userDetails.name} has been ${userDetails.status === 'active' ? 'blocked' : 'unblocked'} successfully.`,
        });
        break;
      case 'reset':
        toast({
          title: "Password reset",
          description: `A password reset link has been sent to ${userDetails.email}.`,
        });
        break;
      default:
        break;
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-mathpath-purple text-white flex items-center justify-center text-2xl font-bold mb-2">
                    {userDetails.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold">{userDetails.name}</h3>
                  <p className="text-sm text-gray-500">{userDetails.email}</p>
                  <Badge className={userDetails.status === 'active' ? 'bg-green-500 mt-2' : 'bg-red-500 mt-2'}>
                    {userDetails.status === 'active' ? 'Active' : 'Blocked'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{userDetails.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Level:</span>
                    <span className="font-medium">{userDetails.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-medium">{userDetails.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Login:</span>
                    <span className="font-medium">{userDetails.lastLogin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quizzes Taken:</span>
                    <span className="font-medium">{userDetails.quizzesTaken}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button 
                    onClick={() => handleAction('email')}
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mail size={16} />
                    Send Email
                  </Button>
                  <Button 
                    onClick={() => handleAction('reset')}
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RotateCw size={16} />
                    Reset Password
                  </Button>
                  <Button 
                    onClick={() => handleAction('block')}
                    variant="outline" 
                    className={`w-full flex items-center justify-center gap-2 ${userDetails.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                  >
                    <Ban size={16} />
                    {userDetails.status === 'active' ? 'Block User' : 'Unblock User'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="quizzes">Quiz History</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="mr-2 h-5 w-5 text-mathpath-purple" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDetails.recentActivity.map((activity, index) => (
                          <TableRow key={index}>
                            <TableCell>{activity.date}</TableCell>
                            <TableCell>{activity.activity}</TableCell>
                            <TableCell>{activity.result}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quizzes">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDetails.quizHistory.map((quiz, index) => (
                          <TableRow key={index}>
                            <TableCell>{quiz.date}</TableCell>
                            <TableCell>Level {quiz.level}</TableCell>
                            <TableCell>{quiz.score}</TableCell>
                            <TableCell>
                              <Badge className={quiz.passed ? 'bg-green-500' : 'bg-red-500'}>
                                {quiz.passed ? 'Passed' : 'Failed'}
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
                        <h3 className="text-sm font-medium text-gray-500">Parent/Guardian</h3>
                        <p className="mt-1">{userDetails.parentName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Parent Email</h3>
                        <p className="mt-1">{userDetails.parentEmail}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p className="mt-1">{userDetails.phoneNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Email</DialogTitle>
            </DialogHeader>
            
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">To</Label>
                <Input 
                  id="recipient" 
                  value={userDetails.email} 
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Email subject" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message" 
                  className="w-full min-h-[100px] p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mathpath-purple"
                  placeholder="Your message here..."
                />
              </div>
            </form>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-mathpath-purple hover:bg-purple-600"
                onClick={() => {
                  setIsEmailDialogOpen(false);
                  toast({
                    title: "Email sent",
                    description: `Your email has been sent to ${userDetails.name}.`,
                  });
                }}
              >
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default UserDetails;
