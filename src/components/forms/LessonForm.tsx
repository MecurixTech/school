'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Helper function to get lessons from localStorage
export const getDummyLessons = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('dummyLessons') || '[]');
};
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const lessonFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  subjectId: z.string().min(1, 'Subject is required'),
  classId: z.string().min(1, 'Class is required'),
  dayOfWeek: z.string().min(1, 'Day of week is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface LessonFormProps {
  type: 'create' | 'update';
  data?: any;
  setOpen: (open: boolean) => void;
  relatedData?: {
    subjects?: { id: string; name: string }[];
    classes?: { id: string; name: string }[];
  };
}

export function LessonForm({ type, data, setOpen, relatedData }: LessonFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: data || {
      name: '',
      description: '',
      subjectId: '',
      classId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
    },
  });

  const saveLessonToLocalStorage = (lesson: any) => {
    try {
      // Get existing lessons from localStorage or initialize empty array
      const existingLessons = JSON.parse(localStorage.getItem('dummyLessons') || '[]');
      
      if (type === 'create') {
        // Add new lesson with generated ID
        const newLesson = {
          ...lesson,
          id: Date.now().toString(), // Simple ID generation
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subject: relatedData?.subjects?.find((s: any) => s.id === lesson.subjectId),
          class: relatedData?.classes?.find((c: any) => c.id === lesson.classId)
        };
        existingLessons.push(newLesson);
      } else {
        // Update existing lesson
        const index = existingLessons.findIndex((l: any) => l.id === data.id);
        if (index !== -1) {
          existingLessons[index] = {
            ...existingLessons[index],
            ...lesson,
            updatedAt: new Date().toISOString(),
            subject: relatedData?.subjects?.find((s: any) => s.id === lesson.subjectId),
            class: relatedData?.classes?.find((c: any) => c.id === lesson.classId)
          };
        }
      }
      
      // Save back to localStorage
      localStorage.setItem('dummyLessons', JSON.stringify(existingLessons));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };

  const onSubmit = async (values: LessonFormValues) => {
    try {
      setIsLoading(true);
      
      // Save to localStorage
      const success = saveLessonToLocalStorage(values);
      
      if (!success) {
        throw new Error('Failed to save lesson');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      alert(`Lesson ${type === 'create' ? 'created' : 'updated'} successfully!`);
      setOpen(false);
      
      // Trigger a custom event to notify other components that the lessons have been updated
      window.dispatchEvent(new Event('lessonsUpdated'));
      
    } catch (error) {
      console.error('Error submitting lesson:', error);
      alert('Failed to save lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter lesson name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relatedData?.subjects?.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relatedData?.classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : type === 'create' ? 'Create Lesson' : 'Update Lesson'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LessonForm;
