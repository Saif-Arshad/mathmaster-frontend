/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
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
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import uploadToCloudinary from './Upload';

const ManageHints: React.FC = () => {
    const [hints, setHints] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [currentHint, setCurrentHint] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { toast } = useToast();

    // Dropdown options
    const gameOptions = [
        { value: '', label: 'Choose a Game' },
        { value: 'Color Up Game', label: 'Color Up Game' },
        { value: 'Sort Game', label: 'Sort Game' },
        { value: 'Box Game', label: 'Box Game' },
        { value: 'Equation Game', label: 'Equation Game' },
    ];

    const operationOptions = [
        { value: '', label: 'Choose an Operation' },
        { value: '+', label: 'Addition (+)' },
        { value: '-', label: 'Subtraction (-)' },
        { value: '*', label: 'Multiplication (*)' },
        { value: '/', label: 'Division (/)' },
    ];

    // Fetch hints from the backend
    const fetchHints = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/hints`);
            setHints(response.data);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to fetch hints',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHints();
    }, []);

    // Handle image selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview('');
        }
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const game = formData.get('game') as string;
        console.log("🚀 ~ handleAddSubmit ~ game:", game)
        const operation = formData.get('operation') as string;
        console.log("🚀 ~ handleAddSubmit ~ operation:", operation)
        const file = formData.get('image') as File;
        console.log("🚀 ~ handleAddSubmit ~ file:", file)

        if (!game || !operation || !file) {
            toast({
                title: 'Error',
                description: 'All fields are required.',
                variant: 'destructive',
            });
            return;
        }

        setActionLoading(true);
        try {
            const {URL,error} = await uploadToCloudinary(file);
            console.log("🚀 ~ handleAddSubmit ~ error:", error)
            console.log("🚀 ~ handleAddSubmit ~ URL:", URL)
            if (error) {
                console.log("🚀 ~ handleAddSubmit ~ error:", error)
                throw new Error(error);
            }
            const imageUrl = URL;

            const response = await axios.post(`${backendUrl}/hints`, {
                game,
                operation,
                image: imageUrl,
            });
            
            console.log("🚀 ~ handleAddSubmit ~ response:", response.data)
            if (response.status === 201) {
                toast({
                    title: 'Success',
                    description: 'Hint added successfully',
                });
                setIsAddDialogOpen(false);
                setImagePreview('');
                fetchHints();
            }
        } catch (error: any) {
            console.log("🚀 ~ handleAddSubmit ~ error:", error)
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to add hint',
                variant: 'destructive',
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Open edit dialog with current hint data
    const handleEdit = (hint: any) => {
        setCurrentHint(hint);
        setImagePreview(''); // Reset preview for new image
        setIsEditDialogOpen(true);
    };

    // Update an existing hint
    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const game = formData.get('game') as string;
        const operation = formData.get('operation') as string;
        const file = formData.get('image') as File;

        if (!game || !operation) {
            toast({
                title: 'Error',
                description: 'Game and operation are required.',
                variant: 'destructive',
            });
            return;
        }

        setActionLoading(true);
        try {
            let imageUrl = currentHint.image;
            if (file && file.name) { // Check if a new file is selected
                const uploadResult = await uploadToCloudinary(file);
                if (uploadResult.error) {
                    throw new Error(uploadResult.error);
                }
                imageUrl = uploadResult.URL;
            }

            const response = await axios.put(`${backendUrl}/hints/${currentHint.hint_id}`, {
                game,
                operation,
                image: imageUrl,
            });

            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Hint updated successfully',
                });
                setIsEditDialogOpen(false);
                setImagePreview('');
                fetchHints();
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update hint',
                variant: 'destructive',
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Delete a hint
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this hint?')) {
            setActionLoading(true);
            try {
                const response = await axios.delete(`${backendUrl}/hints/${id}`);
                if (response.status === 200) {
                    toast({
                        title: 'Success',
                        description: 'Hint deleted successfully',
                    });
                    fetchHints();
                }
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message || 'Failed to delete hint',
                    variant: 'destructive',
                });
            } finally {
                setActionLoading(false);
            }
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
                            <span className="text-2xl font-bold text-mathpath-purple">Manage Hints</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Hint Dialog */}
                <div className="mb-6 flex justify-end">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-mathpath-purple hover:bg-purple-600">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Hint
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Hint</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Select Game</Label>
                                    <select
                                        name="game"
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        {gameOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Select Operation</Label>
                                    <select
                                        name="operation"
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        {operationOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required
                                    />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover" />
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-mathpath-purple hover:bg-purple-600"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Adding...' : 'Add Hint'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Hint Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Hint</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Select Game</Label>
                                    <select
                                        name="game"
                                        defaultValue={currentHint?.game || ''}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        {gameOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Select Operation</Label>
                                    <select
                                        name="operation"
                                        defaultValue={currentHint?.operation || ''}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        {operationOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover" />
                                    ) : (
                                        currentHint?.image && (
                                            <img src={currentHint.image} alt="Current" className="mt-2 h-24 w-24 object-cover" />
                                        )
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-mathpath-purple hover:bg-purple-600"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Updating...' : 'Update Hint'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Hints List */}
                {loading ? (
                    <p>Loading hints...</p>
                ) : hints.length === 0 ? (
                    <p>No hints available. Add a new hint to get started.</p>
                ) : (
                    <div className="space-y-6">
                        {hints.map((hint) => (
                            <Card key={hint.hint_id} className="overflow-hidden">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium">{hint.game}</h3>
                                            <p className="text-sm text-gray-500">
                                                {operationOptions.find((op) => op.value === hint.operation)?.label || hint.operation}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(hint)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500"
                                                onClick={() => handleDelete(hint.hint_id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <img src={hint.image} alt="Hint" className="mt-4 h-32 w-32 object-cover" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageHints;