export type View = 'landing' | 'dashboard' | 'submit' | 'project';

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  location: string;
  submittedVia: 'web' | 'sms';
  category?: string;
  subCounty?: string;
  ward?: string;
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Stalled';

export interface ProgressReport {
  id: string;
  author: string;
  status: ProjectStatus;
  observation: string;
  mediaUrl?: string;
  date: string;
}

export interface OfficialProject {
  id: string;
  name: string;
  description: string;
  budget: number;
  location: string;
  timeline: {
    start: string;
    end: string;
  };
  status: ProjectStatus;
  reports: ProgressReport[];
  subCounty?: string;
  ward?: string;
}

export interface AIAnalysisResult {
  topPriorities: {
    topic: string;
    count: number;
    description: string;
  }[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}