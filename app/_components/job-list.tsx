'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Batch, Job } from '@/lib/types';
import { VariantProps } from 'class-variance-authority';
import { Loader2, FileText } from 'lucide-react';
import { getBatchDownloadUrl } from '@/lib/api-service';

interface JobListProps {
  batches: Batch[];
  onViewReport: (jobId: string) => void;
}

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const statusVariant: Record<Job['status'], BadgeVariant> = {
  pending: 'secondary',
  processing: 'default',
  completed: 'outline',
  failed: 'destructive',
};

function EmptyState() {
    return (
        <div className="text-center p-8 border-2 border-dashed rounded-lg mt-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No analysis found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by submitting a CV above.</p>
        </div>
    );
}

export function JobList({ batches, onViewReport }: JobListProps) {
  if (batches.length === 0) {
    return (
        <div className="w-full max-w-2xl">
            <EmptyState />
        </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Analysis</h2>
      {batches.map((batch) => {
        
        const isBatchComplete = batch.jobs.every(job => job.status === 'completed');

        return (
          <Card key={batch.batch_id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Batch ID: {batch.batch_id.slice(0, 8)}</CardTitle>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild 
                  disabled={!isBatchComplete}
                >
                  <a href={getBatchDownloadUrl(batch.batch_id)}>Download All Reports</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {batch.jobs.map((job) => (
                  <li key={job.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate pr-4">{job.filename}</p>
                      <div className="flex items-center gap-2">
                        {(job.status === 'pending' || job.status === 'processing') && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                      </div>
                    </div>
                    
                    {(job.status === 'pending' || job.status === 'processing') && (
                      <Progress value={job.status === 'processing' ? 50 : 10} className="mt-2" />
                    )}
                    
                    {job.status === 'completed' && (
                      <div className="mt-2 space-x-2">
                        <Button size="sm" onClick={() => onViewReport(job.id)}>View Report</Button>
                        <Button size="sm" variant="secondary" asChild>
                           <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/analyze/result/${job.id}`}>Download</a>
                        </Button>
                      </div>
                    )}
                     {job.status === 'failed' && (
                      <p className="text-sm text-red-500 mt-1">Error: {job.result}</p>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}