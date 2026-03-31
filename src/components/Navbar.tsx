import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data());
      }
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Student Life', path: '/student-life' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
    { name: 'Transportation', path: '/transportation' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white/80 py-4 shadow-sm backdrop-blur-md' : 'bg-transparent py-6'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-stone-800" />
            <span className="text-xl font-bold tracking-tight text-stone-900">
              Viola Quality Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-stone-600',
                    location.pathname === link.path ? 'text-stone-900 underline underline-offset-8' : 'text-stone-500'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.href = '/parent-portal?action=pay-fees'}
                  className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-stone-900 transition-all hover:bg-stone-50"
                >
                  Pay Fees
                </button>
                <Link
                  to="/parent-portal"
                  className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
                >
                  Parent Portal
                </Link>
                {(userProfile?.role === 'teacher' || userProfile?.role === 'admin') && (
                  <Link
                    to="/teacher-portal"
                    className="rounded-full border border-stone-900 bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    Teacher Portal
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-stone-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-4 text-base font-medium transition-colors',
                    location.pathname === link.path ? 'bg-stone-50 text-stone-900' : 'text-stone-600 hover:bg-stone-50'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/parent-portal"
                onClick={() => setIsOpen(false)}
                className="mt-4 block w-full rounded-full bg-stone-900 py-4 text-center text-base font-medium text-white"
              >
                Parent Portal
              </Link>
              {(userProfile?.role === 'teacher' || userProfile?.role === 'admin') && (
                <Link
                  to="/teacher-portal"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 block w-full rounded-full border border-stone-900 bg-stone-900 py-4 text-center text-base font-medium text-white"
                >
                  Teacher Portal
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
