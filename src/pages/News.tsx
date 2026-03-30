import { motion } from 'motion/react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

export function News() {
  const news = [
    {
      title: 'Viola Quality Academy Tops Regional CBC Exhibition',
      date: 'March 15, 2026',
      category: 'Achievement',
      excerpt: 'Our Grade 6 students showcased exceptional creativity and problem-solving skills at the annual regional CBC exhibition...',
      image: 'https://picsum.photos/seed/news1/800/500'
    },
    {
      title: 'New STEM Lab Commissioned for Junior Secondary',
      date: 'March 10, 2026',
      category: 'Infrastructure',
      excerpt: 'We are excited to announce the opening of our state-of-the-art STEM lab, equipped with the latest technology for our JSS students...',
      image: 'https://picsum.photos/seed/news2/800/500'
    },
    {
      title: 'Parent-Teacher Consultative Meeting Highlights',
      date: 'March 5, 2026',
      category: 'Community',
      excerpt: 'Thank you to all parents who attended our recent consultative meeting. We discussed the roadmap for the upcoming term...',
      image: 'https://picsum.photos/seed/news3/800/500'
    },
    {
      title: 'Environmental Club Launches "Green Campus" Initiative',
      date: 'February 28, 2026',
      category: 'Student Life',
      excerpt: 'Our students are leading the way in sustainability with a new initiative to make our campus more eco-friendly through recycling...',
      image: 'https://picsum.photos/seed/news4/800/500'
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
            News & Updates
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Stay informed about the latest events, achievements, and academic updates from Viola Quality Academy.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {news.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                      <Tag className="h-3 w-3" />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-stone-400">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <h2 className="mb-4 text-2xl font-bold leading-tight text-stone-900 group-hover:text-stone-600">
                    {item.title}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-stone-600">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center space-x-2 text-sm font-bold text-stone-900">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-16 flex justify-center space-x-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`h-10 w-10 rounded-full border border-stone-200 text-sm font-bold transition-colors ${
                  n === 1 ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
