import { motion } from 'motion/react';
import { BookOpen, Star, Users, Trophy, GraduationCap, Microscope, Palette, Music } from 'lucide-react';

export function Academics() {
  const levels = [
    {
      title: 'Pre-Primary (PP1 – PP2)',
      age: '4 – 5 Years',
      icon: Star,
      description: 'Focusing on foundational literacy, numeracy, and social-emotional development through play-based learning.',
      subjects: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor & Creative Activities', 'Religious Education']
    },
    {
      title: 'Lower Primary (Grade 1 – 3)',
      age: '6 – 8 Years',
      icon: BookOpen,
      description: 'Building strong foundations in core competencies and literacy in both English and Kiswahili.',
      subjects: ['Literacy', 'Kiswahili/KSL', 'English Language', 'Mathematical Activities', 'Environmental Activities', 'Hygiene & Nutrition', 'Religious Education', 'Movement & Creative Activities']
    },
    {
      title: 'Upper Primary (Grade 4 – 6)',
      age: '9 – 11 Years',
      icon: Users,
      description: 'Expanding knowledge and skills through practical projects and community-based learning.',
      subjects: ['English', 'Kiswahili/KSL', 'Mathematics', 'Science & Technology', 'Agriculture & Nutrition', 'Social Studies', 'Creative Arts', 'Physical & Health Education', 'Religious Education']
    },
    {
      title: 'Junior Secondary (Grade 7 – 9)',
      age: '12 – 14 Years',
      icon: Trophy,
      description: 'Career exploration and deep dives into STEM, humanities, and practical subjects to identify talents.',
      subjects: ['English', 'Kiswahili/KSL', 'Mathematics', 'Integrated Science', 'Health Education', 'Pre-Technical Studies', 'Social Studies', 'Business Studies', 'Agriculture', 'Life Skills', 'Sports & Creative Arts', 'Religious Education']
    }
  ];

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
            Academic Excellence
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Our CBC-aligned curriculum is designed to nurture every learner's potential through a holistic approach to education.
          </p>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {levels.map((level, i) => (
              <motion.div
                key={level.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col gap-12 lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-white">
                      <level.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-stone-900">{level.title}</h2>
                      <p className="font-medium text-stone-500">{level.age}</p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-stone-600">{level.description}</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {level.subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2 rounded-xl bg-stone-50 p-4 text-sm font-medium text-stone-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                        <span>{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="aspect-video overflow-hidden rounded-3xl shadow-xl">
                    <img
                      src={`https://picsum.photos/seed/level-${i}/800/450`}
                      alt={level.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-stone-900">Core Competencies</h2>
            <p className="mt-4 text-stone-600">Developing the 7 core competencies of the CBC framework.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Communication', icon: Music, desc: 'Expressing ideas clearly and effectively.' },
              { title: 'Collaboration', icon: Users, desc: 'Working together towards shared goals.' },
              { title: 'Critical Thinking', icon: Microscope, desc: 'Analyzing information and solving problems.' },
              { title: 'Creativity', icon: Palette, desc: 'Developing original ideas and solutions.' },
              { title: 'Self-Efficacy', icon: GraduationCap, desc: 'Believing in one\'s own ability to succeed.' },
              { title: 'Citizenship', icon: Users, desc: 'Understanding rights and responsibilities.' },
              { title: 'Digital Literacy', icon: Microscope, desc: 'Navigating the digital world safely.' },
              { title: 'Learning to Learn', icon: BookOpen, desc: 'Developing lifelong learning habits.' },
            ].map((comp) => (
              <div key={comp.title} className="rounded-3xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-800">
                  <comp.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-stone-900">{comp.title}</h3>
                <p className="text-sm text-stone-500">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
