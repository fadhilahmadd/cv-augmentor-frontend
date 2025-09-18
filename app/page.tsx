'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AnalysisForm } from './_components/analysis-form';
import { JobList } from './_components/job-list';
import { ReportModal } from './_components/report-modal';
import { Batch, Job } from '@/lib/types';
import { submitTextCV, submitBatchCVs, getJobStatus } from '@/lib/api-service';

export default function Home() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const updateJobStatuses = useCallback((updatedJobs: Job[]) => {
    const updatedJobsMap = new Map(updatedJobs.map(job => [job.id, job]));

    setBatches(prevBatches => {
      let hasChanges = false;
      const newBatches = prevBatches.map(batch => ({
        ...batch,
        jobs: batch.jobs.map(job => {
          const updatedJob = updatedJobsMap.get(job.id);
          if (updatedJob && job.status !== updatedJob.status) {
            hasChanges = true;
            if (updatedJob.status === 'completed') {
              toast.success(`Analysis for "${updatedJob.filename}" is complete!`);
            } else if (updatedJob.status === 'failed') {
              toast.error(`Analysis for "${updatedJob.filename}" failed.`);
            }
            return updatedJob;
          }
          return job;
        }),
      }));
      return hasChanges ? newBatches : prevBatches;
    });
  }, []);

  useEffect(() => {
    const activeJobs = batches.flatMap(b => b.jobs).filter(j => j.status === 'pending' || j.status === 'processing');
    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const promises = activeJobs.map(job => getJobStatus(job.id));
        const updatedJobs = await Promise.all(promises);
        updateJobStatuses(updatedJobs);
      } catch (error) {
        console.error("Polling failed:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [batches, updateJobStatuses]);


  const handleSubmit = async (data: { jobRole: string; cvText?: string; cvFiles?: File[] }) => {
    setIsLoading(true);
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        if (data.cvText) {
          const job = await submitTextCV(data.cvText, data.jobRole);
          setBatches(prev => [...prev, { batch_id: job.id, jobs: [job] }]);
        } else if (data.cvFiles) {
          const newBatch = await submitBatchCVs(data.cvFiles, data.jobRole);
          setBatches(prev => [...prev, newBatch]);
        }
        resolve("Jobs submitted successfully!");
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise(), {
      loading: 'Submitting analysis job(s)...',
      success: (message) => `${message}`,
      error: 'Submission failed. Please try again.',
    });
    
    setIsLoading(false);
  };

  const selectedJob = batches.flatMap(b => b.jobs).find(j => j.id === selectedJobId) || null;

  return (
    <main className="main-background flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-2">CV Augmentor</h1>
        <p className="text-muted-foreground mb-8">AI-Powered Skill Gap Analysis for Recruiters</p>
        
        <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
        <JobList batches={batches} onViewReport={setSelectedJobId} />
      </div>
      <ReportModal
        job={selectedJob}
        isOpen={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />
    </main>
  );
}