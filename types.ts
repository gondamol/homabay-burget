export type View = 'landing' | 'dashboard' | 'submit' | 'project' | 'budget-simulator';

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  location: string;
  submittedVia: 'web' | 'sms';
  category?: string;
  subCounty?: string;
  ward?: string;
  votes: number;
  comments: Comment[];
  isAnonymous?: boolean;
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Stalled';
export type AIVerificationStatus = 'Verified' | 'Pending' | 'Rejected';

export interface ProgressReport {
  id: string;
  author: string;
  status: ProjectStatus;
  observation: string;
  mediaUrl?: string;
  date: string;
  aiVerificationStatus?: AIVerificationStatus;
}

export interface Contractor {
  companyName: string;
  tenderValue: number;
  directors: string[];
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  body: string;
  date: string;
  replies: Comment[];
}

export interface OfficialProject {
  id:string;
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
  category?: string;
  ward?: string;
  implementer?: Contractor;
  forum?: ForumPost[];
}

export interface AIAnalysisResult {
  topPriorities: {
    topic: string;
    count: number;
    description: string;
    cost: number;
  }[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface CountyDocument {
    id: string;
    title: string;
    description: string;
    content: string;
}

export interface OfficialBudgetAllocation {
    category: string;
    amount: number;
}
