import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, BookOpen, Users, Trophy, Star, CheckCircle2, 
  Loader2, Send, Calendar, Clock, MapPin, ChevronRight, 
  Play, Globe, Heart, ShieldCheck, Lightbulb, GraduationCap, Mail, X
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', date: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setBookingStatus('success');
    setTimeout(() => {
      setShowBooking(false);
      setBookingStatus('idle');
      setBookingForm({ name: '', email: '', date: '', message: '' });
    }, 2000);
  };

  const stats = [
    { label: 'Students', value: '500+', icon: Users },
    { label: 'Teachers', value: '45+', icon: GraduationCap },
    { label: 'Success Rate', value: '100%', icon: Trophy },
    { label: 'Years of Excellence', value: '15+', icon: Star },
  ];

  const upcomingEvents = [
    { title: 'Term 1 Opening Day', date: 'Jan 08, 2026', time: '8:00 AM', location: 'Main Hall', type: 'Academic' },
    { title: 'Annual Sports Day', date: 'Feb 15, 2026', time: '9:00 AM', location: 'School Field', type: 'Sports' },
    { title: 'Parent-Teacher Conference', date: 'Mar 20, 2026', time: '2:00 PM', location: 'Classrooms', type: 'Meeting' },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('submitting');
    const path = 'newsletter';
    try {
      await addDoc(collection(db, path), {
        email: newsletterEmail,
        subscribedAt: serverTimestamp()
      });
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/school-campus/1920/1080"
            alt="School Campus"
            className="h-full w-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-transparent to-stone-900" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-bold tracking-widest text-white backdrop-blur-md uppercase">
              Excellence in CBC Education
            </span>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-8xl">
              Nurturing <span className="italic text-stone-300">Potential</span>, <br />
              Building <span className="italic text-stone-300">Character</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-stone-300 md:text-xl">
              Viola Quality Academy provides a world-class learning environment where every child is empowered to excel in the 21st century.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link
                to="/admissions"
                className="group flex items-center space-x-2 rounded-full bg-white px-10 py-5 text-sm font-bold text-stone-900 transition-all hover:scale-105 active:scale-95"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-white/30 bg-white/10 px-10 py-5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                Learn Our Story
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-12 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-16 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-8 shadow-2xl md:grid-cols-4 md:p-12 border border-stone-100">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <stat.icon className="h-6 w-6 text-stone-400" />
              </div>
              <p className="text-3xl font-bold text-stone-900 md:text-4xl">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CBC Approach Summary */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-stone-400">Our Educational Philosophy</span>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">
                The CBC Advantage: <br />
                <span className="text-stone-500">Skills for the Real World</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-stone-600">
                At Viola Quality Academy, we embrace the Competency Based Curriculum (CBC) to move beyond rote memorization. Our approach focuses on developing core competencies that prepare students for life.
              </p>
              <ul className="space-y-4">
                {[
                  'Critical Thinking & Problem Solving',
                  'Creativity & Imagination',
                  'Communication & Collaboration',
                  'Self-Efficacy & Citizenship',
                  'Digital Literacy & Learning to Learn'
                ].map((skill) => (
                  <li key={skill} className="flex items-center space-x-3 text-stone-700">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100">
                      <CheckCircle2 className="h-4 w-4 text-stone-900" />
                    </div>
                    <span className="font-medium">{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden rounded-[3rem] shadow-2xl">
                <img
                  src="https://picsum.photos/seed/learning-cbc/800/800"
                  alt="Students Learning"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 rounded-3xl bg-stone-900 p-10 text-white shadow-2xl border border-white/10">
                <p className="text-5xl font-bold">100%</p>
                <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mt-2">CBC Compliance</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="bg-stone-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-20">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-stone-400">Academic Excellence</span>
            <h2 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">Our Academic Programs</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Pre-Primary', desc: 'PP1 & PP2: Play-based foundational learning.', icon: Star },
              { title: 'Lower Primary', desc: 'Grade 1-3: Developing core literacy & numeracy.', icon: BookOpen },
              { title: 'Upper Primary', desc: 'Grade 4-6: Exploring science, arts & environment.', icon: Users },
              { title: 'Junior Secondary', desc: 'Grade 7-9: Career exploration & STEM focus.', icon: Trophy },
            ].map((program, i) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-[2.5rem] bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2"
              >
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                  <program.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-stone-900">{program.title}</h3>
                <p className="text-stone-600 leading-relaxed">{program.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section id="virtual-tour" className="bg-stone-900 py-24 sm:py-32 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/campus-wide-view/1920/1080" 
            alt="Campus Background" 
            className="w-full h-full object-cover blur-sm"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 relative z-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-stone-400 backdrop-blur-md">
                Experience Viola
              </span>
              <h2 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">Virtual School Tour</h2>
              <p className="mb-10 text-lg leading-relaxed text-stone-400">
                Can't visit us in person? Take a 360-degree journey through our modern classrooms, science labs, sports facilities, and creative spaces from the comfort of your home.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <button
                  onClick={() => setShowTour(true)}
                  className="flex items-center justify-center space-x-3 rounded-full bg-white px-10 py-5 font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95"
                >
                  <Play className="h-5 w-5 fill-current" />
                  <span>Start 360° Tour</span>
                </button>
                <button
                  onClick={() => setShowBooking(true)}
                  className="flex items-center justify-center space-x-3 rounded-full border border-white/30 px-10 py-5 font-bold transition-all hover:bg-white/10"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Book Physical Visit</span>
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white/5 group"
            >
              <img 
                src="https://picsum.photos/seed/tour-preview/1200/800" 
                alt="Tour Preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 transition-colors group-hover:bg-stone-900/20">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl text-white transition-transform hover:scale-110 cursor-pointer border border-white/30">
                  <Play className="h-10 w-10 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center space-x-3 rounded-2xl bg-stone-900/80 px-6 py-3 backdrop-blur-md border border-white/10">
                <Globe className="h-5 w-5 text-stone-400" />
                <span className="text-sm font-bold uppercase tracking-widest">Interactive 3D</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Calendar Section */}
      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-stone-400">Stay Updated</span>
              <h2 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">School Calendar</h2>
              <p className="mt-4 text-lg text-stone-600">Stay updated with our upcoming events and academic milestones.</p>
            </div>
            <Link to="/news" className="group flex items-center space-x-2 text-sm font-bold text-stone-900">
              <span>View All News & Events</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setActiveEvent(i)}
                onMouseLeave={() => setActiveEvent(null)}
                className={`group relative overflow-hidden rounded-[2.5rem] p-10 transition-all duration-500 cursor-default border border-stone-100 ${
                  activeEvent === i ? 'bg-stone-900 text-white shadow-2xl scale-[1.02]' : 'bg-white text-stone-900 shadow-sm'
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className={`rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
                    activeEvent === i ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {event.type}
                  </div>
                  <Calendar className={`h-6 w-6 ${activeEvent === i ? 'text-white/40' : 'text-stone-200'}`} />
                </div>
                <h3 className="mb-6 text-3xl font-bold leading-tight">{event.title}</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeEvent === i ? 'bg-white/5' : 'bg-stone-50'}`}>
                      <Clock className="h-5 w-5 text-stone-400" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${activeEvent === i ? 'text-stone-500' : 'text-stone-400'}`}>Date & Time</p>
                      <p className={`text-sm font-medium ${activeEvent === i ? 'text-stone-300' : 'text-stone-700'}`}>{event.date} at {event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeEvent === i ? 'bg-white/5' : 'bg-stone-50'}`}>
                      <MapPin className="h-5 w-5 text-stone-400" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${activeEvent === i ? 'text-stone-500' : 'text-stone-400'}`}>Location</p>
                      <p className={`text-sm font-medium ${activeEvent === i ? 'text-stone-300' : 'text-stone-700'}`}>{event.location}</p>
                    </div>
                  </div>
                </div>
                <div className={`mt-10 flex items-center space-x-2 text-sm font-bold transition-all duration-500 ${
                  activeEvent === i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  <span>Add to Calendar</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-stone-400">Testimonials</span>
              <h2 className="mb-12 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">What Parents Say</h2>
              <div className="space-y-10">
                {[
                  { 
                    name: 'Sarah Wanjiku', 
                    role: 'Parent, Grade 4', 
                    text: 'The transformation in my son\'s creativity since joining Viola is amazing. He loves the practical projects and the teachers are incredibly supportive.',
                    avatar: 'https://i.pravatar.cc/150?u=sarah'
                  },
                  { 
                    name: 'David Omari', 
                    role: 'Parent, PP2', 
                    text: 'A truly supportive environment. The play-based learning in Pre-Primary has made my daughter love coming to school every single day.',
                    avatar: 'https://i.pravatar.cc/150?u=david'
                  },
                ].map((t, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="rounded-[2.5rem] bg-stone-50 p-10 border border-stone-100"
                  >
                    <p className="mb-8 text-xl italic leading-relaxed text-stone-700">"{t.text}"</p>
                    <div className="flex items-center space-x-4">
                      <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-full border-2 border-white shadow-sm" />
                      <div>
                        <p className="text-lg font-bold text-stone-900">{t.name}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl">
                <img
                  src="https://picsum.photos/seed/happy-students-group/800/1000"
                  alt="Happy Students"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 rounded-[2.5rem] bg-stone-900 p-12 text-white shadow-2xl border border-white/10">
                <Heart className="mb-4 h-10 w-10 text-red-400 fill-current" />
                <p className="text-5xl font-bold">100%</p>
                <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mt-2">Parent Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-stone-900 py-24 sm:py-32 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[4rem] bg-gradient-to-br from-stone-800 to-stone-900 p-16 text-center shadow-2xl border border-white/5">
            <div className="mx-auto max-w-2xl">
              <div className="mb-10 flex justify-center">
                <div className="rounded-3xl bg-white/10 p-6 text-white backdrop-blur-xl border border-white/10">
                  <Mail className="h-10 w-10" />
                </div>
              </div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Stay in the Loop</h2>
              <p className="mb-12 text-lg text-stone-400">Subscribe to our newsletter for the latest school news, academic tips, and CBC updates.</p>
              
              {newsletterStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-4 text-center"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <p className="text-2xl font-bold text-white">Successfully Subscribed!</p>
                  <p className="mt-2 text-stone-400">Welcome to our community.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-8 py-5 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
                    required
                  />
                  <button
                    disabled={newsletterStatus === 'submitting'}
                    type="submit"
                    className="flex items-center justify-center space-x-3 rounded-full bg-white px-12 py-5 font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {newsletterStatus === 'submitting' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span>Subscribe</span>
                  </button>
                </form>
              )}
              {newsletterStatus === 'error' && (
                <p className="mt-6 text-sm font-bold text-red-400">Something went wrong. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 sm:py-40">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 text-5xl font-bold tracking-tight text-stone-900 sm:text-8xl">Ready to Start the Journey?</h2>
            <p className="mx-auto mb-16 max-w-2xl text-xl text-stone-600">
              Join the Viola Quality Academy family and give your child the education they deserve. Admissions are now open for all levels.
            </p>
            <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:space-x-8 sm:space-y-0">
              <Link
                to="/admissions"
                className="rounded-full bg-stone-900 px-12 py-6 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Apply Online Now
              </Link>
              <Link
                to="/contact"
                className="rounded-full border-2 border-stone-200 bg-white px-12 py-6 text-lg font-bold text-stone-900 transition-all hover:bg-stone-50"
              >
                Book a Campus Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Modals */}
      <AnimatePresence>
        {showTour && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTour(false)}
              className="absolute inset-0 bg-stone-900/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[3rem] bg-stone-900 shadow-2xl"
            >
              <div className="absolute top-6 right-6 z-10">
                <button onClick={() => setShowTour(false)} className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="aspect-video w-full bg-stone-800">
                {/* Placeholder for 360 Tour Embed */}
                <div className="flex h-full w-full flex-col items-center justify-center space-y-6 p-12 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white">
                    <Globe className="h-12 w-12 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Virtual 360° Tour Loading...</h3>
                  <p className="max-w-md text-stone-400">
                    We are preparing an immersive experience of our campus. In the meantime, you can explore our photo gallery or book a physical visit.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBooking(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-stone-900">Book a Visit</h2>
                <button onClick={() => setShowBooking(false)} className="rounded-full p-2 hover:bg-stone-50">
                  <X className="h-6 w-6 text-stone-400" />
                </button>
              </div>
              
              {bookingStatus === 'success' ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-stone-900">Booking Received!</h3>
                  <p className="text-stone-600">Our admissions team will contact you shortly to confirm your visit.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                      <input
                        required
                        type="text"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                      <input
                        required
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">Preferred Date</label>
                    <input
                      required
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <button
                    disabled={bookingStatus === 'submitting'}
                    type="submit"
                    className="flex w-full items-center justify-center space-x-3 rounded-full bg-stone-900 py-5 font-bold text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {bookingStatus === 'submitting' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calendar className="h-5 w-5" />}
                    <span>{bookingStatus === 'submitting' ? 'Booking...' : 'Confirm Booking'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
