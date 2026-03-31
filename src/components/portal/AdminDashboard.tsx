import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Newspaper, BookOpen, Plus, X, 
  Send, Loader2, ShieldCheck, Smartphone, Search,
  GraduationCap, FileText, Trash2, Edit2, CheckCircle2,
  Bus, Star, Phone
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, doc, updateDoc, deleteDoc, getDocs, where 
} from 'firebase/firestore';
import { UserProfile, Student, NewsItem, Resource, CBCResult, Announcement, Driver } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'news' | 'resources' | 'announcements' | 'results' | 'drivers' | 'users'>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({ studentId: '', name: '', grade: '', parentId: '' });
  
  const [showAddResult, setShowAddResult] = useState(false);
  const [resultForm, setResultForm] = useState<Partial<CBCResult>>({ 
    studentId: '', subject: '', score: 3, level: 'Meets Expectations' 
  });

  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  const [showAddDriver, setShowAddDriver] = useState(false);
  const [driverForm, setDriverForm] = useState({ name: '', photoUrl: '', phone: '', licenseNumber: '', rating: 5 });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Students
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        setStudents(studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));

        // Parents
        const parentsQuery = query(collection(db, 'users'), where('role', '==', 'parent'));
        const parentsSnapshot = await getDocs(parentsQuery);
        setParents(parentsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));

        // All Users (for role management)
        const allUsersSnapshot = await getDocs(collection(db, 'users'));
        setAllUsers(allUsersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));

        // Announcements
        const announcementsQuery = query(collection(db, 'announcements'), orderBy('date', 'desc'));
        const announcementsSnapshot = await getDocs(announcementsQuery);
        setAnnouncements(announcementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));

        // Drivers
        const driversSnapshot = await getDocs(collection(db, 'drivers'));
        setDrivers(driversSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)));
      } catch (err) {
        console.error("Error fetching admin data:", err);
        // We don't want to spam the user with errors during initial load if they aren't admin yet
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]); // Refetch when tab changes or on mount

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const path = 'students';
    try {
      await addDoc(collection(db, path), {
        ...studentForm,
        createdAt: serverTimestamp()
      });
      setStudentForm({ studentId: '', name: '', grade: '', parentId: '' });
      setShowAddStudent(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const path = 'results';
    try {
      await addDoc(collection(db, path), {
        ...resultForm,
        createdAt: serverTimestamp()
      });
      setResultForm({ studentId: '', subject: '', score: 3, level: 'Meets Expectations' });
      setShowAddResult(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const path = 'announcements';
    try {
      await addDoc(collection(db, path), {
        ...announcementForm,
        date: serverTimestamp()
      });
      setAnnouncementForm({ title: '', content: '' });
      setShowAddAnnouncement(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const path = 'drivers';
    try {
      await addDoc(collection(db, path), {
        ...driverForm,
        createdAt: serverTimestamp()
      });
      setDriverForm({ name: '', photoUrl: '', phone: '', licenseNumber: '', rating: 5 });
      setShowAddDriver(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Navigation */}
      <div className="flex space-x-4 border-b border-stone-200 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: Users },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'results', label: 'CBC Results', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: Send },
          { id: 'news', label: 'News', icon: Newspaper },
          { id: 'resources', label: 'Resources', icon: BookOpen },
          { id: 'drivers', label: 'Drivers', icon: Bus },
          { id: 'users', label: 'Users', icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Students</h3>
              <p className="mt-2 text-4xl font-bold text-stone-900">{students.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Parents</h3>
              <p className="mt-2 text-4xl font-bold text-stone-900">{parents.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">CBC Reports</h3>
              <p className="mt-2 text-4xl font-bold text-stone-900">124</p>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">Student Management</h2>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-100">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Student ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Grade</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Parent</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{student.studentId}</td>
                      <td className="px-6 py-4 font-bold text-stone-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{student.grade}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {parents.find(p => p.uid === student.parentId)?.displayName || 'Not Linked'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-stone-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">CBC Assessment Results</h2>
              <button 
                onClick={() => setShowAddResult(true)}
                className="flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Result</span>
              </button>
            </div>
            {/* Results table would go here */}
            <div className="rounded-3xl bg-white p-12 text-center border-2 border-dashed border-stone-100">
              <FileText className="h-12 w-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-500">Select a student to view or add assessment results.</p>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">School Announcements</h2>
              <button 
                onClick={() => setShowAddAnnouncement(true)}
                className="flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>New Announcement</span>
              </button>
            </div>
            {/* Announcements list */}
            <div className="grid grid-cols-1 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="rounded-2xl bg-white p-6 shadow-sm border border-stone-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-stone-900">{ann.title}</h3>
                    <p className="text-sm text-stone-500 mt-1">{ann.content}</p>
                    <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-widest">
                      {ann.date?.toDate?.() ? ann.date.toDate().toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (ann.id) await deleteDoc(doc(db, 'announcements', ann.id));
                    }}
                    className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-stone-100">
                  <p className="text-stone-400 italic">No announcements yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">School News</h2>
              <p className="text-sm text-stone-500">Manage news items shown on the public website.</p>
            </div>
            <div className="rounded-3xl bg-white p-12 text-center border-2 border-dashed border-stone-100">
              <Newspaper className="h-12 w-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-500">News management is currently handled via the News page.</p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">Learning Resources</h2>
              <p className="text-sm text-stone-500">Upload textbooks, guides, and assessment materials.</p>
            </div>
            <div className="rounded-3xl bg-white p-12 text-center border-2 border-dashed border-stone-100">
              <BookOpen className="h-12 w-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-500">Resource management is coming soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">Bus Drivers</h2>
                <p className="text-sm text-stone-500">Manage school bus drivers and their assignments.</p>
              </div>
              <button 
                onClick={() => setShowAddDriver(true)}
                className="flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Add Driver</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => (
                <div key={driver.id} className="rounded-3xl bg-white p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={driver.photoUrl} 
                      alt={driver.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-stone-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-stone-900">{driver.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="ml-1 text-xs font-bold">{driver.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-stone-500">
                      <Phone className="h-4 w-4" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-stone-500">
                      <ShieldCheck className="h-4 w-4" />
                      <span>License: {driver.licenseNumber}</span>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (driver.id) await deleteDoc(doc(db, 'drivers', driver.id));
                    }}
                    className="w-full rounded-xl bg-stone-50 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Remove Driver
                  </button>
                </div>
              ))}
              {drivers.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-stone-100">
                  <p className="text-stone-400 italic">No drivers registered yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">User Management</h2>
              <p className="text-sm text-stone-500">Manage user roles and permissions.</p>
            </div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-100">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Email</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-stone-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-stone-900">{u.displayName || 'Anonymous'}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={u.role}
                          onChange={async (e) => {
                            const newRole = e.target.value;
                            try {
                              await updateDoc(doc(db, 'users', u.uid), { role: newRole });
                              setAllUsers(prev => prev.map(user => user.uid === u.uid ? { ...user, role: newRole as any } : user));
                            } catch (err) {
                              handleFirestoreError(err, OperationType.WRITE, 'users');
                            }
                          }}
                          className="rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-stone-900 outline-none"
                        >
                          <option value="parent">Parent</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this user record?')) {
                              await deleteDoc(doc(db, 'users', u.uid));
                              setAllUsers(prev => prev.filter(user => user.uid !== u.uid));
                            }
                          }}
                          className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Driver Modal */}
      <AnimatePresence>
        {showAddDriver && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDriver(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-stone-900">Add New Driver</h3>
                <button onClick={() => setShowAddDriver(false)} className="rounded-full p-2 hover:bg-stone-100">
                  <X className="h-6 w-6 text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleAddDriver} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Full Name</label>
                    <input
                      required
                      type="text"
                      className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Photo URL</label>
                    <input
                      required
                      type="url"
                      className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                      value={driverForm.photoUrl}
                      onChange={(e) => setDriverForm({ ...driverForm, photoUrl: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Phone Number</label>
                      <input
                        required
                        type="tel"
                        className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        value={driverForm.phone}
                        onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-500">License Number</label>
                      <input
                        required
                        type="text"
                        className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        value={driverForm.licenseNumber}
                        onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-stone-900 py-4 font-bold text-white transition-all hover:bg-stone-800 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Register Driver</span>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showAddStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowAddStudent(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
          >
            <h3 className="mb-6 text-2xl font-bold text-stone-900">Add New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input
                required
                placeholder="Student ID (e.g., STU001)"
                value={studentForm.studentId}
                onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              />
              <input
                required
                placeholder="Full Name"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              />
              <select
                required
                value={studentForm.grade}
                onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              >
                <option value="">Select Grade</option>
                {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select
                value={studentForm.parentId}
                onChange={(e) => setStudentForm({ ...studentForm, parentId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              >
                <option value="">Link to Parent (Optional)</option>
                {parents.map(p => (
                  <option key={p.uid} value={p.uid}>{p.displayName}</option>
                ))}
              </select>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full rounded-full bg-stone-900 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Create Student Record'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showAddResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowAddResult(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
          >
            <h3 className="mb-6 text-2xl font-bold text-stone-900">Upload CBC Result</h3>
            <form onSubmit={handleAddResult} className="space-y-4">
              <select
                required
                value={resultForm.studentId}
                onChange={(e) => setResultForm({ ...resultForm, studentId: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              >
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s.id} value={s.studentId}>{s.name} ({s.studentId})</option>
                ))}
              </select>
              <input
                required
                placeholder="Subject (e.g., Mathematics)"
                value={resultForm.subject}
                onChange={(e) => setResultForm({ ...resultForm, subject: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              />
              <select
                required
                value={resultForm.level}
                onChange={(e) => setResultForm({ ...resultForm, level: e.target.value as any })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
              >
                <option>Exceeds Expectations</option>
                <option>Meets Expectations</option>
                <option>Approaching Expectations</option>
                <option>Below Expectations</option>
              </select>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full rounded-full bg-stone-900 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Save Result'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
