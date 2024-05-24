import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function canCurrentUserAccessToRecipe(recipeId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return false;
  }

  const count = await db.recipe.count({
    where: {
      id: recipeId,
      userId: currentUser.id,
    },
  });
  return count > 0;
}

export async function canCurrentUserAccessToIngredient(ingredientId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return false;
  }

  const ingredient = await db.ingredient.findUnique({
    where: { id: ingredientId },
    select: { recipeId: true },
  });
  const recipeId = ingredient?.recipeId;
  return recipeId && canCurrentUserAccessToRecipe(recipeId);
}
