
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const settingsSchema = z.object({
  quizPassingPercentage: z.coerce.number().min(50, "Minimum passing percentage is 50%").max(100, "Maximum passing percentage is 100%"),
  practiceQuestionsPerLevel: z.coerce.number().min(5, "Minimum practice questions is 5").max(50, "Maximum practice questions is 50"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SystemSettings: React.FC = () => {
  const { toast } = useToast();
  
  const defaultValues = {
    quizPassingPercentage: 70,
    practiceQuestionsPerLevel: 10
  };
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const onSubmit = (data: SettingsFormValues) => {
    // In a real app, this would update the settings via an API
    console.log("Saving settings:", data);
    
    // Show success toast
    toast({
      title: "Settings updated",
      description: "Your system settings have been successfully updated.",
    });
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
              <span className="text-2xl font-bold text-mathpath-purple">System Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Configure System Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="quizPassingPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Passing Percentage</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={50} max={100} />
                      </FormControl>
                      <FormDescription>
                        The minimum percentage a student must score to pass a quiz
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        
                <FormField
                  control={form.control}
                  name="practiceQuestionsPerLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Questions Per Level</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={5} max={50} />
                      </FormControl>
                      <FormDescription>
                        The number of practice questions displayed for each level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-mathpath-purple hover:bg-purple-600 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SystemSettings;
