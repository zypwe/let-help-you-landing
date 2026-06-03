import React, { useState, useEffect } from 'react';
import { Listing } from '@/lib/schema';
import { mockApi } from '@/lib/mock-api';
import { 
  ShoppingCart, 
  Flame, 
  Star, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Share2,
  ChevronLeft,
  Database,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface AliProductScreenProps {
  listingId: string;
  onBack: () => void;
}

export const AliProductScreen: React.FC<AliProductScreenProps> = ({ listingId, onBack }) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [source, setSource] = useState<'cache' | 'database' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await mockApi.getListingById(listingId);
        setListing(response.data);
        setSource(response.source);
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (error) {
        toast.error('Failed to load product details');
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [listingId]);

  const formatCurrency = (val: number) => `${val.toLocaleString('fr-FR')} DA`;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const currentHeroImage = listing.colors?.[selectedColor]?.image || listing.images[0];

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Header/Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to listings
        </Button>
        
        {source && (
          <div className="flex items-center gap-2 text-[10px] font-bold px-3 py-1 bg-background border rounded-full shadow-sm">
            {source === 'cache' ? (
              <>
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-amber-600 uppercase tracking-tighter">Cached (Redis)</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3 text-blue-500" />
                <span className="text-blue-600 uppercase tracking-tighter">Live (Postgres)</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-4 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Visual Hero Image Container */}
        <div className="relative group">
          <div className="aspect-[1/1] overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
            <img 
              src={currentHeroImage} 
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          {/* Top Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-3">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all border border-slate-100"
            >
              <Heart size={20} className={isLiked ? "text-rose-500 fill-rose-500" : "text-slate-600"} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all border border-slate-100">
              <Share2 size={18} className="text-slate-600" />
            </button>
          </div>

          {/* Tag */}
          <div className="absolute bottom-4 left-4 bg-orange-600 text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-lg">
            <Flame size={14} className="fill-white" />
            <span className="text-xs font-bold uppercase tracking-wide">Top Seller</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          {/* Pricing Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-orange-600 tracking-tight">
                {formatCurrency(listing.price)}
              </span>
              {listing.oldPrice && (
                <span className="text-lg text-slate-400 line-through decoration-slate-300">
                  {formatCurrency(listing.oldPrice)}
                </span>
              )}
              {listing.oldPrice && (
                <Badge className="bg-orange-50 text-orange-600 border-none font-bold">
                  -{Math.round((1 - listing.price / listing.oldPrice) * 100)}%
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md">
                <Star size={14} className="fill-amber-600" />
                <span>{listing.rating}</span>
              </div>
              <span className="text-slate-500">{listing.reviewsCount} reviews</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-slate-700">{listing.soldCount} sold</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-6 leading-tight">
            {listing.title}
          </h1>

          {/* Variants */}
          <div className="mt-8 space-y-6">
            {listing.colors && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Color: <span className="font-medium text-slate-500 ml-2">{listing.colors[selectedColor].name}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {listing.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                        selectedColor === index ? 'border-orange-600 scale-110 shadow-md' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div 
                        className="w-full h-full rounded-full" 
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {listing.sizes && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Storage: <span className="font-medium text-slate-500 ml-2">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {listing.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        selectedSize === size 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-10 grid grid-cols-1 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-3">
              <Truck size={20} className="text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900">Fast Delivery Available</p>
                <p className="text-xs text-slate-500 leading-relaxed">Home delivery across all 58 Wilayas (Yalidine/Zeralda)</p>
              </div>
            </div>
            <div className="w-full h-px bg-slate-200" />
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900">Payment on Delivery</p>
                <p className="text-xs text-slate-500 leading-relaxed">Inspect your package before paying. Secure & reliable.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-10 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 h-14 rounded-2xl border-2 text-lg font-bold hover:bg-slate-50 transition-colors">
              <ShoppingCart className="mr-2 w-5 h-5" />
              Add to Cart
            </Button>
            <Button className="flex-[1.5] h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold shadow-xl shadow-orange-600/20 transition-all active:scale-[0.98]">
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>
    </div>
  );
};
