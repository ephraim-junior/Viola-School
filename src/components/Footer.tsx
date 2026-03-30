import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 py-16 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* School Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-white">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">Viola Quality Academy</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Nurturing every learner's potential through modern CBC-aligned education. Excellence, creativity, and holistic development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="transition-colors hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="transition-colors hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="transition-colors hover:text-white"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/academics" className="transition-colors hover:text-white">Academics</Link></li>
              <li><Link to="/admissions" className="transition-colors hover:text-white">Admissions</Link></li>
              <li><Link to="/student-life" className="transition-colors hover:text-white">Student Life</Link></li>
              <li><Link to="/news" className="transition-colors hover:text-white">News & Updates</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" />
                <span>123 Academy Road, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 text-stone-500" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 shrink-0 text-stone-500" />
                <span>info@violaquality.ac.ke</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Newsletter</h3>
            <p className="mb-4 text-sm text-stone-400">Stay updated with our latest news and events.</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="rounded-lg bg-stone-800 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-stone-700"
              />
              <button className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-stone-900 transition-transform hover:scale-105 active:scale-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-stone-800 pt-8 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Viola Quality Academy. All rights reserved. Designed for CBC Excellence.</p>
        </div>
      </div>
    </footer>
  );
}
