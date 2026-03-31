import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, LogOut, Loader2, GraduationCap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { AdminDashboard } from '../components/portal/AdminDashboard';
import { ParentDashboard } from '../components/portal/ParentDashboard';
import { StudentDashboard } from '../components/portal/StudentDashboard';

export function ParentPortal() {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [loginType, setLoginType] = useState<'parent' | 'student'>('parent');
  const [authError, setAuthError] = useState<string | null>(null);
  const [tempStudentId, setTempStudentId] = useState('');
  const [isUpdatingId, setIsUpdatingId] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    setIsLoadingProfile(true);
    const path = `users/${user.uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // Create new profile if it doesn't exist
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          role: user.email === 'kamauwanyiri54@gmail.com' ? 'admin' : loginType,
        };
        await setDoc(doc(db, 'users', user.uid), {
          ...newProfile,
          createdAt: serverTimestamp()
        });
        setUserProfile(newProfile);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdateStudentId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tempStudentId) return;
    
    setIsUpdatingId(true);
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        studentId: tempStudentId
      });
      setUserProfile(prev => prev ? { ...prev, studentId: tempStudentId } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsUpdatingId(false);
    }
  };

  const handleLogin = async () => {
    if (!isFirebaseConfigured) {
      setAuthError("Firebase is not configured. Please add your API key in the Secrets panel.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      setAuthError(null);
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(err.message || "An error occurred during login.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUserProfile(null);
  };

  if (loading || isLoadingProfile) {
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
          <h1 className="mb-4 text-3xl font-bold text-stone-900">School Portal</h1>
          
          <div className="mb-8 flex rounded-full bg-stone-100 p-1">
            <button
              onClick={() => setLoginType('parent')}
              className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
                loginType === 'parent' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Parent Login
            </button>
            <button
              onClick={() => setLoginType('student')}
              className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
                loginType === 'student' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Student Login
            </button>
          </div>

          <p className="mb-10 text-stone-600">
            {loginType === 'parent' 
              ? "Access your child's progress reports, school announcements, and academic calendar."
              : "Access your assignments, CBC portfolio, and learning resources."}
          </p>

          {authError && (
            <div className="mb-6 flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-left text-xs text-red-600">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p>{authError}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center space-x-3 rounded-full bg-stone-900 py-4 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="h-5 w-5" />
            <span>Login with Google</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // If student role but no studentId, ask for it
  if (userProfile?.role === 'student' && !userProfile.studentId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-white p-12 text-center shadow-xl"
        >
          <h2 className="mb-4 text-2xl font-bold text-stone-900">Complete Your Profile</h2>
          <p className="mb-8 text-stone-600 text-sm">Please enter your Student ID to access your academic records.</p>
          <form onSubmit={handleUpdateStudentId} className="space-y-4">
            <input
              required
              placeholder="Student ID (e.g., STU001)"
              value={tempStudentId}
              onChange={(e) => setTempStudentId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 outline-none"
            />
            <button
              disabled={isUpdatingId}
              type="submit"
              className="w-full rounded-full bg-stone-900 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isUpdatingId ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Link Account'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 text-sm text-stone-500 hover:text-stone-900"
            >
              Logout
            </button>
          </form>
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
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Welcome, {user.displayName}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-stone-500 capitalize">{userProfile?.role}</span>
                {userProfile?.role === 'admin' && <ShieldCheck className="h-4 w-4 text-stone-800" />}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-stone-600 shadow-sm transition-colors hover:bg-stone-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Role-Based Dashboard Rendering */}
        {userProfile?.role === 'admin' && <AdminDashboard user={user} />}
        {userProfile?.role === 'parent' && <ParentDashboard user={user} userProfile={userProfile} />}
        {userProfile?.role === 'student' && <StudentDashboard user={user} userProfile={userProfile} />}
      </div>
    </div>
  );
}
