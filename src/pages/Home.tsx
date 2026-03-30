import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, Trophy, Star, CheckCircle2 } from 'lucide-react';

export function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/school/1920/1080"
            alt="School Campus"
            className="h-full w-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white backdrop-blur-md">
              Welcome to Viola Quality Academy
            </span>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Nurturing Every Learner's <br />
              <span className="italic text-stone-300">Potential</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-stone-300 md:text-xl">
              A modern CBC-aligned institution dedicated to developing creativity, critical thinking, and character in the next generation of leaders.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link
                to="/admissions"
                className="group flex items-center space-x-2 rounded-full bg-white px-8 py-4 font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CBC Approach Summary */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-stone-900">
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
                    <CheckCircle2 className="h-5 w-5 text-stone-800" />
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
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img
                  src="https://picsum.photos/seed/learning/800/800"
                  alt="Students Learning"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-stone-900 p-8 text-white shadow-xl">
                <p className="text-4xl font-bold">100%</p>
                <p className="text-sm text-stone-400">CBC Compliance</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-16 text-4xl font-bold tracking-tight text-stone-900">Our Academic Programs</h2>
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
                className="rounded-3xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-800">
                  <program.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-stone-900">{program.title}</h3>
                <p className="text-sm text-stone-600">{program.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-16 text-4xl font-bold tracking-tight text-stone-900">What Parents Say</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: 'Sarah Wanjiku', role: 'Parent, Grade 4', text: 'The transformation in my son\'s creativity since joining Viola is amazing. He loves the practical projects!' },
              { name: 'David Omari', role: 'Parent, PP2', text: 'A truly supportive environment. The teachers really care about every child\'s unique potential.' },
              { name: 'Grace Mutua', role: 'Parent, Grade 7', text: 'The Junior Secondary program is top-notch. My daughter is already exploring her interest in STEM.' },
            ].map((t, i) => (
              <div key={i} className="rounded-3xl border border-stone-100 p-8">
                <p className="mb-6 italic text-stone-600">"{t.text}"</p>
                <div>
                  <p className="font-bold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-4xl font-bold tracking-tight">Ready to Join Our Community?</h2>
          <p className="mx-auto mb-12 max-w-2xl text-stone-400">
            Admissions for the current academic year are open. Book a visit or apply online today to secure your child's future.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              to="/admissions"
              className="rounded-full bg-white px-10 py-4 font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95"
            >
              Apply Online
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/30 px-10 py-4 font-bold transition-all hover:bg-white/10"
            >
              Book a Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
