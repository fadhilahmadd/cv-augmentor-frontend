import { Job, Batch } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const submitTextCV = async (cvText: string, jobRole: string): Promise<Job> => {
  const response = await fetch(`${API_BASE_URL}/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cv_text: cvText, job_role: jobRole }),
  });
  if (!response.ok) throw new Error('Failed to submit text CV');
  return response.json();
};

export const submitBatchCVs = async (files: File[], jobRole: string): Promise<Batch> => {
  const formData = new FormData();
  formData.append('job_role', jobRole);
  files.forEach(file => {
    formData.append('cv_files', file, file.name);
  });

  const response = await fetch(`${API_BASE_URL}/analyze/batch`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to submit batch CVs');
  return response.json();
};

export const getJobStatus = async (jobId: string): Promise<Job> => {
  const response = await fetch(`${API_BASE_URL}/analyze/status/${jobId}`);
  if (!response.ok) throw new Error(`Failed to get status for job ${jobId}`);
  return response.json();
};

export const getBatchDownloadUrl = (batchId: string): string => {
  return `${API_BASE_URL}/analyze/results/all/${batchId}`;
};