export interface Admission {
  id?: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  grade: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface NewsItem {
  id?: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}

export interface StudentProgress {
  id?: string;
  studentId: string;
  studentName: string;
  grade: string;
  term: string;
  competencies: {
    literacy: string;
    numeracy: string;
    creativity: string;
    collaboration: string;
  };
  teacherComments: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'parent' | 'student';
  studentId?: string;
}

export interface Student {
  id?: string;
  studentId: string;
  name: string;
  grade: string;
  parentId?: string;
}

export interface CBCResult {
  id?: string;
  studentId: string;
  subject: string;
  score: number;
  level: 'Exceeds Expectations' | 'Meets Expectations' | 'Approaching Expectations' | 'Below Expectations';
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  date: any;
}

export interface Resource {
  id?: string;
  title: string;
  description: string;
  url: string;
  category: 'Textbook' | 'Project' | 'Assessment' | 'Guide';
  createdAt?: any;
}

export interface BusRoute {
  id: string;
  name: string;
  description: string;
  stops: { name: string; time: string }[];
  departureTime: string;
  estimatedArrival: string;
  status: 'On Time' | 'Delayed' | 'Completed';
  driverId: string;
}

export interface Driver {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  createdAt?: any;
}

export interface BusLocation {
  lat: number;
  lng: number;
  lastUpdated: any;
  speed: number;
  plateNumber: string;
}
