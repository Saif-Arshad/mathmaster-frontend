import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Search, MoreHorizontal, Ban, Mail, Eye, RotateCw } from 'lucide-react';

// Sample data
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const filteredUsers = sampleUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleActionClick = (userId: string, action: string) => {
    if (action === 'email') {
      setSelectedUserId(userId);
      setIsEmailDialogOpen(true);
    }
    // Other actions would be implemented here
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
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-1">Age</div>
                <div className="col-span-1">Level</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Quizzes</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {filteredUsers.length > 0 ? (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="grid grid-cols-12 p-3 text-sm items-center"
                    >
                      <div className="col-span-3 font-medium">{user.name}</div>
                      <div className="col-span-3 text-gray-600">{user.email}</div>
                      <div className="col-span-1 text-gray-600">{user.age}</div>
                      <div className="col-span-1 text-gray-600">{user.level}</div>
                      <div className="col-span-2">
                        <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                          {user.status === 'active' ? 'Active' : 'Blocked'}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-gray-600">{user.quizzesTaken}</div>
                      <div className="col-span-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleActionClick(user.id, 'view')}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(user.id, 'email')}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(user.id, 'reset')}>
                              <RotateCw className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(user.id, 'block')} className="text-red-500">
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === 'active' ? 'Block User' : 'Unblock User'}
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
                  value={selectedUserId ? filteredUsers.find(u => u.id === selectedUserId)?.email || '' : ''} 
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
                onClick={() => setIsEmailDialogOpen(false)}
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
