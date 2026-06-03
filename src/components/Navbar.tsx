import React from 'react';
import { ShoppingBag, Plus, User, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  onAddClick: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddClick, onHomeClick }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0" 
          onClick={onHomeClick}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground transform transition-transform group-hover:rotate-12">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            SOUK<span className="text-primary">.DZ</span>
          </span>
        </div>

        <div className="flex-1 max-w-md hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search for phones, cars, furniture..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full shadow-lg shadow-primary/20 flex gap-2"
            onClick={onAddClick}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Sell Item</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                  <AvatarFallback>DZ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Ahmed Benali</p>
                  <p className="text-xs leading-none text-muted-foreground">ahmed.ben@gmail.dz</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>My Listings</DropdownMenuItem>
              <DropdownMenuItem>Saved Items</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
