/**
 * GRI Institutional Data Store & Mobile Navigation Tags Directory
 * 100% Comprehensive Mapping from GRI_DEEP_COMPONENT_AUDIT.md
 */

export interface DepartmentItem {
  code: string;
  name: string;
  head: string;
  email: string;
  routeTag: string;
}

export interface SchoolCategory {
  id: string;
  name: string;
  routeTag: string;
  departments: DepartmentItem[];
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'ACADEMIC' | 'RESEARCH' | 'INFRASTRUCTURE';
  description: string;
  link: string;
  routeTag: string;
  iconName: string;
}

export interface CellItem {
  code: string;
  name: string;
  coordinator: string;
  url: string;
  routeTag: string;
  iconName: string;
}

export interface OperationalManual {
  title: string;
  category: string;
  pdfUrl: string;
  routeTag: string;
}

export interface NavigationTagNode {
  id: string;
  title: string;
  category: string;
  route: string;
  icon: string;
  description: string;
}

export const GRI_BASE_URL = 'https://ruraluniv.ac.in';

export const GRI_MOBILE_NAV_TAGS: NavigationTagNode[] = [
  { id: 'nav_student_portal', title: 'Student Portal', category: 'PORTALS', route: '/(tabs)/profile', icon: 'user', description: 'CFA Marks, Attendance, Results & Fees' },
  { id: 'nav_scholar_portal', title: 'Research Scholar Portal', category: 'PORTALS', route: '/(tabs)/academics', icon: 'award', description: 'Ph.D. Coursework & Thesis Tracking' },
  { id: 'nav_hostel_outpass', title: 'Hostel Outpass & Gate Pass', category: 'SERVICES', route: '/(tabs)/services', icon: 'key', description: 'Digital QR Outpass & Mess Fee Payments' },
  { id: 'nav_samarth_erp', title: 'Samarth@GRI ERP', category: 'PORTALS', route: '/(tabs)/discover', icon: 'globe', description: 'Samarth e-Gov Governance Portal' },
  { id: 'nav_uba_extension', title: 'Unnat Bharat Abhiyan (UBA)', category: 'OUTREACH', route: '/(tabs)/discover', icon: 'map-pin', description: 'Village Adoption & Extension Camps' },
  { id: 'nav_kvk_farm', title: 'Krishi Vigyan Kendra (KVK)', category: 'OUTREACH', route: '/(tabs)/discover', icon: 'sun', description: 'Farmer Advisories & Agri-Science' },
  { id: 'nav_ai_assistant', title: 'GRI AI Knowledge Assistant', category: 'AI_SERVICES', route: '/(tabs)/ai_chat', icon: 'bot', description: 'Grounded RAG QA with Ordinance Citations' },
];

