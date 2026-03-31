import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Filter, ChevronLeft, ChevronRight, Plus, Loader2, Image as ImageIcon, Send } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface GalleryImage {
  id: string;
  url: string;
  category: 'Academics' | 'Sports' | 'Events' | 'Facilities';
  title: string;
  createdAt?: Timestamp;
}

export function Gallery() {
  const [user] = useAuthState(auth);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload Form State
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academics' | 'Sports' | 'Events' | 'Facilities'>('Academics');
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = user?.email === 'kamauwanyiri54@gmail.com';
  const categories = ['All', 'Academics', 'Sports', 'Events', 'Facilities'];

  useEffect(() => {
    const fetchData = async () => {
      const path = 'gallery';
      try {
        const q = query(collection(db, path), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryImage[];
        setImages(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'gallery');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl || !newTitle) return;

    setIsUploading(true);
    const path = 'gallery';
    try {
      await addDoc(collection(db, path), {
        url: newImageUrl,
        title: newTitle,
        category: newCategory,
        createdAt: serverTimestamp()
      });
      setNewImageUrl('');
      setNewTitle('');
      setShowUploadForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
    }
  };

  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  return (
    <div className="pt-24 min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-stone-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold tracking-tight"
          >
            Photo Gallery
          </motion.h1>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Explore moments of excellence, creativity, and joy at Viola Quality Academy.
          </p>
          
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="mt-8 flex items-center space-x-2 mx-auto rounded-full bg-white px-8 py-3 text-sm font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95"
            >
              {showUploadForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showUploadForm ? 'Close Upload Form' : 'Upload New Image'}</span>
            </motion.button>
          )}
        </div>
      </section>

      {/* Admin Upload Form */}
      <AnimatePresence>
        {showUploadForm && isAdmin && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-b border-stone-200"
          >
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-stone-50 p-8 shadow-inner">
                <div className="mb-6 flex items-center space-x-3">
                  <ImageIcon className="h-6 w-6 text-stone-900" />
                  <h2 className="text-2xl font-bold text-stone-900">Add to Gallery</h2>
                </div>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-2">Image URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-2">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                        required
                      >
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-2">Image Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Science Fair 2024"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                      required
                    />
                  </div>
                  <button
                    disabled={isUploading}
                    type="submit"
                    className="flex w-full items-center justify-center space-x-2 rounded-full bg-stone-900 py-4 font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span>{isUploading ? 'Uploading...' : 'Publish to Gallery'}</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Filter Bar */}
      <section className="sticky top-20 z-40 bg-white/80 py-6 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2 text-stone-500 mr-4">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-widest">Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-stone-300" />
            </div>
          ) : filteredImages.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode='popLayout'>
                {filteredImages.map((img, index) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-stone-200"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Maximize2 className="h-8 w-8 text-white mx-auto mb-2" />
                        <p className="text-white font-bold text-sm">{img.title}</p>
                        <p className="text-white/70 text-xs uppercase tracking-widest mt-1">{img.category}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 text-stone-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-900">No images found</h3>
              <p className="text-stone-500 mt-2">Try selecting a different category or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-[110] text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="h-10 w-10" />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-6 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              className="absolute right-6 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: -20 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-white/60 uppercase tracking-widest text-sm mt-1">{selectedImage.category}</p>
                <p className="text-white/40 text-xs mt-4">
                  {selectedImageIndex! + 1} of {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
