import type { ProjectIdea, OfficialProject, ProjectStatus, CountyDocument } from './types';

export const HOMA_BAY_LOCATIONS = {
    "Kasipul": ["West Kasipul", "South Kasipul", "Central Kasipul", "East Kasipul"],
    "Kabondo Kasipul": ["Kabondo East", "Kabondo West", "Kojwach", "Kokwanyo/Kakelo"],
    "Karachuonyo": ["Wang'chieng", "Kendu Bay Town", "Central Karachuonyo", "Kanyipir", "North Karachuonyo", "West Karachuonyo"],
    "Rangwe": ["West Gem", "East Gem", "Kagan", "Kochia"],
    "Homa Bay Town": ["Homa Bay Central", "Homa Bay Arujo", "Homa Bay West", "Homa Bay East"],
    "Ndhiwa": ["Kanyamwa Kologi", "Kanyamwa Kosewe", "Kwabwai", "Kanyadoto", "Kanyikela", "Kabuoch North", "Kabuoch South/Pala"],
    "Suba North": ["Mfangano Island", "Rusinga Island", "Kasgunga", "Gembe"],
    "Suba South": ["Gwassi South", "Gwassi North", "Kaksingri West", "Ruma-Kaksingri"],
};

export const PROJECT_STATUSES: ProjectStatus[] = ['Not Started', 'In Progress', 'Completed', 'Stalled'];

export const PROJECT_CATEGORIES = ['ROADS', 'WATER', 'HEALTHCARE', 'EDUCATION', 'AGRICULTURE', 'INFRASTRUCTURE', 'SECURITY', 'SERVICES', 'ENVIRONMENT'];

export const MOCK_PROJECT_IDEAS: ProjectIdea[] = [
  { id: 'idea-1', title: 'New borehole for Mbita market', description: 'The market needs a reliable source of clean water to improve sanitation.', location: 'Mbita', submittedVia: 'web', subCounty: 'Suba North', ward: 'Kasgunga', votes: 25, comments: [] },
  { id: 'idea-2', title: 'Fix the road to Kasgunga beach', description: 'The road is full of potholes, making it difficult for fishermen and tourists.', location: 'Kasgunga', submittedVia: 'sms', category: 'ROADS', subCounty: 'Suba North', ward: 'Kasgunga', votes: 42, comments: [] },
  { id: 'idea-3', title: 'Upgrade maternity wing at Suba hospital', description: 'The current maternity wing is too small and lacks modern equipment.', location: 'Sindo Town', submittedVia: 'web', subCounty: 'Suba South', ward: 'Gwassi South', votes: 58, comments: [] },
  { id: 'idea-4', title: 'More street lights in Homa Bay town', description: 'Improved lighting will enhance security at night.', location: 'Homa Bay Town', submittedVia: 'web', subCounty: 'Homa Bay Town', ward: 'Homa Bay Central', votes: 31, comments: [] },
  { id: 'idea-5', title: 'Waste collection services for Kendu Bay', description: 'Garbage is piling up, we need a regular collection system.', location: 'Kendu Bay', submittedVia: 'sms', category: 'SERVICES', subCounty: 'Karachuonyo', ward: 'Kendu Bay Town', votes: 19, comments: [] },
  { id: 'idea-6', title: 'Another water point needed in Remba island', description: 'The single borehole is not enough for the whole community.', location: 'Remba Island', submittedVia: 'sms', category: 'WATER', subCounty: 'Suba North', ward: 'Gembe', votes: 65, comments: [] },
  { id: 'idea-7', title: 'Repair bridge on Rusinga ring road', description: 'The bridge is becoming unsafe for vehicles.', location: 'Rusinga Island', submittedVia: 'web', subCounty: 'Suba North', ward: 'Rusinga Island', votes: 38, comments: [] },
  { id: 'idea-8', title: 'Equip youth polytechnic with computers', description: 'Our youth need digital skills to find jobs.', location: 'Ndhiwa', submittedVia: 'web', subCounty: 'Ndhiwa', ward: 'Kanyadoto', votes: 45, comments: [] },
  { id: 'idea-9', title: 'Ambulance for Nyandiwa health center', description: 'Emergencies are hard to handle without a dedicated ambulance.', location: 'Nyandiwa', submittedVia: 'web', subCounty: 'Suba South', ward: 'Gwassi North', votes: 72, comments: [] },
  { id: 'idea-10', title: 'Provide fertilizer subsidies to farmers in Karachuonyo', description: 'High fertilizer costs are reducing farm yields.', location: 'Karachuonyo', submittedVia: 'web', subCounty: 'Karachuonyo', ward: 'North Karachuonyo', votes: 29, comments: [] },
  { id: 'idea-11', title: 'Rehabilitate fish landing site at Sindo', description: 'The current site is dilapidated and unhygienic.', location: 'Sindo', submittedVia: 'sms', category: 'INFRASTRUCTURE', subCounty: 'Suba South', ward: 'Gwassi South', votes: 51, comments: [] },
  { id: 'idea-12', title: 'Drill a well at the community school', description: 'School children lack access to safe drinking water.', location: 'Mbita', submittedVia: 'web', subCounty: 'Suba North', ward: 'Kasgunga', votes: 60, comments: [] },
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
      { id: 'rep-1-1', author: 'Citizen Jane', status: 'In Progress', observation: 'Work has started, but it seems slow. Heavy machinery is on site.', date: '2024-07-15T10:00:00Z', mediaUrl: 'https://picsum.photos/400/300', aiVerificationStatus: 'Verified' },
      { id: 'rep-1-2', author: 'Local Shopkeeper', status: 'In Progress', observation: 'Drainage is being laid before the tarmac. This is good planning.', date: '2024-08-01T14:30:00Z', aiVerificationStatus: 'Pending' },
    ],
    subCounty: 'Homa Bay Town',
    ward: 'Homa Bay Central',
    category: 'ROADS',
    implementer: {
      companyName: 'Bay Area Constructors Ltd.',
      tenderValue: 72500000,
      directors: ['John Okello', 'Mary Atieno'],
    },
    forum: [
        {
            id: 'forum-1-1',
            author: 'Concerned Boda Boda Rider',
            title: 'Why is the project moving so slowly?',
            body: 'The timeline says this should be almost halfway done, but they have only completed a small section. This is causing major traffic disruptions for us.',
            date: '2024-09-05T11:00:00Z',
            replies: [
                { id: 'reply-1-1-1', author: 'Resident', text: 'I agree. The dust is also a major problem for our businesses along the road.', date: '2024-09-05T14:00:00Z'}
            ],
        }
    ]
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
    category: 'INFRASTRUCTURE',
    implementer: {
      companyName: 'Nyanza Quality Builders',
      tenderValue: 43800000,
      directors: ['Peter Omollo', 'Esther Achieng', 'David Onyango'],
    },
    forum: []
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
      { id: 'rep-3-1', author: 'Concerned Parent', status: 'Completed', observation: 'The classroom at our school is finished and looks great. The children are already using it.', date: '2024-11-20T09:00:00Z', mediaUrl: 'https://picsum.photos/400/300', aiVerificationStatus: 'Verified' },
    ],
    category: 'EDUCATION',
  },
];

export const MOCK_DOCUMENTS: CountyDocument[] = [
    {
        id: 'doc-1',
        title: 'CIDP 2023-2027',
        description: 'The County Integrated Development Plan outlines the strategic priorities for Homa Bay over the next five years, focusing on key sectors for growth and development.',
        content: `
        The Homa Bay County Integrated Development Plan (CIDP) for 2023-2027 is a comprehensive five-year strategy.
        Key strategic pillars include:
        1. Agricultural Transformation: Focus on increasing food security through modern farming techniques, subsidies for farmers, and improving market access for fish and crop traders. Budget allocation is 25% of the development fund.
        2. Healthcare Strengthening: Upgrade health facilities from Level 2 to Level 3, equip major hospitals with modern diagnostic tools, and hire more healthcare workers. Budget allocation is 20%.
        3. Infrastructure Development: Tarmacking 200km of county roads, expanding clean water access to 70% of households, and improving sanitation infrastructure. Budget allocation is 30%.
        4. Education and Youth Empowerment: Build new ECDE centers, equip vocational training centers, and provide bursaries for needy students. Budget allocation is 15%.
        5. Environmental Conservation: Protect water towers, promote afforestation, and implement sustainable waste management policies. Budget allocation is 10%.
        `
    },
    {
        id: 'doc-2',
        title: 'Annual Budget 2024',
        description: 'The approved budget for the 2024 fiscal year, detailing allocations for various departments and flagship projects across the county.',
        content: `
        The Homa Bay County Annual Budget for the 2024 fiscal year totals KES 8.5 Billion.
        It is divided into Recurrent Expenditure (KES 5.5 Billion) and Development Expenditure (KES 3 Billion).
        Key allocations for Development are:
        - Roads and Infrastructure: KES 900 Million, with flagship projects including the Homa Bay Town Ring Road and the Kendu Bay Pier rehabilitation.
        - Health Services: KES 600 Million, allocated for the completion of the new maternity wing at the County Referral Hospital and upgrading of 10 dispensaries.
        - Agriculture and Fisheries: KES 750 Million, with KES 200 million for fertilizer subsidies and KES 150 million for fish cage farming initiatives.
        - Education: KES 450 Million, primarily for ECDE infrastructure and secondary school bursaries.
        - Water and Environment: KES 300 Million for drilling new boreholes and protecting the Gwassi Hills forest.
        `
    }
];