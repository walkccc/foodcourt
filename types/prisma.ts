import { Ingredient, Recipe } from '@prisma/client';

export type FullRecipe = Recipe & {
  ingredients: Ingredient[];
};
