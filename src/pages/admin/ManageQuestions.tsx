
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Search, Edit, Trash2 } from 'lucide-react';

// Sample data - would be fetched from API in a real application
const sampleQuestions = [
  { 
    id: '1', 
    level: 'Level 1', 
    type: 'Addition', 
    question: 'What is 1 + 1?', 
    options: ['1', '2', '3', '4'], 
    correctAnswer: '2',
    difficulty: 1
  },
  { 
    id: '2', 
    level: 'Level 1', 
    type: 'Subtraction', 
    question: 'What is 5 - 2?', 
    options: ['1', '2', '3', '4'], 
    correctAnswer: '3',
    difficulty: 1
  },
  { 
    id: '3', 
    level: 'Level 2', 
    type: 'Addition', 
    question: 'What is 3 + 5?', 
    options: ['7', '8', '9', '10'], 
    correctAnswer: '8',
    difficulty: 2
  },
];

const ManageQuestions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredQuestions = sampleQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || question.level.toLowerCase().includes(activeTab);
    return matchesSearch && matchesTab;
  });
  
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
              <span className="text-2xl font-bold text-mathpath-purple">Manage Questions</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mathpath-purple hover:bg-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              
              <form className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="level1">Level 1</SelectItem>
                        <SelectItem value="level2">Level 2</SelectItem>
                        <SelectItem value="level3">Level 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Question Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addition">Addition</SelectItem>
                        <SelectItem value="subtraction">Subtraction</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question">Question Text</Label>
                  <Input id="question" placeholder="e.g., What is 1 + 2?" />
                </div>
                
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Option A" />
                    <Input placeholder="Option B" />
                    <Input placeholder="Option C" />
                    <Input placeholder="Option D" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="correct">Correct Answer</Label>
                  <Select>
                    <SelectTrigger id="correct">
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                      <SelectItem value="d">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Easy</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-mathpath-purple hover:bg-purple-600"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Save Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="level 1">Level 1</TabsTrigger>
            <TabsTrigger value="level 2">Level 2</TabsTrigger>
            <TabsTrigger value="level 3">Level 3</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Questions</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Question Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
                <div className="col-span-5">Question</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {filteredQuestions.length > 0 ? (
                <div className="divide-y">
                  {filteredQuestions.map((question) => (
                    <div 
                      key={question.id} 
                      className="grid grid-cols-12 p-3 text-sm items-center"
                    >
                      <div className="col-span-5 font-medium truncate" title={question.question}>
                        {question.question}
                      </div>
                      <div className="col-span-2 text-gray-600">{question.level}</div>
                      <div className="col-span-2 text-gray-600">{question.type}</div>
                      <div className="col-span-2 text-gray-600">
                        {question.difficulty === 1 ? 'Easy' : 
                         question.difficulty === 2 ? 'Medium' : 'Hard'}
                      </div>
                      <div className="col-span-1 flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No questions found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManageQuestions;
