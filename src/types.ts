export type UserRole = 'student' | 'faculty' | 'scholar' | 'admin' | 'guest' | 'super_admin' | 'dept_admin';

export type Permission =
  | 'circulars.view_public'
  | 'circulars.view_authenticated'
  | 'circulars.view_department'
  | 'circulars.view_confidential'
  | 'circulars.create'
  | 'circulars.publish'
  | 'circulars.manage'
  | 'attendance.view_self'
  | 'attendance.view_department'
  | 'attendance.manage'
  | 'academics.view_self'
  | 'academics.manage_grades'
  | 'academics.manage_curriculum'
  | 'research.view_self'
  | 'research.manage_rac'
  | 'research.manage_projects'
  | 'grievance.submit'
  | 'grievance.review'
  | 'grievance.resolve'
  | 'users.view'
  | 'users.manage'
  | 'rbac.manage_permissions'
  | 'system.config'
  | 'audit.view'
  | 'ai.public_knowledge'
  | 'ai.internal_knowledge'
  | 'ai.confidential_knowledge'
  | 'documents.download_public'
  | 'documents.download_restricted';

export interface EnrolledCourse {
  code: string;
  id?: string;
  code?: string;
  feePerSemester?: string;
  description?: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  credits: number;
  attendance: number;
  ciaMarks: number;
  maxCiaMarks: number;
  facultyName: string;
}

export interface AssignedClass {
  code: string;
  id?: string;
  code?: string;
  feePerSemester?: string;
  description?: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  programme: string;
  semester: number;
  studentCount: number;
  roomNumber: string;
  scheduleDays: string;
}

export interface ScholarProgress {
  topic: string;
  supervisorName: string;
  racMeetingStatus: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  nextRacDate?: string;
  fellowshipType: 'JRF' | 'SRF' | 'INSTITUTIONAL' | 'NON_NET' | 'SELF_FINANCED';
  stipendStatus: 'DISBURSED' | 'PROCESSING';
  publicationsCount: number;
  synopsisSubmitted: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  email: string;
  role: UserRole;
  department: string;
  schoolId?: string;
  schoolName?: string;
  programmeName?: string;
  programmeLevel?: 'UG' | 'PG' | 'Doctoral' | 'Diploma' | 'B.Voc';
  regNumber?: string;
  designation?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected' | 'suspended';
  avatarUrl?: string;
  phone?: string;
  alternateEmail?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  smsAlertsEnabled?: boolean;
  whatsappAlertsEnabled?: boolean;
  emailCircularsEnabled?: boolean;
  notificationPreferences?: {
    subscribedCategories?: string[];
    pushEnabled?: boolean;
    emailAlerts?: boolean;
    whatsappAlerts?: boolean;
    soundEffects?: boolean;
  };
  
  // Student Specific
  attendance?: number;
  cgpa?: number;
  semester?: number;
  academicYear?: string;
  batch?: string;
  enrolledCourses?: EnrolledCourse[];
  hostelBlock?: string;
  roomNo?: string;

  // Faculty Specific
  assignedClasses?: AssignedClass[];
  facultyDesignation?: string;
  officeRoom?: string;

  // Research Scholar Specific
  scholarProgress?: ScholarProgress;

  // Granular Access Control Overrides
  customPermissions?: Permission[];
  revokedPermissions?: Permission[];

  // Security & Password Management
  passwordStatus?: 'default_temp' | 'user_defined';
  mustChangePasswordOnLogin?: boolean;
  tempPassword?: string;
  passwordUpdatedAt?: string;
  passwordResetAt?: string;
  passwordResetBy?: string;
  passwordExpiryHours?: number;
  approvedAt?: string;
  approvedBy?: string;
  createdAt?: string;
}

export type MessageChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP';
export type MessageType = 
  | 'APPROVAL_NOTICE' 
  | 'PASSWORD_RESET' 
  | 'PASSWORD_CHANGED' 
  | 'REGISTRATION_RECEIVED' 
  | 'ROLE_PROMOTION'
  | 'CONTACT_UPDATED'
  | 'CHANNEL_TEST'
  | 'CIRCULAR_BROADCAST'
  | 'EMERGENCY_ALERT';

