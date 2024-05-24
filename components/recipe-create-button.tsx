'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { toast } from '@/components/ui/use-toast';
import { recipeSchema } from '@/lib/validations/recipe';

import { RecipeDialog } from './recipe-dialog';

type FormData = z.infer<typeof recipeSchema>;

export function RecipeCreateButton() {
  const router = useRouter();

  async function handleCreateRecipe(data: FormData) {
    const response = await fetch(`/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your recipe was not created. Please try again.',
        variant: 'destructive',
      });
    }

    router.refresh();
    return toast({
      description: 'Your recipe has been created.',
    });
  }

  return (
    <RecipeDialog
      triggerText="New recipe"
      dialogTitle="New recipe"
      dialogDescription="Fill in the form below to create a new recipe."
      submitButtonText="Create"
      handleRecipe={handleCreateRecipe}
      initialData={undefined}
    />
  );
}
