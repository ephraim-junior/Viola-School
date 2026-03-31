import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Tag, Loader2, Newspaper } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  date: any;
  image: string;
  category: string;
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = 'news';
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, path), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NewsItem[];
        setNews(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

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
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-stone-300" />
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {news.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image || `https://picsum.photos/seed/${item.id}/800/500`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                        <Tag className="h-3 w-3" />
                        <span>{item.category || 'General'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-stone-400">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date?.toDate ? item.date.toDate().toLocaleDateString() : new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold leading-tight text-stone-900 group-hover:text-stone-600">
                      {item.title}
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed text-stone-600 line-clamp-3">
                      {item.excerpt || item.content}
                    </p>
                    <div className="flex items-center space-x-2 text-sm font-bold text-stone-900">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Newspaper className="h-16 w-16 text-stone-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-900">No news yet</h3>
              <p className="text-stone-500 mt-2">Check back soon for the latest updates from our school.</p>
            </div>
          )}

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
