import { motion } from 'motion/react';
import { Palette, Music, Trophy, Users, Camera, Microscope, Globe, Heart } from 'lucide-react';

export function StudentLife() {
  const activities = [
    { title: 'Sports & Athletics', icon: Trophy, desc: 'Football, swimming, athletics, and indoor games to foster teamwork and physical health.' },
    { title: 'Music & Creative Arts', icon: Music, desc: 'Choir, instrumental lessons, and visual arts to nurture creative expression.' },
    { title: 'Drama & Public Speaking', icon: Palette, desc: 'Developing confidence and communication skills through performance.' },
    { title: 'STEM & Robotics', icon: Microscope, desc: 'Hands-on science projects and introduction to coding and robotics.' },
    { title: 'Environmental Club', icon: Globe, desc: 'Learning about sustainability through school gardening and conservation projects.' },
    { title: 'Scouts & Girl Guides', icon: Users, desc: 'Building character, leadership, and community service values.' },
    { title: 'Photography Club', icon: Camera, desc: 'Capturing school life and learning the basics of visual storytelling.' },
    { title: 'Charity & Community', icon: Heart, desc: 'Engaging in community outreach and helping those in need.' },
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
            Student Life
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Beyond academics, we provide a vibrant environment where students can explore their talents and build lifelong friendships.
          </p>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-800 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                  <activity.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-stone-900">{activity.title}</h3>
                <p className="text-sm leading-relaxed text-stone-600">{activity.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-stone-900">Life at Viola</h2>
            <p className="mt-4 text-stone-600">Capturing moments of learning, laughter, and growth.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i % 3 === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img
                  src={`https://picsum.photos/seed/student-life-${i}/800/800`}
                  alt={`School Moment ${i}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CBC Portfolios */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-stone-900">CBC Portfolios & Projects</h2>
              <p className="mb-8 text-lg leading-relaxed text-stone-600">
                In line with CBC requirements, every student maintains a comprehensive portfolio of their work. These projects showcase their practical application of knowledge, creativity, and progress over time.
              </p>
              <div className="space-y-4">
                {[
                  'Termly practical projects across all subjects',
                  'Digital and physical portfolio maintenance',
                  'Exhibition days for parents and community',
                  'Continuous assessment and feedback'
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3 text-stone-700">
                    <div className="h-2 w-2 rounded-full bg-stone-900" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://picsum.photos/seed/projects/800/800"
                alt="Student Projects"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
