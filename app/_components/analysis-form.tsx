'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisFormProps {
  onSubmit: (data: { jobRole: string; cvText?: string; cvFiles?: File[] }) => void;
  isLoading: boolean;
}

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [jobRole, setJobRole] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvFiles, setCvFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cvText) {
      onSubmit({ jobRole, cvText });
    } else if (cvFiles.length > 0) {
      onSubmit({ jobRole, cvFiles });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Analyze CV</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="jobRole" className="block text-sm font-medium mb-1">Target Job Role</label>
            <Input
              id="jobRole"
              placeholder="e.g., Senior AI Engineer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            />
          </div>
          <Tabs defaultValue="text" className="w-full">
            <TabsList>
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="upload">File Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <Textarea
                placeholder="Paste the candidate's CV here..."
                className="min-h-[200px]"
                value={cvText}
                onChange={(e) => {
                  setCvText(e.target.value);
                  setCvFiles([]);
                }}
              />
            </TabsContent>
            <TabsContent value="upload">
              <Input
                type="file"
                multiple
                accept=".txt"
                onChange={(e) => {
                  if (e.target.files) {
                    setCvFiles(Array.from(e.target.files));
                    setCvText('');
                  }
                }}
              />
               <p className="text-xs text-muted-foreground mt-1">Upload one or more .txt files.</p>
            </TabsContent>
          </Tabs>
          <Button type="submit" disabled={isLoading || !jobRole || (!cvText && cvFiles.length === 0)}>
            {isLoading ? 'Processing...' : 'Start Analysis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}