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
  role: 'admin' | 'parent' | 'teacher';
}
