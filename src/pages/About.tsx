import { motion } from 'motion/react';
import { History, Target, Heart, Lightbulb, Users, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold tracking-tight"
          >
            Our Story & Vision
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Founded on the principles of excellence and holistic growth, Viola Quality Academy is more than just a school—it's a community.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img
                  src="https://picsum.photos/seed/history/800/800"
                  alt="School History"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-stone-100 p-8 text-stone-900 shadow-xl">
                <History className="h-full w-full" />
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-stone-900">Our History</h2>
              <p className="text-lg leading-relaxed text-stone-600">
                Viola Quality Academy was established with a clear mandate: to provide high-quality, accessible education that prepares children for the challenges of the 21st century. Since our inception, we have grown from a small nursery to a full-fledged primary and junior secondary school.
              </p>
              <p className="text-lg leading-relaxed text-stone-600">
                Our journey has been marked by a commitment to the Competency Based Curriculum (CBC), ensuring that our students are not just exam-ready, but life-ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-12 shadow-sm">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-white">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="mb-6 text-3xl font-bold text-stone-900">Our Vision</h2>
              <p className="text-lg leading-relaxed text-stone-600">
                To be a leading center of excellence in CBC education, nurturing creative, responsible, and globally competitive learners.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-12 shadow-sm">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-white">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="mb-6 text-3xl font-bold text-stone-900">Our Mission</h2>
              <p className="text-lg leading-relaxed text-stone-600">
                To provide a safe, supportive, and stimulating environment where every child is empowered to achieve their full potential through skill-based learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-stone-900">Our Core Values</h2>
            <p className="mt-4 text-stone-600">The pillars that define our culture and character.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: 'Creativity', icon: Lightbulb, desc: 'Encouraging original thinking and innovation in every learner.' },
              { title: 'Responsibility', icon: ShieldCheck, desc: 'Fostering a sense of accountability for one\'s actions and environment.' },
              { title: 'Collaboration', icon: Users, desc: 'Promoting teamwork and mutual respect within our community.' },
              { title: 'Integrity', icon: ShieldCheck, desc: 'Upholding honesty and strong moral principles.' },
              { title: 'Excellence', icon: Target, desc: 'Striving for the highest standards in all academic and co-curricular pursuits.' },
              { title: 'Empathy', icon: Heart, desc: 'Cultivating kindness and understanding for others.' },
            ].map((value) => (
              <div key={value.title} className="rounded-3xl border border-stone-100 p-8 transition-shadow hover:shadow-md">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-800">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-stone-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-stone-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
