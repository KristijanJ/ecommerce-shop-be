import * as z from "zod";

export const ProductSchema = z.object({
  title: z.string({ error: "Title is required." }).min(1, "Title cannot be empty."),
  price: z.number({ error: "Price is required." }).positive("Price must be a positive number."),
  description: z.string({ error: "Description is required." }).min(1, "Description cannot be empty."),
  image: z.string({ error: "Image URL is required." }).url("Image must be a valid URL."),
  ratingRate: z.number().min(0, "Rating must be at least 0.").max(5, "Rating cannot exceed 5.").default(0),
  ratingCount: z.number().int("Rating count must be an integer.").min(0, "Rating count cannot be negative.").default(0),
  stock: z.number().int("Stock must be an integer.").min(0, "Stock cannot be negative.").default(0),
  productCategoryId: z
    .number({ error: "Product category is required." })
    .int("Category ID must be an integer.")
    .positive("Category ID must be positive."),
  ownerId: z
    .number({ error: "Owner ID is required." })
    .int("Owner ID must be an integer.")
    .positive("Owner ID must be positive."),
});

export interface IProduct extends z.infer<typeof ProductSchema> {
  id?: number;
}

export interface IProductDto {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  ratingRate: number;
  ratingCount: number;
  stock: number;
  category: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}