export const GRI_INSTITUTIONAL_DATA = {
  institution: 'The Gandhigram Rural Institute (Deemed to be University)',
  motto: 'கிராமம் உயர நாடு உயரும் (As villages rise, the nation rises)',
  accreditation: 'Accredited by NAAC with A++ Grade (4th Cycle, 3.61 CGPA)',
  ministry: 'Ministry of Education (Shiksha Mantralaya), Govt. of India',
  location: 'Gandhigram, Dindigul District, Tamil Nadu - 624302',

  schools: [
    {
      id: 'agri',
      name: 'School of Agriculture & Rural Development',
      routeTag: 'tag:school:agri',
      departments: [
        { code: 'AGR', name: 'Department of Agriculture', head: 'Dr. M. Sundaram', email: 'agri@ruraluniv.ac.in', routeTag: 'tag:dept:agr' },
      ],
    },
    {
      id: 'lang',
      name: 'School of Tamil, Indian Languages & Fine Arts',
      routeTag: 'tag:school:lang',
      departments: [
        { code: 'TAM', name: 'Department of Tamil', head: 'Dr. P. Murugesan', email: 'tamil@ruraluniv.ac.in', routeTag: 'tag:dept:tam' },
        { code: 'MAL', name: 'Centre for Malayalam Studies', head: 'Dr. K. Sreedharan', email: 'malayalam@ruraluniv.ac.in', routeTag: 'tag:dept:mal' },
        { code: 'HIN', name: 'Department of Hindi', head: 'Dr. S. Sharma', email: 'hindi@ruraluniv.ac.in', routeTag: 'tag:dept:hin' },
      ],
    },
    {
      id: 'sci',
      name: 'School of Sciences',
      routeTag: 'tag:school:sci',
      departments: [
        { code: 'MAT', name: 'Department of Mathematics', head: 'Dr. P. Balasubramaniam', email: 'maths@ruraluniv.ac.in', routeTag: 'tag:dept:mat' },
        { code: 'PHY', name: 'Department of Physics', head: 'Dr. K. Marimuthu', email: 'physics@ruraluniv.ac.in', routeTag: 'tag:dept:phy' },
        { code: 'CHE', name: 'Department of Chemistry', head: 'Dr. S. Abraham John', email: 'chemistry@ruraluniv.ac.in', routeTag: 'tag:dept:che' },
        { code: 'BIO', name: 'Department of Biology', head: 'Dr. R. Ramasubbu', email: 'biology@ruraluniv.ac.in', routeTag: 'tag:dept:bio' },
        { code: 'CS', name: 'Department of Computer Science & Applications', head: 'Dr. R. Ramanathan', email: 'cs@ruraluniv.ac.in', routeTag: 'tag:dept:cs' },
      ],
    },
    {
      id: 'health',
      name: 'School of Health Sciences & Rural Sanitation',
      routeTag: 'tag:school:health',
      departments: [
        { code: 'HSC', name: 'Department of Applied Research & Health Sciences', head: 'Dr. S. Meenakshi', email: 'health@ruraluniv.ac.in', routeTag: 'tag:dept:hsc' },
      ],
    },
    {
      id: 'mgt',
      name: 'School of Management Studies',
      routeTag: 'tag:school:mgt',
      departments: [
        { code: 'RM', name: 'Department of Rural Management', head: 'Dr. N. Kannan', email: 'management@ruraluniv.ac.in', routeTag: 'tag:dept:rm' },
        { code: 'COP', name: 'Department of Cooperation', head: 'Dr. L. Rathakrishnan', email: 'cooperation@ruraluniv.ac.in', routeTag: 'tag:dept:cop' },
        { code: 'COM', name: 'Department of Commerce', head: 'Dr. M. Senthil', email: 'commerce@ruraluniv.ac.in', routeTag: 'tag:dept:com' },
      ],
    },
    {
      id: 'soc',
      name: 'School of Social Sciences',
      routeTag: 'tag:school:soc',
      departments: [
        { code: 'GTP', name: 'Department of Gandhian Thought & Peace Science', head: 'Dr. D. Nevin', email: 'gandhian@ruraluniv.ac.in', routeTag: 'tag:dept:gtp' },
        { code: 'POL', name: 'Department of Political Science & Development Administration', head: 'Dr. G. Kurian', email: 'polscience@ruraluniv.ac.in', routeTag: 'tag:dept:pol' },
        { code: 'SOC', name: 'Department of Sociology', head: 'Dr. S. Raja', email: 'sociology@ruraluniv.ac.in', routeTag: 'tag:dept:soc' },
        { code: 'LLE', name: 'Department of Lifelong Learning & Extension', head: 'Dr. K. Ganesan', email: 'extension@ruraluniv.ac.in', routeTag: 'tag:dept:lle' },
        { code: 'HOM', name: 'Department of Home Science', head: 'Dr. S. Rajkumari', email: 'homescience@ruraluniv.ac.in', routeTag: 'tag:dept:hom' },
      ],
    },
    {
      id: 'eng',
      name: 'School of Engineering & Technology',
      routeTag: 'tag:school:eng',
      departments: [
        { code: 'CRE', name: 'Department of Civil & Rural Engineering', head: 'Dr. K. Ganesan', email: 'civil@ruraluniv.ac.in', routeTag: 'tag:dept:cre' },
        { code: 'FAD', name: 'B.Voc Footwear & Accessories Design', head: 'Dr. P. Vijay', email: 'bvoc@ruraluniv.ac.in', routeTag: 'tag:dept:fad' },
      ],
    },
  ],

  facilities: [
    { id: 'lib', name: 'Central Library', category: 'ACADEMIC', description: 'Central Library with OPAC, e-Journals, and Dr. G.R. Collection', link: `${GRI_BASE_URL}/facilities?content=library`, routeTag: 'tag:facility:lib', iconName: 'book-open' },
    { id: 'cc', name: 'Computer Centre', category: 'ACADEMIC', description: 'High-performance computing & campus Wi-Fi infrastructure', link: `${GRI_BASE_URL}/gri?CC=about`, routeTag: 'tag:facility:cc', iconName: 'cpu' },
    { id: 'nano', name: 'Nanoscience & Nanotechnology Centre', category: 'RESEARCH', description: 'Advanced cleanroom & synthesis facility', link: `${GRI_BASE_URL}/facilities?content=About_NANO_Facility`, routeTag: 'tag:facility:nano', iconName: 'activity' },
    { id: 'nmr', name: 'NMR Instrument Facility', category: 'RESEARCH', description: 'Nuclear Magnetic Resonance Spectrometer facility in Chemistry', link: `${GRI_BASE_URL}/facilities?content=About_NMR_Facility`, routeTag: 'tag:facility:nmr', iconName: 'disc' },
    { id: 'xrd', name: 'XRD Facility', category: 'RESEARCH', description: 'X-Ray Diffraction structural analysis facility', link: `${GRI_BASE_URL}/facilities?content=About_XRD_Facility`, routeTag: 'tag:facility:xrd', iconName: 'layers' },
    { id: 'seaweed', name: 'UBA GRI Seaweed Startup Facility', category: 'RESEARCH', description: 'Seaweed processing & bio-product incubator', link: `${GRI_BASE_URL}/facilities?content=SEAWEED_1`, routeTag: 'tag:facility:seaweed', iconName: 'feather' },
    { id: 'avc', name: 'Audio Visual Centre', category: 'ACADEMIC', description: 'E-content development & broadcast studio', link: `${GRI_BASE_URL}/facilities?content=Audio_Visual_Centre`, routeTag: 'tag:facility:avc', iconName: 'video' },
    { id: 'lcs', name: 'Lecture Capturing System', category: 'ACADEMIC', description: 'Automated classroom recording & LMS streaming', link: `${GRI_BASE_URL}/facilities?content=Lecture_Capturing_System`, routeTag: 'tag:facility:lcs', iconName: 'cast' },
  ],

  cells: [
    { code: 'IQAC', name: 'Internal Quality Assurance Cell', coordinator: 'Dr. P. Shanmugam', url: `${GRI_BASE_URL}/academics?content=iqac`, routeTag: 'tag:cell:iqac', iconName: 'check-circle' },
    { code: 'IPRC', name: 'Intellectual Property Rights Cell', coordinator: 'Dr. M. Ganesan', url: `${GRI_BASE_URL}/academics?content=ipr_cell`, routeTag: 'tag:cell:iprc', iconName: 'shield' },
    { code: 'UBA', name: 'Unnat Bharat Abhiyan (Regional Institute)', coordinator: 'Dr. T. Kalaiselvan', url: `${GRI_BASE_URL}/cell?content=UBA_RegIns`, routeTag: 'tag:cell:uba', iconName: 'map-pin' },
    { code: 'KVK', name: 'Krishi Vigyan Kendra', coordinator: 'Dr. V. Sundaram', url: 'https://www.icarkvkdindigul.org/', routeTag: 'tag:cell:kvk', iconName: 'sun' },
    { code: 'DDU-KK', name: 'Deen Dayal Upadhyaya Kaushal Kendra', coordinator: 'Dr. K. Ganesan', url: `${GRI_BASE_URL}/includes/kk/home`, routeTag: 'tag:cell:ddukk', iconName: 'award' },
    { code: 'MMTTC', name: 'Malaviya Mission Teacher Training Centre', coordinator: 'Dr. S. Meenakshi', url: `${GRI_BASE_URL}/academics?content=AboutMMTTC`, routeTag: 'tag:cell:mmttc', iconName: 'users' },
    { code: 'PLACEMENT', name: 'Centre for Training and Placement', coordinator: 'Dr. R. Ramanathan', url: `${GRI_BASE_URL}/gri?CC=PlacementBureau`, routeTag: 'tag:cell:placement', iconName: 'briefcase' },
    { code: 'CED', name: 'Centre for Entrepreneurship Development', coordinator: 'Dr. N. Kannan', url: `${GRI_BASE_URL}/cell?content=ced`, routeTag: 'tag:cell:ced', iconName: 'trending-up' },
  ],

  manuals: [
    { title: 'Finance and Accounts Manual', category: 'FINANCE', pdfUrl: `${GRI_BASE_URL}/includes/cetc/circular/pdf/Finance_Accounts_Manual170317.pdf`, routeTag: 'tag:manual:finance' },
    { title: 'Guest House Operational Manual', category: 'HOSTEL', pdfUrl: `${GRI_BASE_URL}/includes/infrastructure/guesthouse/pdf/FGH_operational_Manual.pdf`, routeTag: 'tag:manual:guesthouse' },
    { title: 'Hostel Manual', category: 'HOSTEL', pdfUrl: `${GRI_BASE_URL}/includes/infrastructure/hostel/HOSTEL_MANUAL.pdf`, routeTag: 'tag:manual:hostel' },
    { title: 'Working Women Hostel Manual', category: 'HOSTEL', pdfUrl: `${GRI_BASE_URL}/includes/infrastructure/hostel/ww_hostel.pdf`, routeTag: 'tag:manual:wwhostel' },
    { title: 'Campus Security Manual', category: 'SECURITY', pdfUrl: `${GRI_BASE_URL}/includes/manual/CampusSecurity.pdf`, routeTag: 'tag:manual:security' },
    { title: 'Sanitation Works Manual', category: 'SANITATION', pdfUrl: `${GRI_BASE_URL}/includes/manual/sanitation.pdf`, routeTag: 'tag:manual:sanitation' },
    { title: 'Examination System Manual', category: 'EXAMINATION', pdfUrl: `${GRI_BASE_URL}/includes/examination/pdf/ExaminationSystem.pdf`, routeTag: 'tag:manual:examination' },
  ],

  circulars: [
    { id: 'c1', title: 'End Semester Examination Schedule May 2026', category: 'EXAM', publishDate: '2026-05-02', isImportant: true, pdfUrl: `${GRI_BASE_URL}/circulars/ese_may_2026.pdf` },
    { id: 'c2', title: 'Admissions 2026-27 Open for UG & PG Programmes via CUET', category: 'ADMISSIONS', publishDate: '2026-04-28', isImportant: true, pdfUrl: `${GRI_BASE_URL}/admissions/prospectus_2026.pdf` },
    { id: 'c3', title: 'Unnat Bharat Abhiyan (UBA) Rural Extension Camp Schedule', category: 'OUTREACH', publishDate: '2026-04-20', isImportant: false, pdfUrl: `${GRI_BASE_URL}/uba/camp_notice.pdf` },
  ],

  events: [
    { id: 'e1', title: 'National Conference on Sustainable Rural Technologies & Green Energy', organizer: 'School of Engineering & Technology & REC', eventDate: '2026-08-25', venue: 'Multipurpose Auditorium, GRI Campus', category: 'CONFERENCE', link: `${GRI_BASE_URL}/events/ncsrt2026` },
    { id: 'e2', title: 'Unnat Bharat Abhiyan Village Adoption & Health Camp', organizer: 'UBA Regional Institute', eventDate: '2026-08-18', venue: 'Gram Panchayat, Dindigul', category: 'EXTENSION', link: `${GRI_BASE_URL}/uba/health_camp_2026` },
    { id: 'e3', title: 'Special Lecture on Nai Talim & Modern Rural Education', organizer: 'Dept of Gandhian Thought', eventDate: '2026-08-14', venue: 'Dr. G. Ramachandran Seminar Hall', category: 'WORKSHOP', link: `${GRI_BASE_URL}/events/gandhian_lecture` },
  ],

  tenders: [
    { tenderNo: 'GRI/EST/2026/T-12', title: 'Supply & Installation of 100kW Solar Rooftop Power Plant', closingDate: '2026-08-30', status: 'ACTIVE', category: 'WORKS', documentUrl: `${GRI_BASE_URL}/tenders/solar_100kw.pdf` },
    { tenderNo: 'GRI/PUR/2026/T-11', title: 'Procurement of HPC Workstations for Computer Centre', closingDate: '2026-08-22', status: 'ACTIVE', category: 'EQUIPMENT', documentUrl: `${GRI_BASE_URL}/tenders/hpc.pdf` },
    { tenderNo: 'GRI/SEC/2026/T-10', title: 'AMC for Campus Security & Housekeeping Services', closingDate: '2026-08-15', status: 'ACTIVE', category: 'SERVICES', documentUrl: `${GRI_BASE_URL}/tenders/security.pdf` },
  ],

  careers: [
    { advtNo: 'GRI/REC/2026/02', postName: 'Junior Research Fellow (JRF) - DST Quantum Project', department: 'Dept of Physics', salary: '₹31,000 + HRA/mo', qualification: 'M.Sc. Physics with CSIR-NET / GATE', lastDate: '2026-08-25', pdfUrl: `${GRI_BASE_URL}/careers/jrf.pdf` },
    { advtNo: 'GRI/REC/2026/01', postName: 'Guest Faculty in French Language & Literature', department: 'School of English', salary: '₹1,500/lecture', qualification: 'M.A. French with NET/Ph.D.', lastDate: '2026-08-20', pdfUrl: `${GRI_BASE_URL}/careers/french.pdf` },
    { advtNo: 'GRI/STAFF/2026/03', postName: 'Technical Assistant (Computer Laboratory)', department: 'Computer Centre', salary: 'Pay Level 6', qualification: 'B.E. CSE / B.Tech IT / MCA', lastDate: '2026-08-28', pdfUrl: `${GRI_BASE_URL}/careers/tech.pdf` },
  ],

  studentCorner: {
    portals: [
      { name: 'Samarth@GRI Student ERP', url: 'https://ruraluniv.samarth.ac.in', badge: 'Official ERP' },
      { name: 'GRI Student Portal', url: 'https://portal.ruraluniv.ac.in', badge: 'CIA & Grades' },
      { name: 'Geo-Fenced Attendance', url: 'https://attendance.ruraluniv.ac.in', badge: 'BLE + GPS' },
      { name: 'Library OPAC Catalog', url: `${GRI_BASE_URL}/facilities/library`, badge: 'Digital Library' },
    ],
    academic_services: [
      { title: 'ESE Time Table Lookup Tool', url: `${GRI_BASE_URL}/examtt` },
      { title: 'Official Transcript Application PDF', url: `${GRI_BASE_URL}/includes/exam/Application_Transcript.pdf` },
      { title: 'Duplicate Degree Certificate Application', url: `${GRI_BASE_URL}/includes/exam/DuplicateCertificate.pdf` },
      { title: 'e-SANAD Degree Verification Portal', url: 'https://portal.ruraluniv.ac.in/esanad' },
    ],
    welfare_grievances: [
      { title: 'Anti-Ragging Online Affidavit', url: `${GRI_BASE_URL}/antiragging` },
      { title: 'UGC e-Samadhan Grievance Portal', url: 'https://e-samadhan.ugc.ac.in' },
      { title: 'Internal Complaints Committee (ICC)', url: `${GRI_BASE_URL}/icc` },
      { title: 'Equal Opportunity & Reservation Cell', url: `${GRI_BASE_URL}/eoc` },
    ],
  },
};

