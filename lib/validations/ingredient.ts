import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1).max(255),
  bought: z.boolean(),
});
