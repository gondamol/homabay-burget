export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Stalled';

export type AIVerificationStatus = 'Verified' | 'Pending' | 'Rejected';

export type View = 'landing' | 'dashboard' | 'submit' | 'details' | 'admin' | 'simulator';

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
  category?: string;
  subCounty: string;
  ward: string;
  submittedVia: 'web' | 'sms' | 'voice';
  votes: number;
  comments: Comment[];
  isAnonymous?: boolean;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Converted';
}

export interface ProgressReport {
  id: string;
  author: string;
  status: ProjectStatus;
  observation: string;
  date: string;
  mediaUrl?: string;
  aiVerificationStatus?: AIVerificationStatus;
}

export interface ForumPostReply {
    id: string;
    author: string;
    text: string;
    date: string;
}

export interface ForumPost {
    id:string;
    author: string;
    title: string;
    body: string;
    date: string;
    replies: ForumPostReply[];
}

export interface Implementer {
    companyName: string;
    tenderValue: number;
    directors: string[];
}

export interface OfficialProject {
  id: string;
  name: string;
  description: string;
  budget: number;
  location: string;
  subCounty?: string;
  ward?: string;
  category?: string;
  timeline: {
    start: string;
    end: string;
  };
  status: ProjectStatus;
  reports: ProgressReport[];
  implementer?: Implementer;
  forum: ForumPost[];
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

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
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