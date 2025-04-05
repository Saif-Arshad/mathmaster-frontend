/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2, Plus, ArrowLeft, Search, Edit } from 'lucide-react';
import axios from 'axios';

/**********************
 * Type definitions   *
 **********************/
export type QuestionType = {
  quiz_id: number;
  question_text: string;
  game: string;
  // Color Up
  colorUp_shape?: string;
  colorUp_totalItem?: number;
  colorUp_coloredCount?: number;
  // Sort
  sort_shape?: string;
  sort_totalItem?: number;
  sort_order?: string; // "asc" | "desc"
  // Box
  box_shape?: string;
  box_firstBoxCount?: number;
  box_secondBoxCount?: number;
  // Equation
  equation_shape?: string;
  equation_operation?: string;
  equation_finalBoxcount?: number;
  equation_firstBoxCount?: number;
  equation_secondBoxCount?: number;
};

const initialFormData = {
  question_text: '',
  game: '',
  // Color Up
  colorUp_shape: '',
  colorUp_totalItem: '',
  colorUp_coloredCount: '',
  // Sort
  sort_shape: '',
  sort_totalItem: '',
  sort_order: '',
  // Box
  box_shape: '',
  box_firstBoxCount: '',
  box_secondBoxCount: '',
  // Equation
  equation_shape: '',
  equation_operation: '',
  equation_finalBoxcount: '',
  equation_firstBoxCount: '',
  equation_secondBoxCount: '',
};

/**********************
 * Component          *
 **********************/
const ManageInitialQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /******** API helpers ********/
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/initial-quiz`);
      setQuestions(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to fetch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  /******** Validation ********/
  const validate = (): string | null => {
    if (!formData.question_text || !formData.game) return 'Question text and game are required.';

    switch (formData.game) {
      case 'Color Up Game':
        if (!formData.colorUp_shape || !formData.colorUp_totalItem || !formData.colorUp_coloredCount)
          return 'Please fill all Color Up Game fields.';
        break;
      case 'Sort Game':
        if (!formData.sort_shape || !formData.sort_totalItem || !formData.sort_order)
          return 'Please fill all Sort Game fields.';
        break;
      case 'Box Game':
        if (!formData.box_shape || !formData.box_firstBoxCount || !formData.box_secondBoxCount)
          return 'Please fill all Box Game fields.';
        break;
      case 'Equation Game':
        if (!formData.equation_shape || !formData.equation_operation || !formData.equation_finalBoxcount || !formData.equation_firstBoxCount || !formData.equation_secondBoxCount)
          return 'Please fill all Equation Game fields.';
        break;
      default:
        return 'Unknown game type.';
    }
    return null;
  };

  /******** CRUD ********/
  const handleAddQuestion = async () => {
    const err = validate();
    if (err) return toast({ title: 'Error', description: err, variant: 'destructive' });
    setActionLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/initial-quiz`, formData);
      toast({ title: 'Success', description: data.message || 'Added.' });
      // @ts-ignore
      setQuestions([...questions, { ...formData, quiz_id: data.quiz_id } as QuestionType]);
      setIsAddDialogOpen(false);
      setFormData(initialFormData);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Add failed', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditQuestion = async () => {
    if (!currentQuestion) return;
    const err = validate();
    if (err) return toast({ title: 'Error', description: err, variant: 'destructive' });
    setActionLoading(true);
    try {
      const { data } = await axios.put(`${backendUrl}/initial-quiz/${currentQuestion.quiz_id}`, formData);
      toast({ title: 'Success', description: data.message || 'Updated.' });
      // @ts-ignore
      setQuestions(questions.map(q => q.quiz_id === currentQuestion.quiz_id ? { ...formData, quiz_id: q.quiz_id } as QuestionType : q));
      setIsEditDialogOpen(false);
      setCurrentQuestion(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Update failed', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    setActionLoading(true);
    try {
      const { data } = await axios.delete(`${backendUrl}/initial-quiz/${id}`);
      toast({ title: 'Success', description: data.message || 'Deleted.' });
      setQuestions(questions.filter(q => q.quiz_id !== id));
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Delete failed', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  /******** Dialog helpers ********/
  const openAddDialog = () => { setFormData(initialFormData); setIsAddDialogOpen(true); };

  const openEditDialog = (q: QuestionType) => {
    setCurrentQuestion(q);
    setFormData({
      question_text: q.question_text,
      game: q.game,
      colorUp_shape: q.colorUp_shape || '',
      colorUp_totalItem: q.colorUp_totalItem?.toString() || '',
      colorUp_coloredCount: q.colorUp_coloredCount?.toString() || '',
      sort_shape: q.sort_shape || '',
      sort_totalItem: q.sort_totalItem?.toString() || '',
      sort_order: q.sort_order || '',
      box_shape: q.box_shape || '',
      box_firstBoxCount: q.box_firstBoxCount?.toString() || '',
      box_secondBoxCount: q.box_secondBoxCount?.toString() || '',
      equation_shape: q.equation_shape || '',
      equation_operation: q.equation_operation || '',
      equation_finalBoxcount: q.equation_finalBoxcount?.toString() || '',
      equation_firstBoxCount: q.equation_firstBoxCount?.toString() || '',
      equation_secondBoxCount: q.equation_secondBoxCount?.toString() || '',
    });
    setIsEditDialogOpen(true);
  };

  /******** Render helpers ********/
  const filteredQuestions = questions.filter(q => q.question_text.toLowerCase().includes(searchTerm.toLowerCase()));

  const ShapeSelect = (value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void) => (
    <select value={value} onChange={onChange} className="w-full border rounded px-3 py-2">
      <option value="">Select Shape</option>
      <option value="banana">Banana</option>
      <option value="guava">Guava</option>
      <option value="carrot">Carrot</option>
      <option value="orange">Orange</option>
      <option value="apple">Apple</option>
    </select>
  );

  /**********************
   * JSX start          *
   **********************/
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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

        {/* Table */}
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
                  <div className="col-span-2">Game</div>
                  <div className="col-span-5 text-right">Actions</div>
                </div>
                {filteredQuestions.length ? (
                  <div className="divide-y">
                    {filteredQuestions.map((q) => (
                      <div key={q.quiz_id} className="grid grid-cols-12 p-3 text-sm items-center">
                        <div className="col-span-5 font-medium truncate" title={q.question_text}>{q.question_text}</div>
                        <div className="col-span-2 text-gray-600">{q.game}</div>
                        <div className="col-span-5 flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(q)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteQuestion(q.quiz_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">No questions found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* ADD Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Question</DialogTitle></DialogHeader>

          {/* Common fields */}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question Text</label>
              <Input value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Game</label>
              <select value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })} className="w-full border rounded px-3 py-2">
                <option value="">Choose a Game</option>
                <option value="Color Up Game">Color Up Game</option>
                <option value="Sort Game">Sort Game</option>
                <option value="Box Game">Box Game</option>
                <option value="Equation Game">Equation Game</option>
              </select>
            </div>

            {/* Color Up fields */}
            {formData.game === 'Color Up Game' && (
              <>
                <div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.colorUp_shape, (e) => setFormData({ ...formData, colorUp_shape: e.target.value }))}</div>
                <div className="space-y-2"><label className="text-sm font-medium">Total Items</label><Input type="number" value={formData.colorUp_totalItem} onChange={(e) => setFormData({ ...formData, colorUp_totalItem: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Colored Count</label><Input type="number" value={formData.colorUp_coloredCount} onChange={(e) => setFormData({ ...formData, colorUp_coloredCount: e.target.value })} /></div>
              </>
            )}

            {/* Sort fields */}
            {formData.game === 'Sort Game' && (
              <>
                <div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.sort_shape, (e) => setFormData({ ...formData, sort_shape: e.target.value }))}</div>
                <div className="space-y-2"><label className="text-sm font-medium">Total Items</label><Input type="number" value={formData.sort_totalItem} onChange={(e) => setFormData({ ...formData, sort_totalItem: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Sort Order</label><select value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} className="w-full border rounded px-3 py-2"><option value="">Choose order</option><option value="asc">Small → Large</option><option value="desc">Large → Small</option></select></div>
              </>
            )}

            {/* Box fields */}
            {formData.game === 'Box Game' && (
              <>
                <div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.box_shape, (e) => setFormData({ ...formData, box_shape: e.target.value }))}</div>
                <div className="space-y-2"><label className="text-sm font-medium">First Box Count</label><Input type="number" value={formData.box_firstBoxCount} onChange={(e) => setFormData({ ...formData, box_firstBoxCount: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Second Box Count (How many user will drag here)</label><Input type="number" value={formData.box_secondBoxCount} onChange={(e) => setFormData({ ...formData, box_secondBoxCount: e.target.value })} /></div>
              </>
            )}

            {/* Equation fields */}
            {formData.game === 'Equation Game' && (
              <>
                <div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.equation_shape, (e) => setFormData({ ...formData, equation_shape: e.target.value }))}</div>
                <div className="space-y-2"><label className="text-sm font-medium">Operation</label><select value={formData.equation_operation} onChange={(e) => setFormData({ ...formData, equation_operation: e.target.value })} className="w-full border rounded px-3 py-2"><option value="">Select Operation</option><option value="+">Addition (+)</option><option value="-">Subtraction (-)</option><option value="*">Multiplication (*)</option></select></div>
                <div className="space-y-2"><label className="text-sm font-medium">Final Box Count</label><Input type="number" value={formData.equation_finalBoxcount} onChange={(e) => setFormData({ ...formData, equation_finalBoxcount: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">First Box Count</label><Input type="number" value={formData.equation_firstBoxCount} onChange={(e) => setFormData({ ...formData, equation_firstBoxCount: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Second Box Count (How many user will drag here)</label><Input type="number" value={formData.equation_secondBoxCount} onChange={(e) => setFormData({ ...formData, equation_secondBoxCount: e.target.value })} /></div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={handleAddQuestion} disabled={actionLoading}>{actionLoading ? 'Adding…' : 'Add Question'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT Dialog (same sections as ADD) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Question</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><label className="text-sm font-medium">Question Text</label><Input value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Select Game</label><select value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })} className="w-full border rounded px-3 py-2"><option value="">Choose a Game</option><option value="Color Up Game">Color Up Game</option><option value="Sort Game">Sort Game</option><option value="Box Game">Box Game</option><option value="Equation Game">Equation Game</option></select></div>

            {/* Color Up */}
            {formData.game === 'Color Up Game' && (<><div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.colorUp_shape, (e) => setFormData({ ...formData, colorUp_shape: e.target.value }))}</div><div className="space-y-2"><label className="text-sm font-medium">Total Items</label><Input type="number" value={formData.colorUp_totalItem} onChange={(e) => setFormData({ ...formData, colorUp_totalItem: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Colored Count</label><Input type="number" value={formData.colorUp_coloredCount} onChange={(e) => setFormData({ ...formData, colorUp_coloredCount: e.target.value })} /></div></>)}

            {/* Sort */}
            {formData.game === 'Sort Game' && (<><div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.sort_shape, (e) => setFormData({ ...formData, sort_shape: e.target.value }))}</div><div className="space-y-2"><label className="text-sm font-medium">Total Items</label><Input type="number" value={formData.sort_totalItem} onChange={(e) => setFormData({ ...formData, sort_totalItem: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Sort Order</label><select value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} className="w-full border rounded px-3 py-2"><option value="">Choose order</option><option value="asc">Small → Large</option><option value="desc">Large → Small</option></select></div></>)}

            {/* Box */}
            {formData.game === 'Box Game' && (<><div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.box_shape, (e) => setFormData({ ...formData, box_shape: e.target.value }))}</div><div className="space-y-2"><label className="text-sm font-medium">First Box Count</label><Input type="number" value={formData.box_firstBoxCount} onChange={(e) => setFormData({ ...formData, box_firstBoxCount: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Second Box Count (How many user will drag here)</label><Input type="number" value={formData.box_secondBoxCount} onChange={(e) => setFormData({ ...formData, box_secondBoxCount: e.target.value })} /></div></>)}

            {/* Equation */}
            {formData.game === 'Equation Game' && (<><div className="space-y-2"><label className="text-sm font-medium">Select Shape</label>{ShapeSelect(formData.equation_shape, (e) => setFormData({ ...formData, equation_shape: e.target.value }))}</div><div className="space-y-2"><label className="text-sm font-medium">Operation</label><select value={formData.equation_operation} onChange={(e) => setFormData({ ...formData, equation_operation: e.target.value })} className="w-full border rounded px-3 py-2"><option value="">Select Operation</option><option value="+">Addition (+)</option><option value="-">Subtraction (-)</option><option value="*">Multiplication (*)</option></select></div><div className="space-y-2"><label className="text-sm font-medium">Final Box Count</label><Input type="number" value={formData.equation_finalBoxcount} onChange={(e) => setFormData({ ...formData, equation_finalBoxcount: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">First Box Count</label><Input type="number" value={formData.equation_firstBoxCount} onChange={(e) => setFormData({ ...formData, equation_firstBoxCount: e.target.value })} /></div><div className="space-y-2"><label className="text-sm font-medium">Second Box Count (How many user will drag here)</label><Input type="number" value={formData.equation_secondBoxCount} onChange={(e) => setFormData({ ...formData, equation_secondBoxCount: e.target.value })} /></div></>)}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={handleEditQuestion} disabled={actionLoading}>{actionLoading ? 'Saving…' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageInitialQuiz;
