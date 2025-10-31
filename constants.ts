import type { ProjectIdea, OfficialProject } from './types';

export const HOMA_BAY_LOCATIONS = {
    "Homa Bay Town": ["Homa Bay Central", "Homa Bay East", "Homa Bay West", "Homa Bay Arujo"],
    "Rangwe": ["West Gem", "East Gem", "Kagan", "Kochia"],
    "Rachuonyo North": ["Karachuonyo East", "Karachuonyo West", "Kanyaluo", "Kibiri"],
    "Ndhiwa": ["Kwabwai", "Kanyadoto", "Kanyikela", "Kabuoch"],
    "Suba North": ["Mbita", "Rusinga Island", "Kasgunga", "Gembe"],
    "Suba South": ["Kaksingri West", "Ruma-Kaksingri", "Gwassi South", "Gwassi North"],
    "Kabondo Kasipul": ["Kabondo East", "Kabondo West", "Kokwanyo/Kakelo"],
    "Karachuonyo": ["Kanyipir", "Kendu Bay Town", "Wang'chieng", "West Karachuonyo"],
};

export const MOCK_PROJECT_IDEAS: ProjectIdea[] = [
  { id: 'idea-1', title: 'New borehole for Mbita market', description: 'The market needs a reliable source of clean water to improve sanitation.', location: 'Mbita', submittedVia: 'web', subCounty: 'Suba North', ward: 'Mbita' },
  { id: 'idea-2', title: 'Fix the road to Kasgunga beach', description: 'The road is full of potholes, making it difficult for fishermen and tourists.', location: 'Kasgunga', submittedVia: 'sms', category: 'ROADS', subCounty: 'Suba North', ward: 'Kasgunga' },
  { id: 'idea-3', title: 'Upgrade maternity wing at Suba hospital', description: 'The current maternity wing is too small and lacks modern equipment.', location: 'Sindo Town', submittedVia: 'web', subCounty: 'Suba South', ward: 'Gwassi South' },
  { id: 'idea-4', title: 'More street lights in Homa Bay town', description: 'Improved lighting will enhance security at night.', location: 'Homa Bay Town', submittedVia: 'web', subCounty: 'Homa Bay Town', ward: 'Homa Bay Central' },
  { id: 'idea-5', title: 'Waste collection services for Kendu Bay', description: 'Garbage is piling up, we need a regular collection system.', location: 'Kendu Bay', submittedVia: 'sms', category: 'SERVICES', subCounty: 'Karachuonyo', ward: 'Kendu Bay Town' },
  { id: 'idea-6', title: 'Another water point needed in Remba island', description: 'The single borehole is not enough for the whole community.', location: 'Remba Island', submittedVia: 'sms', category: 'WATER', subCounty: 'Suba North', ward: 'Gembe' },
  { id: 'idea-7', title: 'Repair bridge on Rusinga ring road', description: 'The bridge is becoming unsafe for vehicles.', location: 'Rusinga Island', submittedVia: 'web', subCounty: 'Suba North', ward: 'Rusinga Island' },
  { id: 'idea-8', title: 'Equip youth polytechnic with computers', description: 'Our youth need digital skills to find jobs.', location: 'Ndhiwa', submittedVia: 'web', subCounty: 'Ndhiwa', ward: 'Kanyadoto' },
  { id: 'idea-9', title: 'Ambulance for Nyandiwa health center', description: 'Emergencies are hard to handle without a dedicated ambulance.', location: 'Nyandiwa', submittedVia: 'web', subCounty: 'Suba South', ward: 'Gwassi North' },
  { id: 'idea-10', title: 'Provide fertilizer subsidies to farmers in Karachuonyo', description: 'High fertilizer costs are reducing farm yields.', location: 'Karachuonyo', submittedVia: 'web', subCounty: 'Rachuonyo North', ward: 'Karachuonyo East' },
  { id: 'idea-11', title: 'Rehabilitate fish landing site at Sindo', description: 'The current site is dilapidated and unhygienic.', location: 'Sindo', submittedVia: 'sms', category: 'INFRASTRUCTURE', subCounty: 'Suba South', ward: 'Gwassi South' },
  { id: 'idea-12', title: 'Drill a well at the community school', description: 'School children lack access to safe drinking water.', location: 'Mbita', submittedVia: 'web', subCounty: 'Suba North', ward: 'Mbita' },
];

export const MOCK_OFFICIAL_PROJECTS: OfficialProject[] = [
  {
    id: 'proj-1',
    name: 'Homa Bay Town Road Tarmacking Phase 2',
    description: 'Tarmacking 5km of key roads within Homa Bay Town to improve transportation and business access.',
    budget: 75000000,
    location: 'Homa Bay Town',
    timeline: { start: '2024-06-01', end: '2025-01-31' },
    status: 'In Progress',
    reports: [
      { id: 'rep-1-1', author: 'Citizen Jane', status: 'In Progress', observation: 'Work has started, but it seems slow. Heavy machinery is on site.', date: '2024-07-15T10:00:00Z', mediaUrl: 'https://picsum.photos/400/300' },
      { id: 'rep-1-2', author: 'Local Shopkeeper', status: 'In Progress', observation: 'Drainage is being laid before the tarmac. This is good planning.', date: '2024-08-01T14:30:00Z' },
    ],
    subCounty: 'Homa Bay Town',
    ward: 'Homa Bay Central',
  },
  {
    id: 'proj-2',
    name: 'Kendu Bay Market Modernization',
    description: 'Construction of new market stalls, roofing, and sanitation facilities for traders at Kendu Bay.',
    budget: 45000000,
    location: 'Kendu Bay',
    timeline: { start: '2024-08-01', end: '2025-03-31' },
    status: 'Not Started',
    reports: [],
    subCounty: 'Karachuonyo',
    ward: 'Kendu Bay Town',
  },
  {
    id: 'proj-3',
    name: 'County-wide ECDE Classroom Construction',
    description: 'Building 20 new ECDE classrooms in various primary schools across the county to improve early childhood education.',
    budget: 20000000,
    location: 'County-wide',
    timeline: { start: '2024-05-15', end: '2024-11-30' },
    status: 'Completed',
    reports: [
      { id: 'rep-3-1', author: 'Concerned Parent', status: 'Completed', observation: 'The classroom at our school is finished and looks great. The children are already using it.', date: '2024-11-20T09:00:00Z', mediaUrl: 'https://picsum.photos/400/300' },
    ],
  },
];