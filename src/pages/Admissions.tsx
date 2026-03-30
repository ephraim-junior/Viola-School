import { useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function Admissions() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'admissions'), {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ studentName: '', parentName: '', email: '', phone: '', grade: '', message: '' });
    } catch (error) {
      console.error('Admission error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-stone-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold tracking-tight"
          >
            Join Our Community
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Admissions are open for PP1 to Grade 9. Start your child's journey towards excellence today.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Info */}
            <div className="space-y-12">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-stone-900">Admission Requirements</h2>
                <ul className="space-y-4">
                  {[
                    'Copy of Birth Certificate',
                    'Recent Passport Size Photos (2)',
                    'Previous School Progress Reports (if applicable)',
                    'Immunization Record (for Pre-Primary)',
                    'Completed Application Form'
                  ].map((req) => (
                    <li key={req} className="flex items-center space-x-3 text-stone-700">
                      <CheckCircle2 className="h-5 w-5 text-stone-800" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-stone-50 p-8">
                <h3 className="mb-4 font-bold text-stone-900">Fee Structure</h3>
                <p className="mb-6 text-sm text-stone-600">
                  Our fee structure is competitive and transparent. Download the full prospectus for detailed information on tuition, activities, and transport.
                </p>
                <button className="rounded-full bg-stone-900 px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
                  Download Prospectus
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-stone-100">
              <h2 className="mb-8 text-2xl font-bold text-stone-900">Online Application</h2>
              
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-stone-900">Application Received!</h3>
                  <p className="text-stone-600">
                    Thank you for applying. Our admissions team will contact you within 48 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-sm font-bold text-stone-900 underline underline-offset-4"
                  >
                    Submit another application
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Student Name</label>
                      <input
                        required
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Parent/Guardian Name</label>
                      <input
                        required
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        placeholder="+254 ..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Applying For Grade</label>
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    >
                      <option value="">Select Grade</option>
                      <option value="PP1">PP1</option>
                      <option value="PP2">PP2</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7 (JSS)">Grade 7 (JSS)</option>
                      <option value="Grade 8 (JSS)">Grade 8 (JSS)</option>
                      <option value="Grade 9 (JSS)">Grade 9 (JSS)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Additional Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                      placeholder="Any specific questions or information?"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center space-x-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Something went wrong. Please try again.</span>
                    </div>
                  )}

                  <button
                    disabled={status === 'submitting'}
                    type="submit"
                    className="flex w-full items-center justify-center space-x-2 rounded-full bg-stone-900 py-4 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
