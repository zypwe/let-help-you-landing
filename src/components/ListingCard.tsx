import React from 'react';
import { Listing } from '@/lib/schema';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star } from 'lucide-react';
import { WILAYAS } from '@/lib/constants';

interface ListingCardProps {
  listing: Listing;
  onClick: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const wilayaName = WILAYAS.find(w => w.code === listing.wilaya_code)?.name || 'Unknown';
  const date = new Date(listing.created_at).toLocaleDateString('en-DZ', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <Card 
      className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer"
      onClick={() => onClick(listing.id)}
    >
      <div className="aspect-[1/1] overflow-hidden bg-muted relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-[10px] uppercase">
            {listing.category}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
          <Star size={10} className="fill-amber-500 text-amber-500" />
          {listing.rating}
        </div>
      </div>
      <CardHeader className="p-3 pb-1">
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {wilayaName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
        </div>
      </CardHeader>
      <CardFooter className="p-3 pt-2 flex justify-between items-end">
        <div className="flex flex-col">
          {listing.oldPrice && (
            <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
              {listing.oldPrice.toLocaleString()} DA
            </span>
          )}
          <div className="text-base font-black text-orange-600">
            {listing.price.toLocaleString()} <span className="text-[10px] font-normal uppercase">DA</span>
          </div>
        </div>
        <div className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">
          {listing.soldCount} Sold
        </div>
      </CardFooter>
    </Card>
  );
};