export interface MultiChannelMessage {
  id: string;
  userId: string;
  userName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: MessageChannel;
  type: MessageType;
  title: string;
  body: string;
  status: 'DELIVERED' | 'SENT' | 'PENDING';
  sentAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  category: 'EXAM' | 'ADMISSIONS' | 'ACADEMIC' | 'OUTREACH' | 'TENDER' | 'CAREER' | 'ADMIN';
  targetRole: 'ALL' | 'STUDENT' | 'FACULTY' | 'STAFF' | 'SCHOLAR' | 'ALUMNI';
  titleTemplate: string;
  bodyTemplate: string;
  channels: MessageChannel[];
  isImportant?: boolean;
  visibility?: CircularVisibility;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  isBuiltIn?: boolean;
  usageCount?: number;
}

export type CircularVisibility = 
  | 'PUBLIC' 
  | 'AUTHENTICATED' 
  | 'ROLE_RESTRICTED' 
  | 'DEPARTMENT_RESTRICTED' 
  | 'CONFIDENTIAL_ADMIN';

export interface CircularItem {
  id: string;
  title: string;
  category: 'EXAM' | 'ADMISSIONS' | 'ACADEMIC' | 'OUTREACH' | 'TENDER' | 'CAREER' | 'ADMIN';
  publishDate: string;
  isImportant?: boolean;
  description: string;
  fileUrl?: string;
  targetRole?: 'ALL' | 'STUDENT' | 'FACULTY' | 'STAFF';
  visibility?: CircularVisibility;
  targetRoles?: UserRole[];
  targetDepartments?: string[];
  targetSchools?: string[];
  author?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  viewsCount?: number;
}

export interface ProgrammeItem {
  id?: string;
  code?: string;
  feePerSemester?: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  level: 'UG' | 'PG' | 'Ph.D.' | 'Diploma' | 'B.Voc' | 'Certificate';
  duration: string;
  intake: number;
  feesPerSem: string;
  eligibility?: string;
  syllabusUrl?: string;
}

export interface FacultyMember {
  id?: string;
  code?: string;
  feePerSemester?: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  designation: string;
  qualification: string;
  specialization: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  publicationsCount?: number;
  researchAreas?: string[];
  status?: 'ACTIVE' | 'ON_LEAVE' | 'ARCHIVED';
}

export interface DepartmentInfo {
  code: string;
  id?: string;
  code?: string;
  feePerSemester?: string;
  description?: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  schoolId: string;
  schoolName: string;
  head: string;
  headDesignation: string;
  email: string;
  phone: string;
  overview: string;
  programmes: ProgrammeItem[];
  faculty: FacultyMember[];
  researchAreas: string[];
  facilities: string[];
  status?: 'ACTIVE' | 'ARCHIVED';
}

