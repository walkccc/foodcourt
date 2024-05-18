import { z } from 'zod';

export const recipeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
});
