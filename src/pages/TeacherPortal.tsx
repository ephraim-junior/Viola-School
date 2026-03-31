import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, BookOpen, ClipboardList, CheckSquare, 
  MessageSquare, FileText, BarChart3, Library,
  Plus, Save, Trash2, Send, Search, Filter,
  Calendar as CalendarIcon, Clock, AlertCircle,
  ChevronRight, Download, Upload, MoreVertical,
  GraduationCap, Users, Star, LayoutDashboard, XCircle
} from 'lucide-react';
import { 
  collection, query, where, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc, 
  serverTimestamp, orderBy, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { format } from 'date-fns';

type Tab = 'dashboard' | 'results' | 'assignments' | 'attendance' | 'progress' | 'communication' | 'lesson-plans' | 'gradebook' | 'resources' | 'settings';

export function TeacherPortal() {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data());
      }
      setLoading(false);
    });

    return () => unsubUser();
  }, [user]);

  useEffect(() => {
    if (!userProfile || (userProfile.role !== 'teacher' && userProfile.role !== 'admin')) return;

    const fetchData = async () => {
      try {
        // Fetch students
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        setStudents(studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch assignments
        const qAssignments = query(collection(db, 'assignments'), where('teacherId', '==', user.uid));
        const assignmentsSnapshot = await getDocs(qAssignments);
        setAssignments(assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch lesson plans
        const qPlans = query(collection(db, 'lessonPlans'), where('teacherId', '==', user.uid));
        const plansSnapshot = await getDocs(qPlans);
        setLessonPlans(plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch resources
        const resourcesSnapshot = await getDocs(collection(db, 'resources'));
        setResources(resourcesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching teacher portal data:", err);
      }
    };

    fetchData();
  }, [userProfile, user, activeTab]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900" />
      </div>
    );
  }

  if (!user || (userProfile?.role !== 'teacher' && userProfile?.role !== 'admin')) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4 text-center">
        <div className="mb-6 rounded-full bg-stone-100 p-6">
          <GraduationCap className="h-16 w-16 text-stone-400" />
        </div>
        <h1 className="mb-2 text-3xl font-light tracking-tight text-stone-900">Teacher Portal Access</h1>
        <p className="mb-8 max-w-md text-stone-600">
          This portal is reserved for authorized teaching staff. Please log in with your teacher account to access these features.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-stone-800"
        >
          Return Home
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'gradebook', label: 'Grade Book', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'lesson-plans', label: 'Lesson Plans', icon: FileText },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'settings', label: 'Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500">
              <span className="rounded bg-stone-900 px-2 py-0.5 text-white">Pro Upgrade</span>
              <span>Teacher Portal</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-stone-900">Welcome, {userProfile.name}</h1>
            <p className="text-stone-600">Teacher ID: {userProfile.teacherId || 'Not Assigned'} • Manage your classes, students, and curriculum.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-stone-900">{format(new Date(), 'EEEE, MMMM do')}</div>
              <div className="text-xs text-stone-500">Academic Year 2025/2026</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-stone-200 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-stone-100">
                <User className="h-5 w-5 text-stone-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-stone-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-stone-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 rounded-2xl bg-stone-900 p-6 text-white shadow-xl">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-400">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-300">Total Students</span>
                  <span className="text-lg font-medium">{students.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-300">Active Assignments</span>
                  <span className="text-lg font-medium">{assignments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-300">Pending Messages</span>
                  <span className="text-lg font-medium">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
              >
                {activeTab === 'dashboard' && <DashboardOverview students={students} assignments={assignments} />}
                {activeTab === 'attendance' && <AttendanceSystem students={students} teacherId={user.uid} />}
                {activeTab === 'assignments' && <AssignmentManager teacherId={user.uid} assignments={assignments} />}
                {activeTab === 'results' && <ResultsUploader students={students} teacherId={user.uid} />}
                {activeTab === 'gradebook' && <GradeBook students={students} assignments={assignments} teacherId={user.uid} />}
                {activeTab === 'progress' && <ProgressTracker students={students} teacherId={user.uid} />}
                {activeTab === 'lesson-plans' && <LessonPlanner teacherId={user.uid} lessonPlans={lessonPlans} />}
                {activeTab === 'communication' && <CommunicationHub teacherId={user.uid} />}
                {activeTab === 'resources' && <ResourceLibrary resources={resources} />}
                {activeTab === 'settings' && <ProfileSettings userProfile={userProfile} userId={user.uid} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function DashboardOverview({ students, assignments }: any) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-stone-900">Dashboard Overview</h2>
        <button className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 transition-all hover:bg-stone-50">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: 'Attendance Rate', value: '94%', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg. Grade', value: 'B+', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Submissions', value: '82%', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-stone-100 bg-stone-50 p-6">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-medium text-stone-900">{stat.value}</div>
            <div className="text-sm text-stone-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Recent Assignments</h3>
          <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200">
            {assignments.slice(0, 4).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-stone-900">{item.title}</div>
                  <div className="text-xs text-stone-500">Due {format(new Date(item.dueDate), 'MMM do')}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-stone-300" />
              </div>
            ))}
            {assignments.length === 0 && (
              <div className="p-8 text-center text-sm text-stone-400 italic">No assignments created yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              { title: 'Parent-Teacher Meeting', date: 'Oct 15', time: '2:00 PM', type: 'Meeting' },
              { title: 'Mid-Term Exams', date: 'Oct 20', time: 'All Day', type: 'Exam' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-400">{event.date.split(' ')[0]}</span>
                  <span className="text-lg font-bold text-stone-900">{event.date.split(' ')[1]}</span>
                </div>
                <div>
                  <div className="font-medium text-stone-900">{event.title}</div>
                  <div className="text-xs text-stone-500">{event.time} • {event.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceSystem({ students, teacherId }: any) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleMark = (studentId: string, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(attendanceData).map(([studentId, status]) => {
        return addDoc(collection(db, 'attendance'), {
          date,
          studentId,
          status,
          teacherId,
          grade: students.find((s: any) => s.id === studentId)?.grade || 'Unknown',
          createdAt: serverTimestamp()
        });
      });
      await Promise.all(promises);
      alert('Attendance saved successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-light tracking-tight text-stone-900">Attendance Marking</h2>
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
          <button 
            onClick={saveAttendance}
            disabled={saving || Object.keys(attendanceData).length === 0}
            className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-stone-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-widest text-stone-500">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {students.map((student: any) => (
              <tr key={student.id} className="hover:bg-stone-50/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-stone-900">{student.name}</div>
                  <div className="text-xs text-stone-500">ID: {student.studentId}</div>
                </td>
                <td className="px-6 py-4 text-sm text-stone-600">{student.grade}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {['Present', 'Absent', 'Late'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleMark(student.id, status)}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                          attendanceData[student.id] === status
                            ? status === 'Present' ? 'bg-green-600 text-white' : status === 'Absent' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssignmentManager({ teacherId, assignments }: any) {
  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    grade: '',
    subject: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'assignments'), {
        ...newAssignment,
        teacherId,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setNewAssignment({ title: '', description: '', dueDate: '', grade: '', subject: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'assignments');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-stone-900">Assignments</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 rounded-2xl bg-stone-50 p-6 ring-1 ring-stone-200"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Title</label>
              <input 
                required
                value={newAssignment.title}
                onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Due Date</label>
              <input 
                required
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Grade</label>
              <select 
                required
                value={newAssignment.grade}
                onChange={e => setNewAssignment({...newAssignment, grade: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                <option value="">Select Grade</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Subject</label>
              <input 
                required
                value={newAssignment.subject}
                onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Description</label>
            <textarea 
              required
              rows={3}
              value={newAssignment.description}
              onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full px-6 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="rounded-full bg-stone-900 px-8 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Create Assignment
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {assignments.map((item: any) => (
          <div key={item.id} className="group relative rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-600">
                {item.subject} • {item.grade}
              </div>
              <button className="text-stone-300 hover:text-stone-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mb-2 text-lg font-medium text-stone-900">{item.title}</h3>
            <p className="mb-4 line-clamp-2 text-sm text-stone-600">{item.description}</p>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {format(new Date(item.dueDate), 'MMM do, h:mm a')}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                0/24 Submitted
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsUploader({ students, teacherId }: any) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [result, setResult] = useState({
    subject: '',
    score: 0,
    level: 'Meets Expectations'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'results'), {
        ...result,
        studentId: selectedStudent,
        teacherId,
        createdAt: serverTimestamp()
      });
      alert('Result uploaded successfully!');
      setResult({ subject: '', score: 0, level: 'Meets Expectations' });
      setSelectedStudent('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'results');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-tight text-stone-900">Upload Results</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Select Student</label>
          <select 
            required
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
          >
            <option value="">Choose a student...</option>
            {students.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Subject</label>
            <input 
              required
              value={result.subject}
              onChange={e => setResult({...result, subject: e.target.value})}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Score (%)</label>
            <input 
              required
              type="number"
              min="0"
              max="100"
              value={result.score}
              onChange={e => setResult({...result, score: parseInt(e.target.value)})}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">CBC Level</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["Exceeds Expectations", "Meets Expectations", "Approaching Expectations", "Below Expectations"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setResult({...result, level})}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  result.level === level 
                    ? 'border-stone-900 bg-stone-900 text-white' 
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-stone-900 py-4 text-sm font-medium text-white transition-all hover:bg-stone-800 disabled:opacity-50"
        >
          {saving ? 'Uploading...' : 'Upload Result'}
        </button>
      </form>
    </div>
  );
}

function GradeBook({ students, assignments, teacherId }: any) {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const saveGrades = async () => {
    if (!selectedAssignment) return;
    setSaving(true);
    try {
      const promises = Object.entries(grades).map(([studentId, score]) => {
        return addDoc(collection(db, 'gradebook'), {
          studentId,
          assignmentId: selectedAssignment,
          score,
          teacherId,
          date: new Date().toISOString(),
          createdAt: serverTimestamp()
        });
      });
      await Promise.all(promises);
      alert('Grades saved!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gradebook');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-stone-900">Grade Book</h2>
        <div className="flex gap-4">
          <select 
            value={selectedAssignment}
            onChange={e => setSelectedAssignment(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none"
          >
            <option value="">Select Assignment</option>
            {assignments.map((a: any) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          <button 
            onClick={saveGrades}
            disabled={saving || !selectedAssignment}
            className="rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            Save Grades
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-widest text-stone-500">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Score (0-100)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {students.map((student: any) => (
              <tr key={student.id}>
                <td className="px-6 py-4 font-medium text-stone-900">{student.name}</td>
                <td className="px-6 py-4">
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={grades[student.id] || ''}
                    onChange={e => setGrades({...grades, [student.id]: parseInt(e.target.value)})}
                    className="w-20 rounded-lg border border-stone-200 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  {grades[student.id] !== undefined ? (
                    <span className={`text-xs font-bold uppercase ${grades[student.id] >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                      {grades[student.id] >= 80 ? 'Excellent' : grades[student.id] >= 50 ? 'Pass' : 'Needs Work'}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProgressTracker({ students, teacherId }: any) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-tight text-stone-900">Student Progress Tracking</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student: any) => (
          <div key={student.id} className="rounded-2xl border border-stone-200 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                <User className="h-5 w-5 text-stone-400" />
              </div>
              <div>
                <div className="font-medium text-stone-900">{student.name}</div>
                <div className="text-xs text-stone-500">{student.grade}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-stone-500">Literacy</span>
                  <span className="font-bold text-stone-900">85%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100">
                  <div className="h-full w-[85%] rounded-full bg-stone-900" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-stone-500">Numeracy</span>
                  <span className="font-bold text-stone-900">72%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100">
                  <div className="h-full w-[72%] rounded-full bg-stone-900" />
                </div>
              </div>
            </div>
            <button className="mt-6 w-full rounded-xl border border-stone-200 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50">
              View Detailed Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonPlanner({ teacherId, lessonPlans }: any) {
  const [showForm, setShowForm] = useState(false);
  const [plan, setPlan] = useState({
    title: '',
    objective: '',
    activities: '',
    assessment: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    grade: '',
    subject: ''
  });

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'lessonPlans'), {
        ...plan,
        teacherId,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setPlan({ title: '', objective: '', activities: '', assessment: '', date: format(new Date(), 'yyyy-MM-dd'), grade: '', subject: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'lessonPlans');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-stone-900">Lesson Planning</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={savePlan} className="space-y-4 rounded-2xl bg-stone-50 p-6 ring-1 ring-stone-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input placeholder="Title" required className="rounded-xl border p-3 text-sm" value={plan.title} onChange={e => setPlan({...plan, title: e.target.value})} />
            <input type="date" required className="rounded-xl border p-3 text-sm" value={plan.date} onChange={e => setPlan({...plan, date: e.target.value})} />
            <input placeholder="Grade" required className="rounded-xl border p-3 text-sm" value={plan.grade} onChange={e => setPlan({...plan, grade: e.target.value})} />
            <input placeholder="Subject" required className="rounded-xl border p-3 text-sm" value={plan.subject} onChange={e => setPlan({...plan, subject: e.target.value})} />
          </div>
          <textarea placeholder="Objective" required rows={2} className="w-full rounded-xl border p-3 text-sm" value={plan.objective} onChange={e => setPlan({...plan, objective: e.target.value})} />
          <textarea placeholder="Activities" required rows={3} className="w-full rounded-xl border p-3 text-sm" value={plan.activities} onChange={e => setPlan({...plan, activities: e.target.value})} />
          <textarea placeholder="Assessment" required rows={2} className="w-full rounded-xl border p-3 text-sm" value={plan.assessment} onChange={e => setPlan({...plan, assessment: e.target.value})} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
            <button type="submit" className="rounded-full bg-stone-900 px-6 py-2 text-sm text-white">Save Plan</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {lessonPlans.map((p: any) => (
          <div key={p.id} className="rounded-2xl border border-stone-200 p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium text-stone-900">{p.title}</h3>
              <span className="text-xs text-stone-500">{p.date}</span>
            </div>
            <div className="mb-4 text-xs font-bold uppercase text-stone-400">{p.subject} • {p.grade}</div>
            <p className="text-sm text-stone-600"><strong>Objective:</strong> {p.objective}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunicationHub({ teacherId }: any) {
  const [parents, setParents] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'parent'));
    getDocs(q).then(snapshot => {
      setParents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    if (!selectedParent) return;
    const q = query(
      collection(db, 'communications'),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = allMsgs.filter((m: any) => 
        (m.senderId === teacherId && m.receiverId === selectedParent.uid) ||
        (m.senderId === selectedParent.uid && m.receiverId === teacherId)
      );
      setChat(filtered);
    });
    return () => unsub();
  }, [selectedParent, teacherId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParent || !message.trim()) return;
    try {
      await addDoc(collection(db, 'communications'), {
        senderId: teacherId,
        receiverId: selectedParent.uid,
        content: message,
        timestamp: new Date().toISOString(),
        read: false
      });
      setMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'communications');
    }
  };

  return (
    <div className="flex h-[600px] gap-6">
      <div className="w-1/3 space-y-4 overflow-y-auto border-r border-stone-100 pr-4">
        <h2 className="text-xl font-light text-stone-900">Parents</h2>
        {parents.map(p => (
          <button 
            key={p.id}
            onClick={() => setSelectedParent(p)}
            className={`w-full rounded-xl p-4 text-left transition-all ${selectedParent?.id === p.id ? 'bg-stone-900 text-white' : 'bg-stone-50 hover:bg-stone-100'}`}
          >
            <div className="font-medium">{p.name}</div>
            <div className={`text-xs ${selectedParent?.id === p.id ? 'text-stone-400' : 'text-stone-500'}`}>Parent of {p.studentId || 'N/A'}</div>
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        {selectedParent ? (
          <>
            <div className="mb-4 border-bottom border-stone-100 pb-4">
              <h3 className="font-medium text-stone-900">Chat with {selectedParent.name}</h3>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {chat.map(m => (
                <div key={m.id} className={`flex ${m.senderId === teacherId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.senderId === teacherId ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-900'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex gap-2">
              <input 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-stone-200 px-4 py-2 text-sm focus:outline-none"
              />
              <button type="submit" className="rounded-full bg-stone-900 p-2 text-white">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400 italic">
            Select a parent to start communicating.
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSettings({ userProfile, userId }: any) {
  const [teacherId, setTeacherId] = useState(userProfile.teacherId || '');
  const [name, setName] = useState(userProfile.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        teacherId,
        name,
        updatedAt: serverTimestamp()
      });
      alert('Profile updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'users');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-tight text-stone-900">Profile Settings</h2>
      <form onSubmit={handleSave} className="max-w-md space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Full Name</label>
          <input 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Teacher ID (Staff Number)</label>
          <input 
            required
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
            placeholder="e.g., T-101"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>
        <button 
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-stone-900 py-4 text-sm font-medium text-white transition-all hover:bg-stone-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

function ResourceLibrary({ resources }: any) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: 'Textbook',
    type: 'link', // 'link' or 'file'
    url: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalUrl = newResource.url;

      if (newResource.type === 'file' && file) {
        const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'resources'), {
        title: newResource.title,
        description: newResource.description,
        category: newResource.category,
        url: finalUrl,
        createdAt: serverTimestamp()
      });

      setShowUpload(false);
      setNewResource({ title: '', description: '', category: 'Textbook', type: 'link', url: '' });
      setFile(null);
      alert('Resource added successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'resources');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight text-stone-900">Resource Library</h2>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          {showUpload ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showUpload ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {showUpload && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleUpload}
          className="space-y-4 rounded-2xl bg-stone-50 p-6 ring-1 ring-stone-200"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Title</label>
              <input 
                required
                value={newResource.title}
                onChange={e => setNewResource({...newResource, title: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Category</label>
              <select 
                value={newResource.category}
                onChange={e => setNewResource({...newResource, category: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                <option value="Textbook">Textbook</option>
                <option value="Project">Project</option>
                <option value="Assessment">Assessment</option>
                <option value="Guide">Guide</option>
                <option value="Presentation">Presentation</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Resource Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="radio" 
                  name="type" 
                  checked={newResource.type === 'link'} 
                  onChange={() => setNewResource({...newResource, type: 'link'})}
                />
                External Link
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="radio" 
                  name="type" 
                  checked={newResource.type === 'file'} 
                  onChange={() => setNewResource({...newResource, type: 'file'})}
                />
                File Upload
              </label>
            </div>
          </div>

          {newResource.type === 'link' ? (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">URL</label>
              <input 
                required
                type="url"
                value={newResource.url}
                onChange={e => setNewResource({...newResource, url: e.target.value})}
                placeholder="https://example.com/resource"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">File</label>
              <input 
                required
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">Description</label>
            <textarea 
              rows={2}
              value={newResource.description}
              onChange={e => setNewResource({...newResource, description: e.target.value})}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className="w-full rounded-full bg-stone-900 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {uploading ? 'Processing...' : 'Add to Library'}
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {resources.map((r: any) => (
          <div key={r.id} className="group flex items-center gap-4 rounded-2xl border border-stone-200 p-4 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
              {r.url.includes('drive.google.com') || r.url.includes('youtube.com') ? (
                <Library className="h-6 w-6 text-stone-400" />
              ) : (
                <FileText className="h-6 w-6 text-stone-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-stone-900">{r.title}</div>
              <div className="text-xs text-stone-500">{r.category}</div>
            </div>
            <a 
              href={r.url} 
              target="_blank" 
              rel="noreferrer" 
              className="rounded-full p-2 text-stone-400 transition-all hover:bg-stone-100 hover:text-stone-900"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