export interface SchoolInfo {
  id: string;
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  deanName: string;
  description: string;
  departments: DepartmentInfo[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  venue: string;
  organizer: string;
  category: 'CONFERENCE' | 'WORKSHOP' | 'SEMINAR' | 'CULTURAL' | 'SPORTS' | 'COMMUNITY';
  registrationUrl?: string;
  imageUrl?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  targetAudience?: string;
}

export interface PlacementItem {
  id: string;
  companyName: string;
  role: string;
  ctc: string;
  driveDate: string;
  deadline: string;
  eligibleCourses: string[];
  minCgpa: number;
  location: string;
  description: string;
  applyLink?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export interface ResearchItem {
  id: string;
  title: string;
  piName: string;
  department: string;
  fundingAgency: 'DST' | 'SERB' | 'ICAR' | 'ICSSR' | 'UGC' | 'MoE' | 'CSIR' | 'OTHER';
  grantAmount: string;
  sanctionYear: string;
  status: 'ONGOING' | 'COMPLETED';
  thrustArea: string;
  publicationsCount?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'REGULATION' | 'SYLLABUS' | 'PROSPECTUS' | 'FORM' | 'ANNUAL_REPORT' | 'AUDIT';
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  downloadCount: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'ADMISSIONS' | 'EXAMINATIONS' | 'HOSTEL' | 'LIBRARY' | 'SCHOLARSHIP' | 'GENERAL';
  order: number;
  isPublished: boolean;
}

export interface QuickLinkItem {
  id: string;
  title: string;
  url: string;
  category: 'PORTAL' | 'GOVT' | 'LIBRARY' | 'STUDENT_SERVICE' | 'FACULTY_RESOURCE';
  iconName?: string;
  description?: string;
  isExternal: boolean;
  order: number;
}

export interface DynamicPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: 'ABOUT' | 'GOVERNANCE' | 'CAMPUS' | 'FACILITY' | 'CENTRE' | 'CUSTOM';
  contentMarkdown: string;
  bannerImage?: string;
  published: boolean;
  lastUpdated: string;
  author: string;
}

export interface HeroBannerConfig {
  headline: string;
  subMotto: string;
  accreditationBadge: string;
  description: string;
  urgentTickerText: string;
  primaryCtaText: string;
  primaryCtaTab: string;
  secondaryCtaText: string;
  secondaryCtaTab: string;
  bgGradient: string;
}

export interface InstitutionProfile {
  name: string;
  tamilName?: string;
  tagline?: string;
  naacGrade?: string;
  nirfRank?: string;
  address?: string;
  subName: string;
  accreditation: string;
  ministry: string;
  founded: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  mottoTamil: string;
  mottoEnglish: string;
  chancellor: string;
  viceChancellor: string;
  registrar: string;
  coe: string;
  campusStats: {
    schools: number;
    departments: number;
    facultyMembers: number;
    students: number;
    researchScholars: number;
    campusAreaAcres: number;
    nirfRankBand: string;
  };
}

export interface FeatureFlags {
  enableAiAssistant: boolean;
  enableLiveVoiceAgent: boolean;
  enableMapsGrounding: boolean;
  enableStudentGrievances: boolean;
  enableExamHallTickets: boolean;
  enableOnlineAdmissions: boolean;
  enablePlacementPortal: boolean;
  enableResearchRepository: boolean;
  enableAlumniDirectory: boolean;
  enableMaintenanceBanner: boolean;
  maintenanceNotice?: string;
}

export interface AiKnowledgeSource {
  id: string;
  title: string;
  category: 'CURRICULUM' | 'REGULATIONS' | 'ADMISSIONS' | 'HOSTEL' | 'HISTORY' | 'EXAM' | 'GENERAL';
  sourceUrl?: string;
  contentSnippet: string;
  status: 'INDEXED' | 'PENDING' | 'ERROR';
  chunkCount: number;
  lastSynced: string;
}

export interface AiSettingsConfig {
  assistantName: string;
  modelName?: string;
  welcomeMessage: string;
  systemPersona: string;
  allowedTopics: string[];
  temperature: number;
  enableCitations: boolean;
  voiceName: string;
  maxOutputTokens: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'APPROVE' | 'REJECT' | 'RESTORE' | 'DISPATCH' | 'CONFIG_CHANGE';
  resourceType: 'CIRCULAR' | 'USER' | 'DEPARTMENT' | 'EVENT' | 'PLACEMENT' | 'RESEARCH' | 'DOCUMENT' | 'FAQ' | 'PAGE' | 'SETTINGS' | 'AI_KNOWLEDGE';
  resourceId: string;
  resourceTitle: string;
  details: string;
}

export interface ExamScheduleItem {
  courseCode: string;
  subjectTitle: string;
  degree: string;
  semester: number;
  examDate: string;
  session: 'FN (09:30 AM - 12:30 PM)' | 'AN (02:00 PM - 05:00 PM)';
  hall: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  callNumber: string;
  category: string;
  copiesAvailable: number;
  totalCopies: number;
  location: string;
}

export interface GrievanceTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  submittedBy: string;
  role: string;
  submittedAt: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED';
  response?: string;
}

export interface TenderItem {
  tenderNo: string;
  title: string;
  closingDate: string;
  status: 'ACTIVE' | 'ARCHIVED';
  category: 'WORKS' | 'EQUIPMENT' | 'SERVICES';
  estimate: string;
}

export interface CareerItem {
  advtNo: string;
  postName: string;
  department: string;
  salary: string;
  qualification: string;
  lastDate: string;
  category: 'TEACHING' | 'RESEARCH' | 'NON-TEACHING';
}
