import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, CreditCard, Calendar, Bell, BookOpen, 
  ExternalLink, FileText, Smartphone, Banknote, 
  MessageSquare, TrendingUp, CheckCircle2, AlertCircle
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  doc, getDoc, getDocs 
} from 'firebase/firestore';
import { UserProfile, Student, CBCResult, Announcement, Resource } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

interface ParentDashboardProps {
  user: any;
  userProfile: UserProfile;
}

export function ParentDashboard({ user, userProfile }: ParentDashboardProps) {
  const [child, setChild] = useState<Student | null>(null);
  const [results, setResults] = useState<CBCResult[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayFees, setShowPayFees] = useState(false);

  useEffect(() => {
    if (!userProfile.uid) return;

    // Fetch child linked to this parent
    const unsubChild = onSnapshot(
      query(collection(db, 'students'), where('parentId', '==', userProfile.uid)),
      (snapshot) => {
        if (!snapshot.empty) {
          const childData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Student;
          setChild(childData);
          fetchChildResults(childData.studentId);
        }
        setIsLoading(false);
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'students')
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
      unsubChild();
      unsubAnnouncements();
      unsubResources();
    };
  }, [userProfile.uid]);

  const fetchChildResults = (studentId: string) => {
    const path = 'results';
    onSnapshot(
      query(collection(db, path), where('studentId', '==', studentId)),
      (snapshot) => {
        setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CBCResult)));
      },
      (err) => handleFirestoreError(err, OperationType.GET, path)
    );
  };

  const chartData = results.map(r => ({
    subject: r.subject,
    score: r.score,
    level: r.level
  }));

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Exceeds Expectations': return '#10b981';
      case 'Meets Expectations': return '#3b82f6';
      case 'Approaching Expectations': return '#f59e0b';
      case 'Below Expectations': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="space-y-12">
      {/* Child Overview Card */}
      {child ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-8 shadow-sm border border-stone-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-stone-900">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-stone-900">{child.name}</h2>
                <p className="text-stone-500 font-medium">{child.grade} • Student ID: {child.studentId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Fee Balance</p>
                <p className="text-2xl font-bold text-stone-900">KES 12,500</p>
              </div>
              <button 
                onClick={() => setShowPayFees(true)}
                className="rounded-full bg-stone-900 px-8 py-4 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                Pay Fees
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center border border-stone-100">
          <AlertCircle className="h-12 w-12 text-stone-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900">No Child Linked</h3>
          <p className="text-stone-500 mt-2">Please contact the school administration to link your account to your child's record.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Academic Performance */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">Academic Performance (CBC)</h2>
            <div className="flex items-center space-x-2 text-xs text-stone-400">
              <TrendingUp className="h-4 w-4" />
              <span>Current Term</span>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-8">
              {/* Performance Chart */}
              <div className="h-[300px] w-full rounded-3xl bg-white p-6 shadow-sm border border-stone-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis hide domain={[0, 4]} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl bg-white p-4 shadow-xl border border-stone-100">
                              <p className="font-bold text-stone-900">{payload[0].payload.subject}</p>
                              <p className="text-xs text-stone-500 mt-1">{payload[0].payload.level}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getLevelColor(entry.level)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Results List */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {results.map((result) => (
                  <div key={result.id} className="rounded-2xl bg-white p-6 shadow-sm border border-stone-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900">{result.subject}</h4>
                      <p className="text-xs text-stone-500 mt-1">{result.level}</p>
                    </div>
                    <div 
                      className="h-3 w-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: getLevelColor(result.level) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center border border-stone-100">
              <FileText className="h-12 w-12 text-stone-100 mx-auto mb-4" />
              <p className="text-stone-400 italic">No assessment results available for this term.</p>
            </div>
          )}
        </div>

        {/* Sidebar: Announcements & Resources */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Announcements</h2>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="rounded-2xl bg-white p-6 shadow-sm border border-stone-100 hover:border-stone-900 transition-all cursor-pointer">
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
              <h3 className="font-bold">Learning Resources</h3>
              <BookOpen className="h-5 w-5 text-stone-500" />
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

      {/* M-Pesa Modal Placeholder */}
      {showPayFees && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowPayFees(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">School Fees Payment</h2>
              <button onClick={() => setShowPayFees(false)} className="rounded-full p-2 hover:bg-stone-50">
                <Calendar className="h-6 w-6 text-stone-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-2xl bg-green-50 p-6 border border-green-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold">M</div>
                  <div>
                    <h4 className="font-bold text-green-900">M-PESA Paybill</h4>
                    <p className="text-xs text-green-700">Instant verification</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Business No:</span>
                    <span className="font-bold text-green-900">123456</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Account No:</span>
                    <span className="font-bold text-green-900">{child?.studentId || 'STUDENT_ID'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-stone-50 p-6 border border-stone-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-stone-900 flex items-center justify-center text-white">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Bank Transfer</h4>
                    <p className="text-xs text-stone-500">2-3 business days</p>
                  </div>
                </div>
                <p className="text-xs text-stone-500">Equity Bank • Acc: 0123456789012</p>
              </div>
            </div>

            <button 
              onClick={() => setShowPayFees(false)}
              className="mt-8 w-full rounded-full bg-stone-900 py-4 font-bold text-white transition-all hover:scale-[1.02]"
            >
              I have made the payment
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
