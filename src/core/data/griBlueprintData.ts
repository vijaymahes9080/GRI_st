// GRI Blueprint Master Native Offline Database

export interface QuickLink {
  id: string;
  title: string;
  category: string;
  description: string;
  icon?: string;
  badge?: string;
  route: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  overview: string;
  hodName: string;
  hodDesignation: string;
  contactEmail: string;
  contactPhone: string;
  programmes: { name: string; level: string; duration: string; intake: number }[];
  faculty: { name: string; designation: string; qualification: string }[];
  researchAreas: string[];
  facilities: string[];
}

export interface SchoolData {
  id: string;
  name: string;
  deanName: string;
  description: string;
  departmentsCount: number;
  departments: string[];
}

export const GRI_BANNER_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Admissions Open 2026-2027',
    tag: 'Admissions',
    date: 'Aug 10, 2026',
    description: 'Applications invited for UG, PG, Ph.D., Diploma & B.Voc. programmes at GRI.',
    route: '/admissions',
    color: '#F16236',
  },
  {
    id: '2',
    title: 'ESE End Semester Exam Timetable',
    tag: 'Examinations',
    date: 'Aug 08, 2026',
    description: 'Check the official examination schedule for all UG, PG & Professional courses.',
    route: '/examination/timetable',
    color: '#00838F',
  },
  {
    id: '3',
    title: 'NAAC Re-accreditation "A" Grade',
    tag: 'Quality Assurance',
    date: 'Jul 25, 2026',
    description: 'Gandhigram Rural Institute re-accredited with A Grade by NAAC.',
    route: '/about/annual_reports',
    color: '#518214',
  },
  {
    id: '4',
    title: 'Samarth@GRI ERP Portal Active',
    tag: 'Portal',
    date: 'Jul 15, 2026',
    description: 'Access student fees, course registration, and internal assessment grades.',
    route: '/auth/student_login',
    color: '#0D47A1',
  },
];

export const GRI_QUICK_ACTIONS = [
  { id: 'samarth', title: 'Student Portal', icon: 'UserCheck', route: '/auth/student_login', color: '#0D47A1' },
  { id: 'exam', title: 'ESE Timetable', icon: 'Calendar', route: '/examination/timetable', color: '#00838F' },
  { id: 'prospectus', title: 'Prospectus 2026', icon: 'FileText', route: '/admissions', color: '#F16236' },
  { id: 'phd', title: 'Ph.D. Tracker', icon: 'Award', route: '/examination/phd_tracking', color: '#6A1B9A' },
  { id: 'esanad', title: 'e-SANAD Verification', icon: 'CheckCircle', route: '/examination/esanad', color: '#2E7D32' },
  { id: 'alumni', title: 'Alumni Network', icon: 'Users', route: '/alumni', color: '#E65100' },
];

export const GRI_SCHOOLS: SchoolData[] = [
  {
    id: 'sard',
    name: 'School of Agriculture & Rural Development',
    deanName: 'Dr. M. Seetharaman',
    description: 'Promoting organic farming, rural extension, and sustainable agriculture.',
    departmentsCount: 2,
    departments: ['Department of Agriculture', 'KVK Extension Centre'],
  },
  {
    id: 'stila',
    name: 'School of Tamil, Indian Languages & Fine Arts',
    deanName: 'Dr. P. Velmurugan',
    description: 'Fostering classical Tamil research, Malayalam, Hindi, and Gandhian arts.',
    departmentsCount: 3,
    departments: ['Department of Tamil', 'Centre for Malayalam Studies', 'Department of Hindi'],
  },
  {
    id: 'science',
    name: 'School of Sciences',
    deanName: 'Dr. S. Ramesh',
    description: 'Advanced research in Physics, Chemistry, Biology, Mathematics, and Computer Science.',
    departmentsCount: 5,
    departments: [
      'Department of Mathematics',
      'Department of Physics',
      'Department of Chemistry',
      'Department of Biology',
      'Department of Computer Science & Applications',
    ],
  },
  {
    id: 'health',
    name: 'School of Health Sciences & Rural Sanitation',
    deanName: 'Dr. K. Rajendran',
    description: 'Pioneering rural health education, sanitation models, and hygiene science.',
    departmentsCount: 2,
    departments: ['Department of Applied Research', 'Department of Health & Sanitation'],
  },
  {
    id: 'management',
    name: 'School of Management Studies',
    deanName: 'Dr. V. Ramachandran',
    description: 'Rural management, co-operation, and rural business leadership.',
    departmentsCount: 3,
    departments: ['Department of Rural Management', 'Department of Cooperation', 'Department of Commerce'],
  },
  {
    id: 'social',
    name: 'School of Social Sciences',
    deanName: 'Dr. A. Sundaram',
    description: 'Gandhian thought, peace science, sociology, lifelong learning, and development admin.',
    departmentsCount: 6,
    departments: [
      'Department of Gandhian Thought & Peace Science',
      'Department of Political Science & Development Administration',
      'Department of Sociology',
      'Department of Lifelong Learning & Extension',
      'Centre for Futures Studies',
      'Department of Home Science',
    ],
  },
  {
    id: 'engineering',
    name: 'School of Engineering & Technology',
    deanName: 'Dr. G. Muralidharan',
    description: 'Civil engineering, rural technology, and B.Voc. footwear design.',
    departmentsCount: 2,
    departments: ['Department of Civil & Rural Engineering', 'B.Voc Footwear & Accessories Design'],
  },
];

export const GRI_DEPARTMENTS_SAMPLE: DepartmentData[] = [
  {
    id: 'cs',
    name: 'Department of Computer Science & Applications',
    schoolId: 'science',
    schoolName: 'School of Sciences',
    overview: 'Established in 1989, offering MCA, M.Sc. Computer Science, B.Sc. Computer Science, and Ph.D. programmes with state-of-the-art AI and Cloud labs.',
    hodName: 'Dr. K. Ziyarath Ali',
    hodDesignation: 'Professor & Head',
    contactEmail: 'cs@ruraluniv.ac.in',
    contactPhone: '+91 451 2452371',
    programmes: [
      { name: 'MCA (Master of Computer Applications)', level: 'PG', duration: '2 Years', intake: 60 },
      { name: 'M.Sc. Computer Science', level: 'PG', duration: '2 Years', intake: 30 },
      { name: 'B.Sc. Computer Science', level: 'UG', duration: '3 Years', intake: 40 },
      { name: 'Ph.D. in Computer Science', level: 'Research', duration: '3-5 Years', intake: 12 },
    ],
    faculty: [
      { name: 'Dr. K. Ziyarath Ali', designation: 'Professor & Head', qualification: 'Ph.D., M.C.A.' },
      { name: 'Dr. P. Shanmugavadivu', designation: 'Professor', qualification: 'Ph.D., M.C.A.' },
      { name: 'Dr. R. Chandrasekaran', designation: 'Associate Professor', qualification: 'Ph.D., M.Tech' },
    ],
    researchAreas: ['Artificial Intelligence & Machine Learning', 'Image Processing', 'Cybersecurity', 'Cloud Computing'],
    facilities: ['Advanced AI & High Performance Computing Lab', 'Software Engineering Lab', 'IoT Smart Research Lab'],
  },
  {
    id: 'agri',
    name: 'Department of Agriculture',
    schoolId: 'sard',
    schoolName: 'School of Agriculture & Rural Development',
    overview: 'Pioneer in organic agriculture, ICAR accredited B.Sc. (Hons) Agriculture, M.Sc. Agriculture, and research programmes.',
    hodName: 'Dr. T. Senthil Kumar',
    hodDesignation: 'Professor & Head',
    contactEmail: 'agri@ruraluniv.ac.in',
    contactPhone: '+91 451 2452372',
    programmes: [
      { name: 'B.Sc. (Hons.) Agriculture', level: 'UG', duration: '4 Years', intake: 60 },
      { name: 'M.Sc. Agronomy', level: 'PG', duration: '2 Years', intake: 20 },
      { name: 'Ph.D. in Agriculture', level: 'Research', duration: '3-5 Years', intake: 10 },
    ],
    faculty: [
      { name: 'Dr. T. Senthil Kumar', designation: 'Professor & Head', qualification: 'Ph.D. (Agronomy)' },
      { name: 'Dr. M. Ananthakrishnan', designation: 'Associate Professor', qualification: 'Ph.D. (Soil Science)' },
    ],
    researchAreas: ['Organic Farming Systems', 'Soil Fertility Management', 'Precision Agriculture'],
    facilities: ['100-Acre Instructional Farm', 'Soil Testing Lab', 'Greenhouse & Tissue Culture Unit'],
  },
];

export const GRI_GOVERNANCE_BODIES = [
  {
    id: 'bom',
    name: 'Board of Management (Executive Council)',
    description: 'The highest executive and administrative authority of Gandhigram Rural Institute.',
    chairman: 'Dr. M. K. Surappa (Vice-Chancellor)',
    compositionCount: 15,
    keyFunctions: [
      'Approval of annual budget and financial statements',
      'Appointment of academic and administrative staff',
      'Creation of new departments, schools, and research centres',
      'Framing rules and regulations for institutional governance',
    ],
  },
  {
    id: 'academic',
    name: 'Academic Council',
    description: 'The principal academic body responsible for maintenance of standards of instruction, education, and examination.',
    chairman: 'Vice-Chancellor',
    compositionCount: 35,
    keyFunctions: [
      'Approval of CBCS curricula and syllabi',
      'Regulations for admission, examination, and degrees',
      'Instituting scholarships, fellowships, and prizes',
    ],
  },
  {
    id: 'finance',
    name: 'Finance Committee',
    description: 'Advises the Board of Management on all financial matters, annual accounts, and budget estimates.',
    chairman: 'Vice-Chancellor',
    compositionCount: 8,
    keyFunctions: [
      'Reviewing annual financial estimates and expenditure',
      'Auditing of university accounts',
      'Fixing fee structures for all programmes',
    ],
  },
  {
    id: 'planning',
    name: 'Planning and Monitoring Board',
    description: 'Responsible for overall strategic development, academic expansion, and infrastructure planning.',
    chairman: 'Vice-Chancellor',
    compositionCount: 12,
    keyFunctions: [
      'Formulating 5-year development plans',
      'Monitoring implementation of UGC and MoE schemes',
    ],
  },
];

export const GRI_ADMIN_OFFICERS = [
  { name: 'Dr. M. K. Surappa', title: 'Vice-Chancellor', office: 'Vice-Chancellor\'s Secretariat', phone: '+91 451 2452301', email: 'vc@ruraluniv.ac.in' },
  { name: 'Dr. L. Raja', title: 'Registrar', office: 'Registrar\'s Office', phone: '+91 451 2452305', email: 'registrar@ruraluniv.ac.in' },
  { name: 'Dr. P. Shanmugavadivu', title: 'Controller of Examinations (CoE)', office: 'Examination Section', phone: '+91 451 2452320', email: 'coe@ruraluniv.ac.in' },
  { name: 'Shri S. Ramanathan', title: 'Finance Officer', office: 'Finance & Accounts Division', phone: '+91 451 2452310', email: 'fo@ruraluniv.ac.in' },
  { name: 'Dr. K. Mahendran', title: 'Chief Vigilance Officer (CVO)', office: 'CVO Office', phone: '+91 451 2452315', email: 'cvo@ruraluniv.ac.in' },
];

export const GRI_EXAM_TIMETABLE_SAMPLE = [
  { courseCode: '24CSU101', courseName: 'Programming in Python', programme: 'B.Sc. CS', sem: 'Sem I', date: 'Nov 20, 2026', time: '10:00 AM - 01:00 PM' },
  { courseCode: '24CSU102', courseName: 'Data Structures & Algorithms', programme: 'B.Sc. CS', sem: 'Sem III', date: 'Nov 22, 2026', time: '10:00 AM - 01:00 PM' },
  { courseCode: '24CSP501', courseName: 'Advanced Machine Learning', programme: 'MCA', sem: 'Sem III', date: 'Nov 21, 2026', time: '02:00 PM - 05:00 PM' },
  { courseCode: '24AGU101', courseName: 'Principles of Agronomy', programme: 'B.Sc. Agri', sem: 'Sem I', date: 'Nov 19, 2026', time: '10:00 AM - 01:00 PM' },
];

// ==========================================
// OFFICIAL INSTITUTIONAL DETAILS BEYOND ADMISSIONS
// Sourced from ruraluniv.ac.in
// ==========================================

export interface FounderInfo {
  name: string;
  lifespan: string;
  role: string;
  bio: string;
  contributions: string[];
  quote: string;
}

export const GRI_FOUNDERS: FounderInfo[] = [
  {
    name: 'Dr. T.S. Soundram Ramachandran',
    lifespan: '1904 – 1984',
    role: 'Co-Founder & Pioneer of Rural Healthcare',
    bio: 'Daughter of industrialist T.V. Sundaram Iyengar (founder of TVS Group). A medical doctor trained at Lady Hardinge Medical College, she dedicated her life to the Indian Freedom Movement under Mahatma Gandhi\'s guidance. In 1947, she established the Kasturba Hospital at Gandhigram, transforming maternal and infant healthcare in rural South India.',
    contributions: [
      'Founded Kasturba Hospital in 1947 treating rural poor free of cost',
      'Pioneered the Auxiliary Nurse Midwife (ANM) training system in India',
      'Union Deputy Minister for Education (1962–1967) under Prime Ministers Nehru and Shastri',
      'Instituted Nai Talim Basic Education and women empowerment vocational guilds',
      'Awarded the Padma Bhushan in 1962 for distinguished social service',
    ],
    quote: '"The real India lives in its seven hundred thousand villages. Unless our villages are awakened, India cannot awaken."',
  },
  {
    name: 'Dr. G. Ramachandran',
    lifespan: '1904 – 1995',
    role: 'Co-Founder & First Vice-Chancellor of GRI',
    bio: 'Graduated from Rabindranath Tagore\'s Visva-Bharati (Santiniketan) and became a trusted disciple and secretary to Mahatma Gandhi. He participated in the Salt Satyagraha and Quit India movement. He served as Chairman of the Khadi and Village Industries Commission (KVIC), Member of Parliament (Rajya Sabha), and founded the world-renowned Shanti Sena at GRI in 1958.',
    contributions: [
      'Founded the Shanti Sena (Peace Corps) at Gandhigram in 1958',
      'Formulated the 3-Dimensional (Tripillar) model of Higher Education: Instruction, Research & Extension',
      'First Vice-Chancellor of Gandhigram Rural Institute (1976–1979)',
      'Member of Rajya Sabha and Chairman of Khadi & Village Industries Commission',
      'Author of seminal texts on Gandhian nonviolence and Basic Education (Nai Talim)',
    ],
    quote: '"Education must be an instrument of social revolution, welding learning with physical labor and moral discipline."',
  },
];

export const GRI_TRIPILLAR_MODEL = {
  title: 'The 3-Dimensional (Tripillar) Higher Education Model',
  description: 'Gandhigram Rural Institute is built on the unique integration of three inseparable pillars envisioned by its founders and approved by the Government of India:',
  pillars: [
    {
      title: '1. Instruction (Classroom & Laboratory)',
      subtitle: 'Nai Talim & Academic Excellence',
      description: 'Outcome-based Choice Based Credit System (CBCS) blending modern sciences, agriculture, technology, humanities, and management with Gandhian values of truth and nonviolence.',
      icon: 'BookOpen',
      color: '#2563EB',
    },
    {
      title: '2. Research (Applied & Participatory)',
      subtitle: 'Solving Real-World Rural Problems',
      description: 'Translational R&D focusing on organic farming, renewable biogas/solar energy, sanitation technologies, rural epidemiology, indigenous knowledge, and local governance.',
      icon: 'Microscope',
      color: '#7C3AED',
    },
    {
      title: '3. Extension (Community Action & Field Outreach)',
      subtitle: 'Lab-to-Land and Land-to-Lab',
      description: 'Mandatory rural immersion in 35+ adopted service villages, socio-economic surveys, Shanti Sena peace brigades, and technical backstopping for panchayats and farmers.',
      icon: 'Users',
      color: '#059669',
    },
  ],
};

export const GRI_EXTENSION_CENTRES = [
  {
    id: 'shanti_sena',
    name: 'Shanti Sena (Peace Brigade)',
    established: '1958',
    head: 'Coordinator, Shanti Sena Cell',
    description: 'Founded by Dr. G. Ramachandran in 1958 as a non-violent alternative to military / NCC training. GRI is the only university in the world to replace military training with a dedicated peace corps, training youth in unarmed conflict resolution, disaster management, emergency first aid, and community harmony.',
    highlights: [
      'Daily morning parade, drills, and yogic physical culture',
      'Disaster rescue and relief operations during regional emergencies',
      'Communal harmony interventions and village dispute reconciliation',
      'Specialized training in non-violent conflict transformation',
    ],
    category: 'Peace & Discipline',
    icon: 'ShieldCheck',
    color: '#DC2626',
  },
  {
    id: 'vpp',
    name: 'Village Placement Programme (VPP)',
    established: '1960',
    head: 'Director, Extension Services',
    description: 'A compulsory residential field training requirement for all undergraduate and postgraduate students. Students live inside designated service villages for 7 to 10 days, engaging in participatory rural appraisal (PRA), socioeconomic surveys, medical camps, literacy campaigns, and Shramdhan (voluntary manual labor).',
    highlights: [
      'Compulsory 7–10 days living with rural families in 35+ service villages',
      'Household data collection and preparation of village development master plans',
      'Shramdhan: desilting irrigation tanks, planting trees, and village sanitation',
      'Evening cultural folk performances and non-formal awareness drives',
    ],
    category: 'Rural Immersion',
    icon: 'Home',
    color: '#059669',
  },
  {
    id: 'kvk',
    name: 'Krishi Vigyan Kendra (ICAR KVK Dindigul)',
    established: '1989',
    head: 'Senior Scientist & Head, KVK',
    description: 'Sanctioned by the Indian Council of Agricultural Research (ICAR), KVK Gandhigram serves as the frontline farm science centre for Dindigul District, bridging agricultural research institutes and farmers through vocational trainings, on-farm testing, and frontline demonstrations.',
    highlights: [
      'Soil and Water Testing Laboratory for soil health card distribution',
      'Quality seed production and bio-fertilizer / bio-pesticide distribution unit',
      'Demonstration units: Azolla, Vermiculture, Mushroom cultivation, and Apiary',
      'Farmer-Scientist interface meets and mobile agro-advisory messaging',
    ],
    category: 'Agricultural Science',
    icon: 'Sprout',
    color: '#D97706',
  },
  {
    id: 'sanitary_park',
    name: 'Sanitary Park & Centre for Rural Technology',
    established: '1961',
    head: 'Head, Dept. of Rural Health & Sanitation',
    description: 'A real-scale demonstration park exhibiting 15+ low-cost rural latrine models, twin-pit pour-flush toilets, biogas generators, smokeless chulhas, and eco-sanitation units. Used for training sanitary inspectors, panchayat officers, and UNICEF/WHO field delegates.',
    highlights: [
      'Pioneer of the Sanitary Inspector Post-Graduate Diploma Programme in India',
      'Demonstration of twin-pit pour-flush leach pit technology',
      'Solid and liquid waste management (SLWM) models for gram panchayats',
      'Bio-methanation and decentralized rural sewage treatment prototypes',
    ],
    category: 'Health & Sanitation',
    icon: 'Sparkles',
    color: '#0D9488',
  },
  {
    id: 'uba',
    name: 'Unnat Bharat Abhiyan (Regional Coordinating Institute)',
    established: '2015',
    head: 'Regional Coordinator, UBA',
    description: 'GRI serves as the Regional Coordinating Institute (RCI) under the Ministry of Education, mentoring over 60 Higher Educational Institutions (HEIs) across southern Tamil Nadu and coordinating developmental interventions in adopted village clusters.',
    highlights: [
      'Coordinating 60+ Participating Institutes across 7 Southern Districts',
      'Village baseline surveys and Gram Panchayat Development Plan (GPDP) integration',
      'Technology customisation for rural livelihood enhancement',
      'Organising national and regional workshops on rural transformation',
    ],
    category: 'National Mission',
    icon: 'Globe',
    color: '#2563EB',
  },
  {
    id: 'clle',
    name: 'Centre for Lifelong Learning and Extension (CLLE)',
    established: '1978',
    head: 'Director, CLLE',
    description: 'Dedicated to continuing education, skill development for rural youth and women, non-formal adult literacy, and vocational training in tailoring, electrical wiring, honey processing, and food preservation.',
    highlights: [
      'Short-term self-employment vocational modules for rural school dropouts',
      'Training Self Help Group (SHG) women in value addition of minor millets',
      'Community learning resource centres in remote village habitations',
    ],
    category: 'Lifelong Learning',
    icon: 'BookOpen',
    color: '#7C3AED',
  },
  {
    id: 'community_radio',
    name: 'GRI Community Radio & Media Centre',
    established: '2008',
    head: 'Station Manager & Media Director',
    description: 'Participatory community broadcasting station operated by GRI faculty, scholars, and rural community members, transmitting localized agricultural weather bulletins, health education, folk songs, and civic notices.',
    highlights: [
      'Daily scheduled broadcasts on agriculture, nutrition, and child education',
      'Empowering local folk artists and grassroots storytellers',
      'Collaborative production with Krishi Vigyan Kendra and Primary Health Centres',
    ],
    category: 'Community Media',
    icon: 'Radio',
    color: '#EC4899',
  },
];

export const GRI_MUSEUMS_AND_HERITAGE = [
  {
    id: 'museum_constructive_programme',
    title: 'Museum of Mahatma Gandhi\'s Constructive Programme',
    inaugurated: '1997',
    description: 'Sanctioned by the Ministry of Human Resource Development (MoE), this museum presents Mahatma Gandhi\'s 18-point Constructive Programme through 50 large thematic panels, rare photographs, audio recordings, charkhas, and archival artifacts.',
    panels: [
      'Communal Unity & Religious Harmony',
      'Removal of Untouchability & Social Equality',
      'Khadi & Village Industries (Swadeshi)',
      'Village Sanitation, Cleanliness & Hygiene',
      'Basic Education (Nai Talim) & Adult Education',
      'Women Empowerment & Upliftment of Marginalized',
      'Prohibition, Health & Nature Cure',
      'Economic Equality & Trusteeship Concept',
    ],
    location: 'Near Central Administrative Block, Gandhigram Campus',
    timings: '09:30 AM – 05:30 PM (All Working Days)',
    entry: 'Free for Students, Scholars & Public',
    icon: 'Building',
    color: '#D97706',
  },
  {
    id: 'freedom_fighters_gallery',
    title: 'GRI Freedom Fighter Art Gallery & Archives',
    inaugurated: '2022 (Azadi Ka Amrit Mahotsav)',
    description: 'Dedicated to immortalizing the bravery of freedom fighters from Tamil Nadu and the national freedom movement, featuring original oil paintings, rare manuscripts, letters of Dr. T.S. Soundram and Dr. G. Ramachandran with Mahatma Gandhi and Jawaharlal Nehru.',
    panels: [
      'Pioneers of 1942 Quit India Movement in South India',
      'Dandi March and Vedaranyam Salt Satyagraha Veterans',
      'Letters and Artifacts of Dr. T.S. Soundram & Dr. G. Ramachandran',
      'Evolution of Gandhigram from 1947 to Deemed University 1976',
    ],
    location: 'First Floor, Dr. G. Ramachandran Memorial Building',
    timings: '10:00 AM – 05:00 PM',
    entry: 'Open to All Visitors',
    icon: 'Award',
    color: '#2563EB',
  },
];

export const GRI_CENTRAL_FACILITIES_INFO = [
  {
    id: 'central_library',
    name: 'Dr. G. Ramachandran Central Library',
    established: '1956',
    area: '12,600 Sq. Ft.',
    holdings: '1,85,000+ Books • 240+ Print Journals • 10,000+ Bound Volumes',
    features: [
      'Fully automated with KOHA Open Source LMS & RFID Smart Gates',
      'Digital Knowledge Centre with 60 High-Speed Terminals',
      'Access to UGC-INFONET, e-ShodhSindhu, Delnet & Shodhganga',
      'Specialized Gandhiana & Rural Development Manuscript Collection',
      'Braille assistive reading terminals for visually challenged students',
    ],
    icon: 'BookOpen',
    color: '#0284C7',
  },
  {
    id: 'cif',
    name: 'Central Instrumentation Facility (CIF)',
    established: 'DST-FIST & PURSE Sponsored',
    area: 'Advanced Analytical Complex',
    holdings: 'Multi-Crore Research Grade Characterization Instruments',
    features: [
      'Field Emission Scanning Electron Microscope (FE-SEM)',
      'High-Resolution Powder X-Ray Diffractometer (XRD)',
      'Fourier Transform Infrared Spectrometer (FTIR)',
      'High Performance Liquid Chromatography (HPLC)',
      'UV-Vis-NIR Spectrophotometer & Gas Chromatography (GC-MS)',
      'Available for University Scholars and External Industrial Users via Online Booking',
    ],
    icon: 'Microscope',
    color: '#7C3AED',
  },
  {
    id: 'instructional_farm',
    name: '100-Acre Instructional Organic Farm & Gaushala',
    established: '1956',
    area: '100 Acres',
    holdings: 'Certified Organic Crop Fields, Dairy & Seed Processing',
    features: [
      'Crop research fields for traditional paddy, millets, pulses, and oilseeds',
      'Dairy Farm (Gaushala) supporting animal husbandry practicals',
      'Commercial Vermicomposting and Bio-Dynamic Manure Production',
      'Herbal Garden with over 150 rare medicinal plant species',
      'Micro-irrigation, Solar drip pumping, and shade net nurseries',
    ],
    icon: 'Trees',
    color: '#059669',
  },
  {
    id: 'health_centre',
    name: 'Dr. Soundram Campus Health Centre',
    established: '1947',
    area: 'Campus Health Ward',
    holdings: 'Resident Medical Officers, Nursing Staff & Emergency Ambulance',
    features: [
      '24x7 Outpatient and Inpatient consultation for students and staff',
      'Immediate linkage with the 300-bed Kasturba Hospital at Gandhigram',
      'Free generic medicine dispensing and routine diagnostic testing',
      'Annual compulsory health check-up for all admitted students',
    ],
    icon: 'HeartPulse',
    color: '#DC2626',
  },
  {
    id: 'computer_centre',
    name: 'Computer Centre & Central IT Infrastructure',
    established: '1989',
    area: 'IT Hub Building',
    holdings: '1 Gbps NKN Connectivity & Campus Fiber Backbone',
    features: [
      'High-speed Gigabit National Knowledge Network (NKN) leased line',
      'Samarth e-Gov Cloud ERP Data Center hosting GRI student records',
      'Campus-wide Wi-Fi mesh covering all hostels, departments & library',
      'Central computing lab with 120 client machines for student practicals',
    ],
    icon: 'Server',
    color: '#475569',
  },
  {
    id: 'sports_stadium',
    name: 'Multi-Purpose Indoor Stadium & Sports Complex',
    established: '1976',
    area: 'Sports Arena',
    holdings: '400m Athletic Track, Indoor Wooden Courts & Gymnasium',
    features: [
      'Indoor badminton, basketball, and volleyball courts with floodlights',
      '16-Station Modern Gymnasium for students and staff fitness',
      'Yoga and Meditation Hall with daily morning wellness sessions',
      'Regular host for All India Inter-University Tournaments',
    ],
    icon: 'Activity',
    color: '#D97706',
  },
];

