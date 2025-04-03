/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const ManageLevels: React.FC = () => {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [expandedLevels, setExpandedLevels] = useState<string[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { toast } = useToast();
  const navigate = useNavigate();

  // Level add/edit state
  const [isAddLevelDialogOpen, setIsAddLevelDialogOpen] = useState(false);
  const [levelValue, setLevelValue] = useState({ name: '', discription: '', passingMarks: '70' });
  const [isEditLevelDialogOpen, setIsEditLevelDialogOpen] = useState(false);
  const [editLevelData, setEditLevelData] = useState({ level_id: '', name: '', discription: '', passingMarks: '' });

  // Sublevel add/edit state
  const [isAddSublevelDialogOpen, setIsAddSublevelDialogOpen] = useState(false);
  const [sublevelValue, setSublevelValue] = useState('');
  const [isEditSublevelDialogOpen, setIsEditSublevelDialogOpen] = useState(false);
  const [editSublevelData, setEditSublevelData] = useState({ sublevel_id: '', level_id: '', sublevel_discription: '' });
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);

  // Fetch levels (with nested sublevels) from backend
  const fetchLevels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/admin/levels`);
      // API returns levels with a nested 'sublevels' JSON array
      setLevels(res.data);
      // Expand all levels initially or set as desired
      setExpandedLevels(res.data.map((lvl: any) => String(lvl.level_id)));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch levels',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // Toggle expansion for a given level
  const toggleLevelExpansion = (levelId: string) => {
    if (expandedLevels.includes(levelId)) {
      setExpandedLevels(expandedLevels.filter(id => id !== levelId));
    } else {
      setExpandedLevels([...expandedLevels, levelId]);
    }
  };

  // Create new level
  const submitLevel = async () => {
    if (!levelValue.name || !levelValue.discription || !levelValue.passingMarks) {
      toast({
        title: 'Error',
        description: 'Level name, description and passing marks are required.',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    const payload = {
      level_name: levelValue.name,
      min_passing_percentage: levelValue.passingMarks,
      discription: levelValue.discription,
    };
    try {
      const res = await axios.post(`${backendUrl}/admin/levels`, payload);
      toast({
        title: 'Success',
        description: res.data.message || 'Level added successfully',
      });
      const newLevel = {
        level_id: res.data.level_id,
        level_name: levelValue.name,
        discription: levelValue.discription,
        min_passing_percentage: levelValue.passingMarks,
        sublevels: [],
      };
      setLevels([...levels, newLevel]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add level',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setIsAddLevelDialogOpen(false);
      setLevelValue({ name: '', discription: '', passingMarks: '70' });
    }
  };

  // Open edit dialog for level
  const openEditLevelDialog = (level: any) => {
    setEditLevelData({
      level_id: level.level_id,
      name: level.level_name,
      discription: level.discription,
      passingMarks: level.min_passing_percentage,
    });
    setIsEditLevelDialogOpen(true);
  };

  // Update level
  const updateLevel = async () => {
    const { level_id, name, discription, passingMarks } = editLevelData;
    if (!name || !discription || !passingMarks) {
      toast({
        title: 'Error',
        description: 'All fields are required for update.',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    const payload = {
      level_name: name,
      min_passing_percentage: passingMarks,
      discription: discription,
    };
    try {
      const res = await axios.put(`${backendUrl}/admin/levels/${level_id}`, payload);
      toast({
        title: 'Success',
        description: res.data.message || 'Level updated successfully',
      });
      setLevels(levels.map(lvl =>
        lvl.level_id === level_id
          ? { ...lvl, level_name: name, discription, min_passing_percentage: passingMarks }
          : lvl
      ));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update level',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setIsEditLevelDialogOpen(false);
    }
  };

  // Delete level
  const deleteLevel = async (level_id: number) => {
    setActionLoading(true);
    try {
      const res = await axios.delete(`${backendUrl}/admin/levels/${level_id}`);
      toast({
        title: 'Success',
        description: res.data.message || 'Level deleted successfully',
      });
      setLevels(levels.filter(lvl => lvl.level_id !== level_id));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete level',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Create new sublevel
  const submitSublevel = async () => {
    if (!activeLevelId || !sublevelValue) {
      toast({
        title: 'Error',
        description: 'Sublevel description is required.',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    const payload = {
      level_id: activeLevelId,
      sublevel_discription: sublevelValue,
    };
    try {
      const res = await axios.post(`${backendUrl}/admin/sub-levels`, payload);
      toast({
        title: 'Success',
        description: res.data.message || 'Sublevel added successfully',
      });
      // Update the corresponding level's sublevels
      setLevels(levels.map(lvl => {
        if (String(lvl.level_id) === activeLevelId) {
          return {
            ...lvl,
            sublevels: [...(lvl.sublevels || []), { sublevel_id: res.data.sublevel_id, sublevel_discription: sublevelValue }],
          };
        }
        return lvl;
      }));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add sublevel',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setIsAddSublevelDialogOpen(false);
      setSublevelValue('');
      setActiveLevelId(null);
    }
  };

  // Open edit dialog for sublevel
  const openEditSublevelDialog = (sublevel: any, level_id: any) => {
    setEditSublevelData({
      sublevel_id: sublevel.sublevel_id,
      level_id: level_id,
      sublevel_discription: sublevel.sublevel_discription,
    });
    setIsEditSublevelDialogOpen(true);
  };

  // Update sublevel
  const updateSublevel = async () => {
    const { sublevel_id, level_id, sublevel_discription } = editSublevelData;
    if (!level_id || !sublevel_discription) {
      toast({
        title: 'Error',
        description: 'All fields are required for sublevel update.',
        variant: 'destructive',
      });
      return;
    }
    setActionLoading(true);
    const payload = { level_id, sublevel_discription };
    try {
      const res = await axios.put(`${backendUrl}/admin/sub-levels/${sublevel_id}`, payload);
      toast({
        title: 'Success',
        description: res.data.message || 'Sublevel updated successfully',
      });
      // Update the sublevel in the matching level
      setLevels(levels.map(lvl => {
        if (lvl.level_id === level_id) {
          return {
            ...lvl,
            sublevels: lvl.sublevels.map((s: any) =>
              s.sublevel_id === sublevel_id ? { ...s, sublevel_discription } : s
            ),
          };
        }
        return lvl;
      }));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update sublevel',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
      setIsEditSublevelDialogOpen(false);
    }
  };

  // Delete sublevel
  const deleteSublevel = async (sublevel_id: number, level_id: number) => {
    setActionLoading(true);
    try {
      const res = await axios.delete(`${backendUrl}/admin/sub-levels/${sublevel_id}`);
      toast({
        title: 'Success',
        description: res.data.message || 'Sublevel deleted successfully',
      });
      setLevels(levels.map(lvl => {
        if (lvl.level_id === level_id) {
          return { ...lvl, sublevels: lvl.sublevels.filter((s: any) => s.sublevel_id !== sublevel_id) };
        }
        return lvl;
      }));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete sublevel',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
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
              <span className="text-2xl font-bold text-mathpath-purple">Manage Levels</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Level Dialog */}
        <div className="mb-6 flex justify-end">
          <Dialog open={isAddLevelDialogOpen} onOpenChange={setIsAddLevelDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mathpath-purple hover:bg-purple-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Level
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Level</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="levelName">Level Name</Label>
                  <Input
                    value={levelValue.name}
                    onChange={(e) => setLevelValue({ ...levelValue, name: e.target.value })}
                    id="levelName"
                    placeholder="e.g., Level 4: Multiplication Explorer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingMarks">Min Passing Marks (%)</Label>
                  <Input
                    value={levelValue.passingMarks}
                    onChange={(e) => setLevelValue({ ...levelValue, passingMarks: e.target.value })}
                    id="passingMarks"
                    placeholder="Minimum Passing Marks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="levelDescription">Description</Label>
                  <Input
                    value={levelValue.discription}
                    onChange={(e) => setLevelValue({ ...levelValue, discription: e.target.value })}
                    id="levelDescription"
                    placeholder="Brief description of this level"
                  />
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddLevelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={submitLevel} disabled={actionLoading}>
                  {actionLoading ? 'Creating...' : 'Create Level'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Level Dialog */}
          <Dialog open={isEditLevelDialogOpen} onOpenChange={setIsEditLevelDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Level</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editLevelName">Level Name</Label>
                  <Input
                    id="editLevelName"
                    value={editLevelData.name}
                    onChange={(e) => setEditLevelData({ ...editLevelData, name: e.target.value })}
                    placeholder="Level name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPassingMarks">Min Passing Marks (%)</Label>
                  <Input
                    id="editPassingMarks"
                    value={editLevelData.passingMarks}
                    onChange={(e) => setEditLevelData({ ...editLevelData, passingMarks: e.target.value })}
                    placeholder="Passing marks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLevelDescription">Description</Label>
                  <Input
                    id="editLevelDescription"
                    value={editLevelData.discription}
                    onChange={(e) => setEditLevelData({ ...editLevelData, discription: e.target.value })}
                    placeholder="Description"
                  />
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditLevelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-mathpath-purple hover:bg-purple-600" onClick={updateLevel} disabled={actionLoading}>
                  {actionLoading ? 'Updating...' : 'Update Level'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Loading levels...</p>
        ) : (
          <div className="space-y-6">
            {levels.map((level) => (
              <Card key={level.level_id} className="overflow-hidden">
                <div
                  className="flex items-center justify-between p-5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleLevelExpansion(String(level.level_id))}
                >
                  <div>
                    <h3 className="text-lg font-medium">{level.level_name}</h3>
                    <p className="text-sm text-gray-500">{level.discription}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditLevelDialog(level);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLevel(level.level_id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedLevels.includes(String(level.level_id)) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedLevels.includes(String(level.level_id)) && (
                  <CardContent className="pt-0">
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Sublevels</h4>
                        <div className="flex items-center space-x-2">
                          <Dialog
                            open={isAddSublevelDialogOpen && activeLevelId === String(level.level_id)}
                            onOpenChange={(open) => {
                              setIsAddSublevelDialogOpen(open);
                              if (open) setActiveLevelId(String(level.level_id));
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Plus className="mr-1 h-3 w-3" />
                                Add Sublevel
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Add New Sublevel to {level.level_name}</DialogTitle>
                              </DialogHeader>
                              <form className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="sublevelName">Sublevel Name</Label>
                                  <Input
                                    id="sublevelName"
                                    placeholder="e.g., Basic multiplication facts"
                                    value={sublevelValue}
                                    onChange={(e) => setSublevelValue(e.target.value)}
                                  />
                                </div>
                              </form>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddSublevelDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-mathpath-purple hover:bg-purple-600"
                                  onClick={submitSublevel}
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? 'Adding...' : 'Add Sublevel'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog open={isEditSublevelDialogOpen} onOpenChange={setIsEditSublevelDialogOpen}>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Sublevel</DialogTitle>
                              </DialogHeader>
                              <form className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editSublevelName">Sublevel Name</Label>
                                  <Input
                                    id="editSublevelName"
                                    value={editSublevelData.sublevel_discription}
                                    onChange={(e) =>
                                      setEditSublevelData({
                                        ...editSublevelData,
                                        sublevel_discription: e.target.value,
                                      })
                                    }
                                    placeholder="Sublevel name"
                                  />
                                </div>
                              </form>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditSublevelDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-mathpath-purple hover:bg-purple-600"
                                  onClick={updateSublevel}
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? 'Updating...' : 'Update Sublevel'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <div className="grid grid-cols-9 bg-gray-100 p-3 text-sm font-medium">
                          <div className="col-span-7">Sublevel Name</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="divide-y">
                          {level.sublevels && level.sublevels.map((sublevel: any) => (
                            <div key={sublevel.sublevel_id} className="grid grid-cols-9 p-3 text-sm items-center">
                              <div className="col-span-7 font-medium">{sublevel.sublevel_discription}</div>
                              <div className="col-span-2 flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditSublevelDialog(sublevel, level.level_id);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSublevel(sublevel.sublevel_id, level.level_id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageLevels;
