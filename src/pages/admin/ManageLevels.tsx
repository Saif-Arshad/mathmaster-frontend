
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

// Sample data
const sampleLevels = [
  {
    id: '1',
    name: 'Level 1: Counting & Basic Addition',
    description: 'Learn to count and add small numbers',
    sublevels: [
      { id: '1-1', name: 'Numbers 1-10', questions: 12 },
      { id: '1-2', name: 'Addition basics', questions: 15 },
      { id: '1-3', name: 'Level 1 Quiz', questions: 10 }
    ]
  },
  {
    id: '2',
    name: 'Level 2: Subtraction Starter',
    description: 'Master the basics of subtraction',
    sublevels: [
      { id: '2-1', name: 'Subtraction basics', questions: 12 },
      { id: '2-2', name: 'Mixed problems', questions: 15 },
      { id: '2-3', name: 'Level 2 Quiz', questions: 10 }
    ]
  },
  {
    id: '3',
    name: 'Level 3: Place Values',
    description: 'Learn about ones and tens places',
    sublevels: [
      { id: '3-1', name: 'Identifying place values', questions: 12 },
      { id: '3-2', name: 'Two-digit numbers', questions: 15 },
      { id: '3-3', name: 'Level 3 Quiz', questions: 10 }
    ]
  }
];

const ManageLevels: React.FC = () => {
  const [isAddLevelDialogOpen, setIsAddLevelDialogOpen] = useState(false);
  const [isAddSublevelDialogOpen, setIsAddSublevelDialogOpen] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<string[]>(sampleLevels.map(level => level.id));
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  
  const toggleLevelExpansion = (levelId: string) => {
    if (expandedLevels.includes(levelId)) {
      setExpandedLevels(expandedLevels.filter(id => id !== levelId));
    } else {
      setExpandedLevels([...expandedLevels, levelId]);
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
                  <Input id="levelName" placeholder="e.g., Level 4: Multiplication Explorer" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="levelDescription">Description</Label>
                  <Input id="levelDescription" placeholder="Brief description of this level" />
                </div>
              </form>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddLevelDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-mathpath-purple hover:bg-purple-600"
                  onClick={() => setIsAddLevelDialogOpen(false)}
                >
                  Create Level
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-6">
          {sampleLevels.map((level) => (
            <Card key={level.id} className="overflow-hidden">
              <div 
                className="flex items-center justify-between p-5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleLevelExpansion(level.id)}
              >
                <div>
                  <h3 className="text-lg font-medium">{level.name}</h3>
                  <p className="text-sm text-gray-500">{level.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={(e) => e.stopPropagation()}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedLevels.includes(level.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {expandedLevels.includes(level.id) && (
                <CardContent className="pt-0">
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Sublevels</h4>
                      <Dialog open={isAddSublevelDialogOpen && activeLevelId === level.id} onOpenChange={(open) => {
                        setIsAddSublevelDialogOpen(open);
                        if (open) setActiveLevelId(level.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="mr-1 h-3 w-3" />
                            Add Sublevel
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add New Sublevel to {level.name}</DialogTitle>
                          </DialogHeader>
                          
                          <form className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="sublevelName">Sublevel Name</Label>
                              <Input id="sublevelName" placeholder="e.g., Basic multiplication facts" />
                            </div>
                          </form>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsAddSublevelDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="bg-mathpath-purple hover:bg-purple-600"
                              onClick={() => setIsAddSublevelDialogOpen(false)}
                            >
                              Add Sublevel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
                        <div className="col-span-7">Sublevel Name</div>
                        <div className="col-span-3">Questions</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      
                      <div className="divide-y">
                        {level.sublevels.map((sublevel) => (
                          <div 
                            key={sublevel.id} 
                            className="grid grid-cols-12 p-3 text-sm items-center"
                          >
                            <div className="col-span-7 font-medium">
                              {sublevel.name}
                            </div>
                            <div className="col-span-3 text-gray-600">
                              {sublevel.questions} questions
                            </div>
                            <div className="col-span-2 flex justify-end space-x-2">
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
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageLevels;
