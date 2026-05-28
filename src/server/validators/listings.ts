import { z } from "zod";

export const listingSchema = z.object({
  id: z.string().uuid().optional(),
  ad_id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title is too long"),
  name: z.string().max(50, "Name is too long").nullable().optional(),
  age: z.coerce.number().min(18, "Age must be at least 18").max(99, "Age is too high").nullable().optional(),
  description: z.string().max(2000, "Description is too long").nullable().optional(),
  phone: z.string().max(20, "Phone number is too long").nullable().optional(),
  whatsapp: z.string().max(100, "WhatsApp URL is too long").nullable().optional(),
  is_vip: z.boolean().default(false),
  status: z.enum(["published", "archived", "draft"]).default("draft"),
  category_id: z.string().uuid("Invalid category selected"),
  city_id: z.string().uuid("Invalid location/city selected"),
  images: z.array(
    z.string().refine(
      (val) => val.startsWith("/") || /^https?:\/\//i.test(val),
      "Image must be an absolute URL or a path starting with /"
    )
  ).min(1, "At least 1 image is required").max(7, "Maximum 7 images allowed"),
  about_me: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  attention_to: z.array(z.string()).default([]),
  place_of_service: z.array(z.string()).default([]),
  ethnicity: z.string().max(50).nullable().optional(),
  nationality: z.string().max(50).nullable().optional(),
  breast: z.string().max(50).nullable().optional(),
  hair: z.string().max(50).nullable().optional(),
  body_type: z.string().max(50).nullable().optional(),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Title must be at least 2 characters").max(50),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(50).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  description: z.string().max(500).nullable().optional(),
  image_url: z.string().url("Invalid image URL").nullable().optional(),
  icon_name: z.string().max(50).default("Flame"),
  order_index: z.coerce.number().default(0),
});

export const citySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  slug: z.string().min(2, "Slug must be at least 2 characters").max(50).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  state_name: z.string().min(2, "State name must be at least 2 characters").max(50),
});

export const heroSettingsSchema = z.object({
  hero_title: z.string().min(5, "Title must be at least 5 characters").max(200),
  hero_subtitle: z.string().min(5, "Subtitle must be at least 5 characters").max(300),
  hero_image_url: z.string().url("Invalid background image URL").or(z.string().min(1)),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
