import React, { useState, useEffect } from 'react';
import { Listing } from '@/lib/schema';
import { mockApi } from '@/lib/mock-api';
import { ListingCard } from './ListingCard';
import { CATEGORIES, WILAYAS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, SearchX, Database, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ListingFeedProps {
  onListingClick: (id: string) => void;
}

export const ListingFeed: React.FC<ListingFeedProps> = ({ onListingClick }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [wilaya, setWilaya] = useState<string>('all');
  const [source, setSource] = useState<'cache' | 'database' | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const cat = category === 'all' ? undefined : category;
      const wil = wilaya === 'all' ? undefined : parseInt(wilaya);
      const response = await mockApi.getListings(cat, wil);
      setListings(response.data);
      setSource(response.source);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, wilaya]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end bg-card p-6 rounded-xl border border-border/50 shadow-sm">
        <div className="w-full md:w-64 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wilaya</label>
          <Select value={wilaya} onValueChange={setWilaya}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All of Algeria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All 58 Wilayas</SelectItem>
              {WILAYAS.map((w) => (
                <SelectItem key={w.code} value={w.code.toString()}>{w.code} - {w.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="icon" onClick={fetchListings} disabled={loading} className="shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        {source && (
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-muted rounded-full border border-border/50">
            {source === 'cache' ? (
              <>
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-amber-600 uppercase">Redis Hit</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3 text-blue-500" />
                <span className="text-blue-600 uppercase">Postgres Pull</span>
              </>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              onClick={onListingClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-muted-foreground max-w-xs">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
          <Button variant="link" onClick={() => { setCategory('all'); setWilaya('all'); }}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};
