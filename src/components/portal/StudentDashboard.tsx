import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Calendar, Bell, FileText, 
  ExternalLink, Trophy, Star, Clock, 
  CheckCircle2, AlertCircle, TrendingUp, Download
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { 
  collection, query, where, onSnapshot, orderBy 
} from 'firebase/firestore';
import { UserProfile, CBCResult, Announcement, Resource } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

interface StudentDashboardProps {
  user: any;
  userProfile: UserProfile;
}

export function StudentDashboard({ user, userProfile }: StudentDashboardProps) {
  const [results, setResults] = useState<CBCResult[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userProfile.studentId) return;

    const unsubResults = onSnapshot(
      query(collection(db, 'results'), where('studentId', '==', userProfile.studentId)),
      (snapshot) => {
        setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CBCResult)));
        setIsLoading(false);
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'results')
    );

    const unsubAnnouncements = onSnapshot(
      query(collection(db, 'announcements'), orderBy('date', 'desc')),
      (snapshot) => {
        setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'announcements')
    );

    const unsubResources = onSnapshot(
      query(collection(db, 'resources'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource)));
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'resources')
    );

    return () => {
      unsubResults();
      unsubAnnouncements();
      unsubResources();
    };
  }, [userProfile.studentId]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Exceeds Expectations': return 'bg-green-500';
      case 'Meets Expectations': return 'bg-blue-500';
      case 'Approaching Expectations': return 'bg-amber-500';
      case 'Below Expectations': return 'bg-red-500';
      default: return 'bg-stone-500';
    }
  };

  return (
    <div className="space-y-12">
      {/* Student Stats Header */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Achievements</h3>
          <p className="mt-2 text-4xl font-bold text-stone-900">12</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <Star className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Subjects</h3>
          <p className="mt-2 text-4xl font-bold text-stone-900">{results.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Attendance</h3>
          <p className="mt-2 text-4xl font-bold text-stone-900">98%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Content: Results & Assignments */}
        <div className="lg:col-span-2 space-y-12">
          {/* Academic Progress */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">Academic Progress</h2>
              <div className="flex items-center space-x-2 text-xs text-stone-400">
                <TrendingUp className="h-4 w-4" />
                <span>Current Term</span>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="rounded-2xl bg-white p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-stone-900">{result.subject}</h4>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold text-white ${getLevelColor(result.level)}`}>
                        {result.level}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${(result.score / 4) * 100}%` }}
                        className={`h-full ${getLevelColor(result.level)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center border border-stone-100">
                <FileText className="h-12 w-12 text-stone-100 mx-auto mb-4" />
                <p className="text-stone-400 italic">No assessment results available yet.</p>
              </div>
            )}
          </section>

          {/* Timetable Placeholder */}
          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Today's Timetable</h2>
            <div className="space-y-4">
              {[
                { time: '08:00 - 09:30', subject: 'Mathematics', room: 'Room 4', teacher: 'Mr. Kamau' },
                { time: '09:30 - 11:00', subject: 'English Literacy', room: 'Room 4', teacher: 'Mrs. Wanjiku' },
                { time: '11:30 - 13:00', subject: 'Science & Tech', room: 'Lab 1', teacher: 'Mr. Otieno' },
              ].map((slot, i) => (
                <div key={i} className="flex items-center space-x-6 rounded-2xl bg-white p-6 shadow-sm border border-stone-100">
                  <div className="text-sm font-bold text-stone-400 whitespace-nowrap">{slot.time}</div>
                  <div className="h-10 w-px bg-stone-100" />
                  <div>
                    <h4 className="font-bold text-stone-900">{slot.subject}</h4>
                    <p className="text-xs text-stone-500">{slot.room} • {slot.teacher}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Announcements & Resources */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Announcements</h2>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="rounded-2xl bg-white p-6 shadow-sm border border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                    {new Date(ann.date?.toDate()).toLocaleDateString()}
                  </p>
                  <h3 className="font-bold text-stone-900 mb-1">{ann.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-center text-sm text-stone-400 italic">No recent announcements.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-stone-900 p-8 text-white">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold">My Resources</h3>
              <Download className="h-5 w-5 text-stone-500" />
            </div>
            <div className="space-y-3">
              {resources.slice(0, 4).map((res) => (
                <a 
                  key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/5 p-4 text-sm transition-all hover:bg-white/10 group"
                >
                  <span className="font-medium text-stone-300 group-hover:text-white">{res.title}</span>
                  <ExternalLink className="h-3 w-3 text-stone-600 group-hover:text-stone-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
