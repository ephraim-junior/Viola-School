import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bus, MapPin, Clock, Shield, Navigation, 
  Search, Info, AlertCircle, ChevronRight, 
  Map as MapIcon, Smartphone, Radio, Activity,
  ChevronDown, User, Phone, Star, CheckCircle2,
  AlertTriangle, XCircle
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { BusRoute, BusLocation, Driver } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const ROUTES: BusRoute[] = [
  {
    id: 'route-kiambu',
    name: 'Kiambu Route',
    description: 'Serving Kiambu Town and surrounding estates.',
    stops: [
      { name: 'Kiambu Town', time: '06:30 AM' },
      { name: 'Kirigiti', time: '06:45 AM' },
      { name: 'Edenville', time: '07:05 AM' },
      { name: 'Thindigua', time: '07:25 AM' }
    ],
    departureTime: '06:30 AM',
    estimatedArrival: '07:45 AM',
    status: 'On Time',
    driverId: 'driver-1'
  },
  {
    id: 'route-ruiru',
    name: 'Ruiru Route',
    description: 'Serving Ruiru Town, Kimbo, and Tatu City.',
    stops: [
      { name: 'Ruiru Town', time: '06:15 AM' },
      { name: 'Kimbo', time: '06:30 AM' },
      { name: 'Tatu City', time: '06:55 AM' },
      { name: 'Membley', time: '07:15 AM' }
    ],
    departureTime: '06:15 AM',
    estimatedArrival: '07:30 AM',
    status: 'On Time',
    driverId: 'driver-2'
  },
  {
    id: 'route-bypass',
    name: 'Eastern Bypass Route',
    description: 'Serving estates along the Eastern Bypass.',
    stops: [
      { name: 'Kamakis', time: '06:00 AM' },
      { name: 'Utawala', time: '06:25 AM' },
      { name: 'Ruai', time: '06:50 AM' },
      { name: 'Mihango', time: '07:20 AM' }
    ],
    departureTime: '06:00 AM',
    estimatedArrival: '07:50 AM',
    status: 'Delayed',
    driverId: 'driver-3'
  },
  {
    id: 'route-kimbo',
    name: 'Kimbo / Githurai Route',
    description: 'Serving Kimbo, Githurai 45, and Kahawa Sukari.',
    stops: [
      { name: 'Kimbo', time: '06:45 AM' },
      { name: 'Githurai 45', time: '07:05 AM' },
      { name: 'Kahawa Sukari', time: '07:25 AM' },
      { name: 'Zimmerman', time: '07:45 AM' }
    ],
    departureTime: '06:45 AM',
    estimatedArrival: '08:00 AM',
    status: 'On Time',
    driverId: 'driver-4'
  }
];

function StatusBadge({ status }: { status: BusRoute['status'] }) {
  const configs = {
    'On Time': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    'Delayed': { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    'Completed': { icon: XCircle, color: 'text-stone-400', bg: 'bg-stone-50', border: 'border-stone-100' }
  };
  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
      <Icon className="h-3 w-3" />
      <span>{status}</span>
    </div>
  );
}

