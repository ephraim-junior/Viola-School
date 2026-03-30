import { useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { LogIn, LogOut, User, BookOpen, Calendar, Bell, Loader2, GraduationCap } from 'lucide-react';
import { StudentProgress } from '../types';

export function ParentPortal() {
  const [user, loading, error] = useAuthState(auth);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => signOut(auth);

  const fetchProgress = async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      // In a real app, we'd query by parent's email or student ID linked to parent
      const q = query(collection(db, 'progress'), where('studentId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentProgress));
      setProgress(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-stone-900" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-white p-12 text-center shadow-xl"
        >
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-900">
              <GraduationCap className="h-10 w-10" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-stone-900">Parent Portal</h1>
          <p className="mb-10 text-stone-600">
            Access your child's progress reports, school announcements, and academic calendar.
          </p>
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center space-x-3 rounded-full bg-stone-900 py-4 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5" />
            <span>Login with Google</span>
          </button>
          <p className="mt-6 text-xs text-stone-400">
            Only registered parents can access the portal. Contact the administration if you have trouble logging in.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <img
              src={user.photoURL || ''}
              alt={user.displayName || ''}
              className="h-16 w-16 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Welcome, {user.displayName}</h1>
              <p className="text-stone-500">Parent Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: 'Academic Progress', value: 'Term 1', icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
            { label: 'Next Event', value: 'Parents Meeting', icon: Calendar, color: 'bg-green-50 text-green-600' },
            { label: 'Unread Notifications', value: '2 New', icon: Bell, color: 'bg-amber-50 text-amber-600' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white p-8 shadow-sm">
              <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-stone-500">{stat.label}</p>
              <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Progress Reports */}
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">Student Progress Reports</h2>
              <button
                onClick={fetchProgress}
                className="text-sm font-bold text-stone-900 underline underline-offset-4"
              >
                Refresh
              </button>
            </div>

            {isLoadingData ? (
              <div className="flex h-64 items-center justify-center rounded-3xl bg-white shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
              </div>
            ) : progress.length > 0 ? (
              <div className="space-y-6">
                {progress.map((report) => (
                  <div key={report.id} className="rounded-3xl bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-stone-900">{report.studentName}</h3>
                        <p className="text-sm text-stone-500">{report.grade} • {report.term}</p>
                      </div>
                      <span className="rounded-full bg-stone-900 px-4 py-1 text-xs font-bold text-white">CBC Aligned</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {Object.entries(report.competencies).map(([key, val]) => (
                        <div key={key} className="rounded-2xl bg-stone-50 p-4 text-center">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">{key}</p>
                          <p className="text-sm font-bold text-stone-900">{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-stone-100 pt-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Teacher's Comments</p>
                      <p className="mt-2 text-sm text-stone-600">{report.teacherComments}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm">
                <div className="mb-4 rounded-full bg-stone-50 p-4 text-stone-300">
                  <User className="h-10 w-10" />
                </div>
                <h3 className="font-bold text-stone-900">No reports found</h3>
                <p className="mt-2 text-sm text-stone-500">
                  Progress reports for the current term have not been uploaded yet.
                </p>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-stone-900">Announcements</h2>
            <div className="space-y-4">
              {[
                { title: 'School Trip to Nairobi National Park', date: 'April 15, 2026', type: 'Event' },
                { title: 'Mid-Term Break Notice', date: 'April 20, 2026', type: 'Notice' },
                { title: 'New Sports Club Registration', date: 'Ongoing', type: 'Sports' },
              ].map((ann, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border-l-4 border-stone-900">
                  <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-widest text-stone-400">{ann.type}</span>
                  <h3 className="mb-1 font-bold text-stone-900">{ann.title}</h3>
                  <p className="text-xs text-stone-500">{ann.date}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-stone-900 p-8 text-white">
              <h3 className="mb-4 font-bold">Need Help?</h3>
              <p className="mb-6 text-sm text-stone-400">
                If you have any questions regarding your child's progress or school policies, please contact the office.
              </p>
              <button className="w-full rounded-full bg-white py-3 text-sm font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95">
                Contact Office
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
