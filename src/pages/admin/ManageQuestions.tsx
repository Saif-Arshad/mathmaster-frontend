/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import { ArrowLeft, Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';


const backendUrl = import.meta.env.VITE_BACKEND_URL || '';


interface Sublevel {
  sublevel_id: number;
  sublevel_discription: string;
}
interface Level {
  level_id: number;
  level_name: string;
  sublevels: Sublevel[];
}
interface Question {
  question_id: number;
  question_text: string;
  level_id: number;
  game: string;
  isQuiz: boolean;
  /* optional game‑specific fields */
  colorUp_shape?: string;
  colorUp_totalItem?: number | string;
  colorUp_coloredCount?: number | string;
  sort_order?: 'asc' | 'desc' | '';
  sort_shape?: string;
  sort_totalItem?: number | string;
  box_shape?: string;
  box_firstBoxCount?: number | string;
  box_secondBoxCount?: number | string;
  equation_shape?: string;
  equation_operation?: '+' | '-' | '*' | '';
  equation_finalBoxcount?: number | string;
  equation_firstBoxCount?: number | string;
  equation_secondBoxCount?: number | string;
}

const ShapeSelect = (
  value: string,
  onChange: React.ChangeEventHandler<HTMLSelectElement>,
) => (
  <select value={value} onChange={onChange} className="w-full border rounded px-3 py-2">
    <option value="">Choose shape</option>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="orange">Orange</option>
    <option value="carrot">Carrot</option>
    <option value="guava">Guava</option>
  </select>
);



const ManageQuestions: React.FC = () => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: Question & { [k: string]: any } = {
    question_id: 0,
    level_id: 0,
    question_text: '',
    game: '',
    isQuiz: false,
    colorUp_shape: '',
    colorUp_totalItem: '',
    colorUp_coloredCount: '',
    sort_order: '',
    sort_shape: '',
    sort_totalItem: '',
    box_shape: '',
    box_firstBoxCount: '',
    box_secondBoxCount: '',
    equation_shape: '',
    equation_operation: '',
    equation_finalBoxcount: '',
    equation_firstBoxCount: '',
    equation_secondBoxCount: '',
  };
  const [formData, setFormData] = useState<any>(emptyForm);
  console.log("🚀 ~ formData:", formData)
  const resetForm = () => setFormData(emptyForm);

  const fetchLevels = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/levels`);
      setLevels(res.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch levels',
        variant: 'destructive',
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/questions`);
      setQuestions(res.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch questions',
        variant: 'destructive',
      });
    }
  };


  useEffect(() => {
    (async () => {
      await Promise.all([fetchLevels(), fetchQuestions()]);
      setInitialLoading(false);
    })();
  }, []);


  const handleAddQuestion = async () => {
    if (!formData.level_id || !formData.question_text || !formData.game) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Level, Question Text, and Game)',
        variant: 'destructive',
      });
      return;
    }

    // Game-specific validation
    if (formData.game === 'Color Up Game') {
      if (!formData.colorUp_shape || !formData.colorUp_totalItem || !formData.colorUp_coloredCount) {
        toast({
          title: 'Validation Error',
          description: 'Color Up Game requires Shape, Total Items, and Colored Count',
          variant: 'destructive',
        });
        return;
      }
    } else if (formData.game === 'Sort Game') {
      if (!formData.sort_shape || !formData.sort_totalItem || !formData.sort_order) {
        toast({
          title: 'Validation Error',
          description: 'Sort Game requires Shape, Total Items, and Sort Order',
          variant: 'destructive',
        });
        return;
      }
    } else if (formData.game === 'Box Game') {
      if (!formData.box_shape || !formData.box_firstBoxCount || !formData.box_secondBoxCount) {
        toast({
          title: 'Validation Error',
          description: 'Box Game requires Shape, First Box Count, and Second Box Count',
          variant: 'destructive',
        });
        return;
      }
    } else if (formData.game === 'Equation Game') {
      if (!formData.equation_shape || !formData.equation_operation || 
          !formData.equation_finalBoxcount || !formData.equation_firstBoxCount || 
          !formData.equation_secondBoxCount) {
        toast({
          title: 'Validation Error',
          description: 'Equation Game requires Shape, Operation, Final Box Count, First Box Count, and Second Box Count',
          variant: 'destructive',
        });
        return;
      }
    }

    setActionLoading(true);
    try {
      await axios.post(`${backendUrl}/admin/questions`, {
        ...formData,
        level_id: Number(formData.level_id),
      });
      await fetchQuestions();
      setIsAddDialogOpen(false);
      setFormData(emptyForm);
      toast({ title: 'Success', description: 'Question added.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add question',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };



  const handleDelete = async (id: number) => {
    // if (!window.confirm('Delete this question?')) return;
    setDeleteId(id);
    try {
      await axios.delete(`${backendUrl}/admin/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.question_id !== id));
      toast({ title: 'Deleted', description: 'Question removed.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete question',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const LevelSelect = (
    <select
      value={formData.level_id ? String(formData.level_id) : ''}
      onChange={(e) => setFormData({ ...formData, level_id: e.target.value, sublevel_id: '' })}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select level</option>
      {levels.map((lvl) => (
        <option key={lvl.level_id} value={lvl.level_id}>{lvl.level_name}</option>
      ))}
    </select>
  );



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
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
            <Input placeholder="Search questions..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">

            <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={() => setIsAddDialogOpen(true)} disabled={initialLoading}>
              {actionLoading && isAddDialogOpen ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}Add Question
            </Button>
            <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={() => {
              setIsAddDialogOpen(true);
              setFormData({ ...emptyForm, isQuiz: true });
            }} disabled={initialLoading}>
              {actionLoading && isAddDialogOpen ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}Add Quiz Question
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader><CardTitle>Question Library</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium"><div className="col-span-4">Question</div><div className="col-span-2">Level</div><div className="col-span-2">Game</div>
                <div className="col-span-2">is Quiz Question</div><div className="col-span-2 text-right">Actions</div></div>
              {initialLoading ? <div className="p-8 text-center text-gray-500">Loading…</div> : filteredQuestions.length ? (
                <div className="divide-y">
                  {filteredQuestions.slice().reverse().map((q) => (
                    <div key={q.question_id} className="grid grid-cols-12 p-3 text-sm items-center">
                      <div className="col-span-4 truncate" title={q.question_text}>{q.question_text}</div>
                      <div className="col-span-2 text-gray-600">{levels.find((l) => l.level_id === q.level_id)?.level_name}</div>
                      <div className="col-span-2 text-gray-600">{q.game}</div>
                      <div className="col-span-2 text-gray-600">{q.isQuiz ? "Yes" : "No"}</div>
                      <div className="col-span-2 flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" disabled={deleteId !== null} onClick={() => handleDelete(q.question_id)}>{deleteId === q.question_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="p-8 text-center text-gray-500">No questions found.</div>}
            </div>
          </CardContent>
        </Card>
      </main>
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(o) => {
          setIsAddDialogOpen(o);
          if (!o) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Level</Label>
              {LevelSelect}
            </div>


            <div className="space-y-2">
              <Label>Question Text</Label>
              <Input
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Game</Label>
              <select
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Choose a Game</option>
                <option value="Color Up Game">Color Up Game</option>
                <option value="Sort Game">Sort Game</option>
                <option value="Box Game">Box Game</option>
                <option value="Equation Game">Equation Game</option>
              </select>
            </div>


            {formData.game === 'Color Up Game' && (
              <>
                <div className="space-y-2">
                  <Label>Select Shape</Label>
                  {ShapeSelect(formData.colorUp_shape, (e) =>
                    setFormData({ ...formData, colorUp_shape: e.target.value }),
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Total Items</Label>
                  <Input
                    type="number"
                    value={formData.colorUp_totalItem}
                    onChange={(e) =>
                      setFormData({ ...formData, colorUp_totalItem: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Colored Count</Label>
                  <Input
                    type="number"
                    value={formData.colorUp_coloredCount}
                    onChange={(e) =>
                      setFormData({ ...formData, colorUp_coloredCount: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {formData.game === 'Sort Game' && (
              <>
                <div className="space-y-2">
                  <Label>Select Shape</Label>
                  {ShapeSelect(formData.sort_shape, (e) =>
                    setFormData({ ...formData, sort_shape: e.target.value }),
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Total Items</Label>
                  <Input
                    type="number"
                    value={formData.sort_totalItem}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_totalItem: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <select
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose order</option>
                    <option value="asc">Small → Large</option>
                    <option value="desc">Large → Small</option>
                  </select>
                </div>
              </>
            )}

            {formData.game === 'Box Game' && (
              <>
                <div className="space-y-2">
                  <Label>Select Shape</Label>
                  {ShapeSelect(formData.box_shape, (e) =>
                    setFormData({ ...formData, box_shape: e.target.value }),
                  )}
                </div>
                <div className="space-y-2">
                  <Label>First Box Count</Label>
                  <Input
                    type="number"
                    value={formData.box_firstBoxCount}
                    onChange={(e) =>
                      setFormData({ ...formData, box_firstBoxCount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Second Box Count (How many user will drag here)</Label>
                  <Input
                    type="number"
                    value={formData.box_secondBoxCount}
                    onChange={(e) =>
                      setFormData({ ...formData, box_secondBoxCount: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {formData.game === 'Equation Game' && (
              <>
                <div className="space-y-2">
                  <Label>Select Shape</Label>
                  {ShapeSelect(formData.equation_shape, (e) =>
                    setFormData({ ...formData, equation_shape: e.target.value }),
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Operation</Label>
                  <select
                    value={formData.equation_operation}
                    onChange={(e) =>
                      setFormData({ ...formData, equation_operation: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Operation</option>
                    <option value="+">Addition (+)</option>
                    <option value="-">Subtraction (-)</option>
                    <option value="*">Multiplication (*)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Final Box Count</Label>
                  <Input
                    type="number"
                    value={formData.equation_finalBoxcount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        equation_finalBoxcount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>First Box Count</Label>
                  <Input
                    type="number"
                    value={formData.equation_firstBoxCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        equation_firstBoxCount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Second Box Count (How many user will drag here)</Label>
                  <Input
                    type="number"
                    value={formData.equation_secondBoxCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        equation_secondBoxCount: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-mathpath-purple hover:bg-purple-600"
              onClick={handleAddQuestion}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {actionLoading ? 'Adding…' : 'Add Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

function renderFormBody(LevelSelect: JSX.Element, SublevelSelect: JSX.Element, formData: any, setFormData: any) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Level</Label>{LevelSelect}</div>
        <div className="space-y-2"><Label>Is Quiz Question?</Label><select value={formData.isQuiz ? 'yes' : 'no'} onChange={(e) => setFormData({ ...formData, isQuiz: e.target.value === 'yes', sublevel_id: '' })} className="w-full border rounded px-3 py-2"><option value="no">No</option><option value="yes">Yes</option></select></div>
      </div>
      {!formData.isQuiz && formData.level_id && (<div className="space-y-2"><Label>Sub‑level</Label>{SublevelSelect}</div>)}
      <div className="space-y-2"><Label>Question Text</Label><Input value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} /></div>
      <div className="space-y-2"><Label>Select Game</Label><select value={formData.game} onChange={(e) => setFormData({ ...formData, game: e.target.value })} className="w-full border rounded px-3 py-2"><option value="">Choose a Game</option><option value="Color Up Game">Color Up Game</option><option value="Sort Game">Sort Game</option><option value="Box Game">Box Game</option><option value="Equation Game">Equation Game</option></select></div>
    </div>
  );
}

export default ManageQuestions;