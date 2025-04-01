
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample initial quiz questions - in a real app, these would be fetched from an API
const initialQuizQuestions = [
  {
    id: 1,
    question: 'How many apples are there?',
    questionImage: 'https://placehold.co/200x100/FFC0CB/FFFFFF?text=3+apples',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    difficulty: 1,
    type: 'counting'
  },
  {
    id: 2,
    question: 'Count the number of pencils.',
    questionImage: 'https://placehold.co/200x100/ADD8E6/FFFFFF?text=5+pencils',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    difficulty: 1,
    type: 'counting'
  },
  {
    id: 3,
    question: 'What number comes after 7?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    difficulty: 1,
    type: 'number_sequence'
  },
  // More questions from the INITIAL_QUESTIONS array in InitialQuiz.tsx would be here
];

type QuestionType = {
  id: number;
  question: string;
  questionImage?: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  type: string;
};

const ManageInitialQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>(initialQuizQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [editForm, setEditForm] = useState({
    question: '',
    questionImage: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: '1',
    type: ''
  });
  
  const { toast } = useToast();

  const handleAddQuestion = () => {
    // In a real application, this would call an API
    const newQuestion = {
      id: questions.length + 1,
      question: editForm.question,
      questionImage: editForm.questionImage,
      options: editForm.options.filter(opt => opt !== ''),
      correctAnswer: editForm.correctAnswer,
      difficulty: parseInt(editForm.difficulty),
      type: editForm.type
    };
    
    setQuestions([...questions, newQuestion]);
    setIsAddDialogOpen(false);
    toast({ 
      title: "Success", 
      description: "Question added successfully" 
    });
    
    // Reset form
    setEditForm({
      question: '',
      questionImage: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: '1',
      type: ''
    });
  };

  const handleEditQuestion = () => {
    if (!currentQuestion) return;
    
    const updatedQuestions = questions.map(q => 
      q.id === currentQuestion.id ? {
        ...q,
        question: editForm.question,
        questionImage: editForm.questionImage,
        options: editForm.options.filter(opt => opt !== ''),
        correctAnswer: editForm.correctAnswer,
        difficulty: parseInt(editForm.difficulty),
        type: editForm.type
      } : q
    );
    
    setQuestions(updatedQuestions);
    setIsEditDialogOpen(false);
    toast({ 
      title: "Success", 
      description: "Question updated successfully" 
    });
  };

  const handleDeleteQuestion = (id: number) => {
    // Show confirmation dialog in a real app
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    toast({ 
      title: "Success", 
      description: "Question deleted successfully" 
    });
  };

  const openEditDialog = (question: QuestionType) => {
    setCurrentQuestion(question);
    setEditForm({
      question: question.question,
      questionImage: question.questionImage || '',
      options: [...question.options, ...Array(4 - question.options.length).fill('')],
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty.toString(),
      type: question.type
    });
    setIsEditDialogOpen(true);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        question.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || activeTab === question.type;
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
              <span className="text-2xl font-bold text-mathpath-purple">Manage Initial Quiz</span>
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
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="question" className="text-sm font-medium">Question Text</label>
                  <Input 
                    id="question" 
                    placeholder="e.g., How many apples are there?" 
                    value={editForm.question}
                    onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="questionImage" className="text-sm font-medium">Question Image URL (Optional)</label>
                  <Input 
                    id="questionImage" 
                    placeholder="https://example.com/image.jpg" 
                    value={editForm.questionImage}
                    onChange={(e) => setEditForm({...editForm, questionImage: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer Options</label>
                  <div className="grid grid-cols-2 gap-3">
                    {editForm.options.map((option, idx) => (
                      <Input 
                        key={idx}
                        placeholder={`Option ${idx + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editForm.options];
                          newOptions[idx] = e.target.value;
                          setEditForm({...editForm, options: newOptions});
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="correctAnswer" className="text-sm font-medium">Correct Answer</label>
                  <Input 
                    id="correctAnswer" 
                    placeholder="e.g., 3" 
                    value={editForm.correctAnswer}
                    onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="difficulty" className="text-sm font-medium">Difficulty Level</label>
                    <Select 
                      value={editForm.difficulty}
                      onValueChange={(value) => setEditForm({...editForm, difficulty: value})}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Easy (Level 1)</SelectItem>
                        <SelectItem value="2">Medium (Level 2)</SelectItem>
                        <SelectItem value="3">Hard (Level 3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">Question Type</label>
                    <Select
                      value={editForm.type}
                      onValueChange={(value) => setEditForm({...editForm, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="counting">Counting</SelectItem>
                        <SelectItem value="addition">Addition</SelectItem>
                        <SelectItem value="subtraction">Subtraction</SelectItem>
                        <SelectItem value="number_sequence">Number Sequence</SelectItem>
                        <SelectItem value="place_value">Place Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-mathpath-purple hover:bg-purple-600"
                  onClick={handleAddQuestion}
                >
                  Add Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Question</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-question" className="text-sm font-medium">Question Text</label>
                  <Input 
                    id="edit-question" 
                    value={editForm.question}
                    onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-questionImage" className="text-sm font-medium">Question Image URL (Optional)</label>
                  <Input 
                    id="edit-questionImage" 
                    value={editForm.questionImage}
                    onChange={(e) => setEditForm({...editForm, questionImage: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer Options</label>
                  <div className="grid grid-cols-2 gap-3">
                    {editForm.options.map((option, idx) => (
                      <Input 
                        key={idx}
                        placeholder={`Option ${idx + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editForm.options];
                          newOptions[idx] = e.target.value;
                          setEditForm({...editForm, options: newOptions});
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-correctAnswer" className="text-sm font-medium">Correct Answer</label>
                  <Input 
                    id="edit-correctAnswer" 
                    value={editForm.correctAnswer}
                    onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-difficulty" className="text-sm font-medium">Difficulty Level</label>
                    <Select 
                      value={editForm.difficulty}
                      onValueChange={(value) => setEditForm({...editForm, difficulty: value})}
                    >
                      <SelectTrigger id="edit-difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Easy (Level 1)</SelectItem>
                        <SelectItem value="2">Medium (Level 2)</SelectItem>
                        <SelectItem value="3">Hard (Level 3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="edit-type" className="text-sm font-medium">Question Type</label>
                    <Select
                      value={editForm.type}
                      onValueChange={(value) => setEditForm({...editForm, type: value})}
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="counting">Counting</SelectItem>
                        <SelectItem value="addition">Addition</SelectItem>
                        <SelectItem value="subtraction">Subtraction</SelectItem>
                        <SelectItem value="number_sequence">Number Sequence</SelectItem>
                        <SelectItem value="place_value">Place Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-mathpath-purple hover:bg-purple-600"
                  onClick={handleEditQuestion}
                >
                  Save Changes
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
            <TabsTrigger value="counting">Counting</TabsTrigger>
            <TabsTrigger value="addition">Addition</TabsTrigger>
            <TabsTrigger value="subtraction">Subtraction</TabsTrigger>
            <TabsTrigger value="number_sequence">Number Sequence</TabsTrigger>
            <TabsTrigger value="place_value">Place Value</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Initial Quiz Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
                <div className="col-span-5">Question</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-2">Correct Answer</div>
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
                      <div className="col-span-2 text-gray-600">{question.type}</div>
                      <div className="col-span-2 text-gray-600">
                        {question.difficulty === 1 ? 'Easy' : 
                         question.difficulty === 2 ? 'Medium' : 'Hard'}
                      </div>
                      <div className="col-span-2 text-gray-600">{question.correctAnswer}</div>
                      <div className="col-span-1 flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => openEditDialog(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
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

export default ManageInitialQuiz;
