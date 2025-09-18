import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import { Job } from '@/lib/types';

interface ReportModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ job, isOpen, onClose }: ReportModalProps) {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Analysis Report for {job.filename}</DialogTitle>
          <DialogDescription>
            This is the AI-generated report for the selected CV.
          </DialogDescription>
        </DialogHeader>
        <div className="prose overflow-y-auto pr-4">
          <ReactMarkdown>{job.result || 'No report generated.'}</ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}