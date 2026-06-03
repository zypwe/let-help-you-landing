import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListingInput, ListingSchema } from '@/lib/schema';
import { mockApi } from '@/lib/mock-api';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CATEGORIES, WILAYAS } from '@/lib/constants';
import { Loader2, PackagePlus, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ListingFormProps {
  onSuccess: () => void;
}

export const ListingForm: React.FC<ListingFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingInput>({
    resolver: zodResolver(ListingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: 'phones',
      wilaya_code: 16,
      images: [],
    },
  });

  const onSubmit = async (values: ListingInput) => {
    setIsSubmitting(true);
    try {
      // Logic from user: Write-Through caching enabled
      const result = await mockApi.createListing(values);
      if (result.success) {
        toast.success('Listing published successfully!');
        form.reset();
        onSuccess();
      }
    } catch (error) {
      toast.error('Performance breakdown: Failed to save listing');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = () => {
    const currentImages = form.getValues('images');
    if (currentImages.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    // Simulated image upload - just adding a placeholder
    const mockImageUrls = [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop'
    ];
    const randomImg = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    form.setValue('images', [...currentImages, randomImg]);
  };

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-none lg:border lg:shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="w-5 h-5 text-primary" />
          Create New Listing
        </CardTitle>
        <CardDescription>
          Your item will be cached for high-speed retrieval across Algeria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What are you selling?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wilaya_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wilaya</FormLabel>
                    <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wilaya" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WILAYAS.map(w => (
                          <SelectItem key={w.code} value={w.code.toString()}>{w.code} - {w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (DZD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your item in detail..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Item Photos</FormLabel>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {form.watch('images').map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg border overflow-hidden relative group">
                    <img src={url} alt="Item" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const imgs = [...form.getValues('images')];
                        imgs.splice(i, 1);
                        form.setValue('images', imgs);
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {form.watch('images').length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                  </button>
                )}
              </div>
              <FormDescription>
                Upload up to 5 clear photos of your product.
              </FormDescription>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing to Cache...
                </>
              ) : (
                'Post Listing'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
