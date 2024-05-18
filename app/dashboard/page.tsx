import type { Recipe, User } from '@prisma/client';
import { redirect } from 'next/navigation';

import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { RecipeCreateButton } from '@/components/recipe-create-button';
import { RecipeItem } from '@/components/recipe-item';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    redirect('/login');
  }

  const recipes = await getAllRecipesForAuthor(currentUser.id);

  return (
    <DashboardShell>
      <DashboardHeader heading="Recipes" text="Create and manage recipes.">
        <RecipeCreateButton />
      </DashboardHeader>
      {recipes.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="recipe" />
          <EmptyPlaceholder.Title>No recipes created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any recipes yet. Start creating content.
          </EmptyPlaceholder.Description>
          <RecipeCreateButton />
        </EmptyPlaceholder>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeItem key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

async function getAllRecipesForAuthor(userId: User['id']) {
  return await db.recipe.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}
