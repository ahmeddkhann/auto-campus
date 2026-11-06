import { z } from "zod";

export const siteSettingsSchema = z.object({
  school_name: z.string().min(1, "School name is required").max(200),
  tagline: z.string().max(300).optional().or(z.literal("")),
  logo_url: z.string().url().optional().or(z.literal("")),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  primary_color: z.string().min(1),
  secondary_color: z.string().min(1),
  accent_color: z.string().min(1),
  about_text: z.string().max(5000).optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
});
