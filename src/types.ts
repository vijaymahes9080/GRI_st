export type UserRole = 'student' | 'faculty' | 'scholar' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
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
  attendance?: number;
  cgpa?: number;
  semester?: number;
  // Security & Password Management
  passwordStatus?: 'default_temp' | 'user_defined';
  mustChangePasswordOnLogin?: boolean;
  tempPassword?: string;
  passwordUpdatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export type MessageChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP';
export type MessageType = 
  | 'APPROVAL_NOTICE' 
  | 'PASSWORD_RESET' 
  | 'PASSWORD_CHANGED' 
  | 'REGISTRATION_RECEIVED' 
  | 'ROLE_PROMOTION'
  | 'CONTACT_UPDATED'
  | 'CHANNEL_TEST';

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

export interface CircularItem {
  id: string;
  title: string;
  category: 'EXAM' | 'ADMISSIONS' | 'ACADEMIC' | 'OUTREACH' | 'TENDER' | 'CAREER' | 'ADMIN';
  publishDate: string;
  isImportant?: boolean;
  description: string;
  fileUrl?: string;
  targetRole?: 'ALL' | 'STUDENT' | 'FACULTY' | 'STAFF';
  author?: string;
}

export interface DepartmentInfo {
  code: string;
  name: string;
  schoolId: string;
  schoolName: string;
  head: string;
  headDesignation: string;
  email: string;
  phone: string;
  overview: string;
  programmes: { name: string; level: string; duration: string; intake: number; feesPerSem: string }[];
  faculty: { name: string; designation: string; qualification: string; specialization: string }[];
  researchAreas: string[];
  facilities: string[];
}

export interface SchoolInfo {
  id: string;
  name: string;
  deanName: string;
  description: string;
  departments: DepartmentInfo[];
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
