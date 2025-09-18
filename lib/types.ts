export interface Job {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string | null;
  result?: string | null;
}

export interface Batch {
  batch_id: string;
  jobs: Job[];
}