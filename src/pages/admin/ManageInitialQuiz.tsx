/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowLeft, Search } from 'lucide-react';
import axios from 'axios';

type QuestionType = {
  quiz_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

const ManageInitialQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch questions from backend API
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/initial-quiz`);
      setQuestions(res.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle Add Question
  const handleAddQuestion = async () => {
    // Basic validation
    if (
      !formData.question_text ||
      !formData.option_a ||
      !formData.option_b ||
      !formData.option_c ||
      !formData.option_d ||
      !formData.correct_option
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/initial-quiz`, formData);
      toast({
        title: "Success",
        description: res.data.message || "Question added successfully",
      });
      // Append new question to state (using returned quiz_id)
      setQuestions([...questions, { ...formData, quiz_id: res.data.quiz_id }]);
      setIsAddDialogOpen(false);
      // Reset form data
      setFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit Question
  const handleEditQuestion = async () => {
    if (!currentQuestion) return;
    setActionLoading(true);
    try {
      const res = await axios.put(`${backendUrl}/initial-quiz/${currentQuestion.quiz_id}`, formData);
      toast({
        title: "Success",
        description: res.data.message || "Question updated successfully",
      });
      // Update question in state
      setQuestions(
        questions.map(q =>
          q.quiz_id === currentQuestion.quiz_id ? { ...formData, quiz_id: currentQuestion.quiz_id } : q
        )
      );
      setIsEditDialogOpen(false);
      setCurrentQuestion(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Question
  const handleDeleteQuestion = async (quiz_id: number) => {
    setActionLoading(true);
    try {
      const res = await axios.delete(`${backendUrl}/initial-quiz/${quiz_id}`);
      toast({
        title: "Success",
        description: res.data.message || "Question deleted successfully",
      });
      setQuestions(questions.filter(q => q.quiz_id !== quiz_id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete question",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Open Add Dialog: Reset form and open dialog
  const openAddDialog = () => {
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: '',
    });
    setIsAddDialogOpen(true);
  };

  // Open Edit Dialog: Populate form with selected question
  const openEditDialog = (question: QuestionType) => {
    setCurrentQuestion(question);
    setFormData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
    });
    setIsEditDialogOpen(true);
  };

  const filteredQuestions = questions.filter(q =>
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div>

            </div>
            <div>

            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
          <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Initial Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
                  <div className="col-span-5">Question</div>
                  <div className="col-span-2">Correct Answer</div>
                  <div className="col-span-5 text-right">Actions</div>
                </div>
                {filteredQuestions.length > 0 ? (
                  <div className="divide-y">
                    {filteredQuestions.map((question) => (
                      <div key={question.quiz_id} className="grid grid-cols-12 p-3 text-sm items-center">
                        <div className="col-span-5 font-medium truncate" title={question.question_text}>
                          {question.question_text}
                        </div>
                        <div className="col-span-2 text-gray-600">{question.correct_option}</div>
                        <div className="col-span-5 flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(question)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteQuestion(question.quiz_id)}>
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
        )}
      </main>

      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="question_text" className="text-sm font-medium">Question Text</label>
              <Input
                id="question_text"
                placeholder="e.g., 2+2 =?"
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer Options</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Option A"
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                />
                <Input
                  placeholder="Option B"
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                />
                <Input
                  placeholder="Option C"
                  value={formData.option_c}
                  onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                />
                <Input
                  placeholder="Option D"
                  value={formData.option_d}
                  onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="correct_option" className="text-sm font-medium">Correct Answer (e.g., 10)</label>
              <Input
                id="correct_option"
                placeholder="e.g., 10"
                value={formData.correct_option}
                onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={handleAddQuestion} disabled={actionLoading}>
              {actionLoading ? "Adding..." : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-question_text" className="text-sm font-medium">Question Text</label>
              <Input
                id="edit-question_text"
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer Options</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Option A"
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                />
                <Input
                  placeholder="Option B"
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                />
                <Input
                  placeholder="Option C"
                  value={formData.option_c}
                  onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                />
                <Input
                  placeholder="Option D"
                  value={formData.option_d}
                  onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-correct_option" className="text-sm font-medium">Correct Answer (e.g., 10)</label>
              <Input
                id="edit-correct_option"
                value={formData.correct_option}
                onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={handleEditQuestion} disabled={actionLoading}>
              {actionLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageInitialQuiz;