export const GRI_COMMUNITY_LIFE = {
  title: 'Campus Life & Gandhian Heritage Traditions',
  description: 'Gandhigram Rural Institute fosters a holistic educational ecosystem rooted in simplicity, self-reliance, manual dignity, and communal unity:',
  traditions: [
    {
      title: 'Universal Sarvodaya Prayer (Inter-Religious)',
      time: 'Daily & Every Friday Evening',
      details: 'A unique spiritual gathering where students, teachers, and staff sit together on floor mats. Devotional hymns from Hinduism, Islam, Christianity, Buddhism, Jainism, and Sikhism are recited in harmony, fostering mutual respect and ethical reflection.',
    },
    {
      title: 'Manual Labor (Shramdhan) & Campus Swachhta',
      time: 'Weekly Scheduled Activity',
      details: 'Upholding Mahatma Gandhi\'s principle of \'Bread Labor\', students and faculty participate together in cleaning departmental premises, planting trees, and maintaining herbal gardens, eliminating caste or status prejudices.',
    },
    {
      title: 'Khadi Culture & Swadeshi Attire',
      time: 'Official Friday & Ceremonial Dress Code',
      details: 'Staff and students take pride in wearing handspun Khadi garments, supporting local rural spinning weavers and honoring the Swadeshi self-reliance legacy of Gandhigram.',
    },
    {
      title: 'Gurukula Community Harmony',
      time: 'Year-Round Residential Culture',
      details: 'Teachers and students share meals, participate in village camps, and engage in constructive dialogue outside formal lecture halls, forging lifelong mentoring bonds.',
    },
  ],
};

export const GRI_SISTER_INSTITUTIONS = [
  {
    name: 'Kasturba Hospital, Gandhigram',
    founded: '1947 by Dr. T.S. Soundram',
    description: '300-bed premier rural teaching hospital providing specialized maternal, neonatal, and general surgery to lakhs of rural poor.',
  },
  {
    name: 'Gandhigram Khadi & Village Industries (VIPC)',
    founded: '1950',
    description: 'Pioneering production of Khadi textiles, herbal toilet soaps, pure honey, non-edible oils, and handmade paper.',
  },
  {
    name: 'Lakshmi Seva Sangham (LSS)',
    founded: '1979',
    description: 'GMP-certified production centre of authentic Siddha and Ayurvedic medicines distributed throughout India.',
  },
  {
    name: 'Gandhigram Seva Trust & Children Home',
    founded: '1947',
    description: 'Nurturing destitute women (Avvai Ashram), orphan children, and running primary basic schools (Nai Talim).',
  },
];

