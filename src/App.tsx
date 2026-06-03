import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ListingFeed } from './components/ListingFeed';
import { ListingForm } from './components/ListingForm';
import { AliProductScreen } from './components/AliProductScreen';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutGrid, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState<'feed' | 'create' | 'product'>('feed');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const handleListingClick = (id: string) => {
    setSelectedListingId(id);
    setView('product');
  };

  const handleBackToFeed = () => {
    setView('feed');
    setSelectedListingId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 selection:text-primary">
      <Navbar 
        onAddClick={() => setView('create')} 
        onHomeClick={handleBackToFeed} 
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {view === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-orange-600 pl-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter uppercase italic">Souk<span className="text-orange-600">.dz</span></h1>
                  <p className="text-muted-foreground mt-1 text-sm font-medium">
                    Algeria's high-speed marketplace. 58 Wilayas. Instant delivery.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-tighter">Network Status: Optimized</span>
                </div>
              </div>

              <ListingFeed onListingClick={handleListingClick} />
            </motion.div>
          )}

          {view === 'product' && selectedListingId && (
            <motion.div
              key="product"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AliProductScreen 
                listingId={selectedListingId} 
                onBack={handleBackToFeed} 
              />
            </motion.div>
          )}

          {view === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="max-w-2xl mx-auto">
                <Button 
                  variant="ghost" 
                  className="mb-4 hover:bg-muted"
                  onClick={handleBackToFeed}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Feed
                </Button>
              </div>
              <ListingForm onSuccess={handleBackToFeed} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="font-black tracking-tighter italic">SOUK.DZ</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto md:mx-0 font-medium leading-relaxed">
                Powered by a high-performance Redis cache and Postgres storage. 
                Validated for all 58 Algerian Wilayas.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900">Platform</h4>
              <ul className="text-xs space-y-2 text-slate-500 font-medium">
                <li className="hover:text-orange-600 cursor-pointer transition-colors">How it works</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Safety center</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900">Support</h4>
              <ul className="text-xs space-y-2 text-slate-500 font-medium">
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Wilaya Coverage</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SOUK.DZ - Precision Marketplace Infrastructure.
          </div>
        </div>
      </footer>

      <Toaster position="top-right" closeButton richColors />
    </div>
  );
}

export default App;
