import { z } from 'zod';

export const CategoryEnum = z.enum(['phones', 'clothing', 'home_appliances', 'furniture', 'accessories']);
export type Category = z.infer<typeof CategoryEnum>;

export const VariantColorSchema = z.object({
  name: z.string(),
  hex: z.string(),
  image: z.string().url(),
});

// Fields the user provides via the form
export const ListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  category: CategoryEnum,
  wilaya_code: z.number().min(1).max(58, "Invalid Wilaya code"),
  images: z.array(z.string().url("Invalid image URL")).max(5, "Maximum 5 images"),
});

export type ListingInput = z.infer<typeof ListingSchema>;

// Full listing object stored and displayed
export interface Listing extends ListingInput {
  id: string;
  user_id: string;
  created_at: string;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  colors?: {
    name: string;
    hex: string;
    image: string;
  }[];
  sizes?: string[];
}
