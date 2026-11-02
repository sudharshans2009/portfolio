import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
  body: z.string().trim().min(10, "Please write a little more.").max(5000),
  website: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
