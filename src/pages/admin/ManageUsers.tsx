
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Search, MoreHorizontal, Ban, Mail, Eye, RotateCw } from 'lucide-react';
import axios from 'axios';

const sampleUsers = [
  {
    id: '1',
    name: 'Alex Smith',
    email: 'alex@example.com',
    age: 8,
    level: 2,
    status: 'active',
    joinDate: '2023-09-15',
    quizzesTaken: 5,
    lastLogin: '2023-10-25'
  },
  {
    id: '2',
    name: 'Jamie Brown',
    email: 'jamie@example.com',
    age: 10,
    level: 3,
    status: 'active',
    joinDate: '2023-08-20',
    quizzesTaken: 8,
    lastLogin: '2023-10-24'
  },
  {
    id: '3',
    name: 'Taylor Wilson',
    email: 'taylor@example.com',
    age: 7,
    level: 1,
    status: 'blocked',
    joinDate: '2023-09-01',
    quizzesTaken: 2,
    lastLogin: '2023-09-15'
  },
  {
    id: '4',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    age: 9,
    level: 2,
    status: 'active',
    joinDate: '2023-10-05',
    quizzesTaken: 4,
    lastLogin: '2023-10-23'
  }
];

const ManageUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [users, setUsers] = useState([])
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [sendEmailData, setSendEmail] = useState({
    userEmail: "",
    userMessage: "",
    userSubject: "",

  })
  console.log("🚀 ~ sendEmailData:", sendEmailData)

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/users`)
      if (res.data) {
        console.log(res.data)
        setUsers(res.data)
      }

    } catch (error) {
      console.log("🚀 ~ getAllUsers ~ error:", error)

    }
  }
  useEffect(() => {
    getAllUsers()
  }, [])

  const handleActionClick = async (userId: string, action: string) => {
    if (action === 'email') {
      setSendEmail({ ...sendEmailData, userEmail: userId ? filteredUsers.find(u => u.user_id === userId)?.email || '' : '' })
      setIsEmailDialogOpen(true);
    } else if (action === 'view') {
      navigate(`/admin/users/${userId}`);
    }
    else if (action === 'block') {
      const user = filteredUsers.find(u => u.user_id === userId);
      const newStatus = !user.is_blocked ? 'blocked' : 'active';
      if (user.is_blocked) {
        const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/unblock-user/${user.user_id}`);
        if (res.data) {
       
          toast({
            title: newStatus === 'active' ? "User unblocked" : "User blocked",
            description: `${user?.username} has been ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully.`,
          });
        }
      } else {
        const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/block-user/${user.user_id}`);
        if (res.data) {
          toast({
            title: newStatus === 'active' ? "User unblocked" : "User blocked",
            description: `${user?.username} has been ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully.`,
          });
        }
      }

    }
  };
  const sendEmail = async () => {
    if (!sendEmailData.userEmail || !sendEmailData.userMessage || !sendEmailData.userSubject) {
      toast({
        title: "All Fields are required",
        description: `Please fill Email Subject and message`,
      });
      return;
    }

    toast({
      title: "Sending email...",
      description: "Please wait while we send your email.",
    });

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/send-email`, sendEmailData);
      if (res.data?.message) {
        toast({
          title: "Success",
          description: res.data.message,
        });
        setIsEmailDialogOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email. Please try again.",
      });
    }
  };

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
              <span className="text-2xl font-bold text-mathpath-purple">Manage Users</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
                <div className="col-span-3">User Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-1">Age</div>
                <div className="col-span-1">Level</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Is Verified</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.user_id}
                      className="grid grid-cols-12 p-3 text-sm items-center"
                    >
                      <div className="col-span-3 font-medium capitalize">{user.username}</div>
                      <div className="col-span-3 text-gray-600">{user.email}</div>
                      <div className="col-span-1 text-gray-600">{user.age}</div>
                      <div className="col-span-1 text-gray-600">1</div>
                      <div className="col-span-1">
                        <Badge className={!user.is_blocked ? 'bg-green-500' : 'bg-red-500'}>
                          {!user.is_blocked ? 'Active' : 'Blocked'}
                        </Badge>
                      </div>
                      <div className="col-span-1">
                        <Badge className={user.is_verified ? 'bg-green-500' : 'bg-red-500'}>
                          {user.is_verified ? 'Verified' : 'Not Verified'}
                        </Badge>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleActionClick(user.user_id, 'view')}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(user.user_id, 'email')}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(user.user_id, 'block')} className="text-red-500">
                              <Ban className="mr-2 h-4 w-4" />
                              {!user.is_blocked ? 'Block User' : 'Unblock User'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No users found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                  value={sendEmailData.userEmail}
                  onChange={(e) => {
                    setSendEmail({ ...sendEmailData, userEmail: e.target.value })
                  }}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Email subject"
                  value={sendEmailData.userSubject}
                  onChange={(e) => {
                    setSendEmail({ ...sendEmailData, userSubject: e.target.value })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  value={sendEmailData.userMessage}
                  onChange={(e) => {
                    setSendEmail({ ...sendEmailData, userMessage: e.target.value })
                  }}
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
                onClick={sendEmail}
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

export default ManageUsers;
