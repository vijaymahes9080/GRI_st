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
