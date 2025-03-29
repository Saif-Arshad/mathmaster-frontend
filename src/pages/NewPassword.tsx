/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

const NewPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const otpFromURL = searchParams.get('otp');
    const userIdFromURL = searchParams.get('userId');
    const navigate = useNavigate();
    const { toast } = useToast();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast({
                title: 'Error',
                description: 'Please fill out all fields.',
                variant: 'destructive',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match.',
                variant: 'destructive',
            });
            return;
        }

        const payload = {
            user_id: userIdFromURL,
            code: otpFromURL,
            newPassword,
        };

        setIsSubmitting(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
                payload
            );
            if (res.data) {
                toast({
                    title: 'Success',
                    description: res.data.message,
                });
                setIsSubmitted(true);
               
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'An error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 flex flex-col items-start">
                    <CardTitle className="text-2xl font-bold text-start">
                        Set New Password
                    </CardTitle>
                    <CardDescription className="text-start">
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-mathpath-purple hover:bg-purple-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Reset Password'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Password Updated</h3>
                            <p className="text-gray-500 mb-4">
                                Your password has been reset successfully. You can now log in with your new password.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full">
                        <Link to="/login" className="text-mathpath-purple hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default NewPassword;