function ExpandableRouteCard({ route, driver }: { route: BusRoute; driver?: Driver }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="group relative overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-100 transition-all hover:shadow-md"
    >
      <div className="p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-stone-100 p-2 text-stone-900">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">{route.name}</h3>
            </div>
            <p className="text-sm text-stone-500">{route.description}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={route.status} />
            <div className="mt-2 flex items-center justify-end space-x-2 text-xs text-stone-400">
              <Clock className="h-3 w-3" />
              <span>Dep: {route.departureTime}</span>
            </div>
          </div>
        </div>

        {/* Driver Info Preview */}
        {driver && (
          <div className="mt-6 flex items-center space-x-4 border-t border-stone-50 pt-6">
            <img 
              src={driver.photoUrl} 
              alt={driver.name}
              className="h-10 w-10 rounded-full object-cover border border-stone-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold text-stone-900">{driver.name}</p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="ml-1 text-[10px] font-bold">{driver.rating}</span>
                </div>
                <span className="text-[10px] text-stone-400">• License: {driver.licenseNumber}</span>
              </div>
            </div>
            <button className="ml-auto rounded-full bg-stone-50 p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-colors">
              <Phone className="h-4 w-4" />
            </button>
          </div>
        )}

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-stone-50 py-2 text-xs font-bold text-stone-500 hover:bg-stone-100 transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Stops & Schedule'}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 space-y-6">
                <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                  {route.stops.map((stop, i) => (
                    <div key={i} className="relative flex items-center justify-between">
                      <div className="absolute -left-5 h-2.5 w-2.5 rounded-full bg-stone-300 border-2 border-white" />
                      <span className="text-sm font-medium text-stone-700">{stop.name}</span>
                      <div className="flex items-center space-x-2 text-xs text-stone-400">
                        <Clock className="h-3 w-3" />
                        <span>{stop.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Transportation() {
  const [isTracking, setIsTracking] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trackingData, setTrackingData] = useState({
    name: '',
    grade: '',
    admissionNo: '',
    plateNumber: ''
  });
  const [busLocation, setBusLocation] = useState<BusLocation>({
    lat: -1.2921,
    lng: 36.8219,
    lastUpdated: new Date(),
    speed: 45,
    plateNumber: 'KCD 123X'
  });

  useEffect(() => {
    const unsubDrivers = onSnapshot(
      collection(db, 'drivers'),
      (snapshot) => {
        setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)));
      },
      (err) => {
        // Only log if it's not a permission error for guests, 
        // though we already check for user existence above.
        if (err.code !== 'permission-denied') {
          handleFirestoreError(err, OperationType.GET, 'drivers');
        }
      }
    );
    return () => unsubDrivers();
  }, []);

  // Simulate bus movement
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setBusLocation(prev => ({
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.002,
          lng: prev.lng + (Math.random() - 0.5) * 0.002,
          speed: Math.floor(Math.random() * 20) + 30,
          lastUpdated: new Date()
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 py-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#444,transparent_70%)]" />
        </div>
        <div className="container relative mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="mb-6 flex items-center space-x-3">
              <div className="rounded-full bg-stone-800 p-2">
                <Bus className="h-5 w-5 text-stone-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">School Services</span>
            </div>
            <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-7xl">
              Safe & Reliable <span className="italic text-stone-400">Transportation</span>
            </h1>
            <p className="text-lg text-stone-400">
              Our school bus fleet covers major Nairobi routes including Kiambu, Ruiru, Bypass, and Kimbo, 
              ensuring every student arrives safely and on time.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          
          {/* Routes Section */}
          <section className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-900">Local Routes</h2>
              <p className="mt-2 text-stone-500">Comprehensive coverage across Nairobi's key residential areas.</p>
            </div>

            <div className="grid gap-6">
              {ROUTES.map((route) => (
                <ExpandableRouteCard 
                  key={route.id} 
                  route={route} 
                  driver={drivers.find(d => d.id === route.driverId)} 
                />
              ))}
            </div>
          </section>

          {/* Tracker Section */}
          <section className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-900">Live Bus Tracker</h2>
              <p className="mt-2 text-stone-500">Real-time GPS monitoring for peace of mind.</p>
            </div>

            <div className="rounded-3xl bg-stone-900 p-1 text-white shadow-2xl">
              <div className="rounded-[22px] bg-stone-800 p-8">
                {!isTracking ? (
                  <form onSubmit={handleTrack} className="space-y-6">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-700 text-stone-400">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">Secure Access</h3>
                        <p className="text-xs text-stone-500">Enter student details to track their assigned bus.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Student Name</label>
                        <input 
                          required
                          type="text"
                          placeholder="Full Name"
                          className="w-full rounded-xl bg-stone-700/50 border border-stone-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                          value={trackingData.name}
                          onChange={e => setTrackingData({...trackingData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Class / Grade</label>
                        <input 
                          required
                          type="text"
                          placeholder="e.g. Grade 4"
                          className="w-full rounded-xl bg-stone-700/50 border border-stone-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                          value={trackingData.grade}
                          onChange={e => setTrackingData({...trackingData, grade: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Admission No.</label>
                        <input 
                          required
                          type="text"
                          placeholder="ADM-000"
                          className="w-full rounded-xl bg-stone-700/50 border border-stone-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                          value={trackingData.admissionNo}
                          onChange={e => setTrackingData({...trackingData, admissionNo: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Bus Plate No.</label>
                        <input 
                          required
                          type="text"
                          placeholder="KCD 123X"
                          className="w-full rounded-xl bg-stone-700/50 border border-stone-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
                          value={trackingData.plateNumber}
                          onChange={e => setTrackingData({...trackingData, plateNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full rounded-full bg-white py-4 font-bold text-stone-900 transition-all hover:bg-stone-200 active:scale-95"
                    >
                      Initialize Tracking
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-500 animate-pulse">
                          <Radio className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold">Live Tracking Active</h3>
                          <p className="text-xs text-stone-500">Bus: {trackingData.plateNumber} • Student: {trackingData.name}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsTracking(false)}
                        className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-white"
                      >
                        Stop
                      </button>
                    </div>

                    {/* Enhanced Map View */}
                    <div className="relative h-80 overflow-hidden rounded-2xl bg-stone-700 border border-stone-600">
                      <div className="absolute inset-0 opacity-30">
                        <div className="h-full w-full bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:40px_40px]" />
                      </div>
                      
                      {/* Simulated Path */}
                      <svg className="absolute inset-0 h-full w-full opacity-20">
                        <path 
                          d="M 50 50 L 150 100 L 250 80 L 350 150" 
                          fill="none" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeDasharray="4 4"
                        />
                      </svg>

                      {/* Moving Bus Icon */}
                      <motion.div 
                        animate={{ 
                          x: (busLocation.lng + 1.29) * 20000 + 100, 
                          y: (busLocation.lat + 36.82) * 20000 + 100 
                        }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="absolute flex flex-col items-center"
                      >
                        <div className="relative">
                          <div className="absolute -inset-4 rounded-full bg-green-500/20 animate-ping" />
                          <div className="relative rounded-full bg-green-500 p-2 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                            <Navigation className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="mt-2 rounded bg-stone-900 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-white border border-stone-700">
                          {trackingData.plateNumber}
                        </div>
                      </motion.div>

                      {/* Map Controls Overlay */}
                      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                        <div className="rounded-lg bg-stone-800/80 p-2 backdrop-blur-sm border border-stone-600">
                          <Smartphone className="h-4 w-4 text-stone-400" />
                        </div>
                        <div className="rounded-lg bg-stone-800/80 p-2 backdrop-blur-sm border border-stone-600">
                          <MapIcon className="h-4 w-4 text-stone-400" />
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Data */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-2xl bg-stone-700/30 p-4 border border-stone-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="h-3 w-3 text-stone-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Speed</span>
                        </div>
                        <p className="text-xl font-bold">{busLocation.speed} <span className="text-[10px] text-stone-500">km/h</span></p>
                      </div>
                      <div className="rounded-2xl bg-stone-700/30 p-4 border border-stone-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-3 w-3 text-stone-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Lat/Lng</span>
                        </div>
                        <p className="text-[10px] font-mono text-stone-300">{busLocation.lat.toFixed(4)}, {busLocation.lng.toFixed(4)}</p>
                      </div>
                      <div className="rounded-2xl bg-stone-700/30 p-4 border border-stone-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-3 w-3 text-stone-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Updated</span>
                        </div>
                        <p className="text-[10px] text-stone-300">{busLocation.lastUpdated.toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 rounded-2xl bg-green-500/10 p-4 border border-green-500/20">
                      <AlertCircle className="h-4 w-4 text-green-500" />
                      <p className="text-xs text-green-500 font-medium">Bus is currently on route. Estimated arrival at next stop in 8 minutes.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Safety Section */}
        <section className="mt-32 rounded-[48px] bg-stone-100 p-12 md:p-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-4xl font-bold text-stone-900 md:text-5xl">Safety is our <span className="italic">Priority</span></h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-bold">Vetted Drivers</h3>
                <p className="text-sm text-stone-500">All our drivers undergo rigorous background checks and professional training.</p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                  <Smartphone className="h-8 w-8" />
                </div>
                <h3 className="font-bold">GPS Tracking</h3>
                <p className="text-sm text-stone-500">Every vehicle is equipped with real-time GPS tracking accessible to parents.</p>
              </div>
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-900 shadow-sm">
                  <Navigation className="h-8 w-8" />
                </div>
                <h3 className="font-bold">Optimized Routes</h3>
                <p className="text-sm text-stone-500">We use advanced routing software to minimize travel time and ensure punctuality.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
