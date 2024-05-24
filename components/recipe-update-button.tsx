'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { RecipeDialog } from '@/components/recipe-dialog';
import { toast } from '@/components/ui/use-toast';
import { recipeSchema } from '@/lib/validations/recipe';

type FormData = z.infer<typeof recipeSchema>;

interface RecipeUpdateButtonProps {
  recipeId: string;
}

export function RecipeUpdateButton({ recipeId }: RecipeUpdateButtonProps) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<FormData | undefined>(
    undefined,
  );

  useEffect(() => {
    async function fetchRecipe() {
      const response = await fetch(`/api/recipes/${recipeId}`);
      const data: FormData = await response.json();
      if (response.ok) {
        setInitialData(data);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  async function handleUpdateRecipe(data: FormData) {
    const response = await fetch(`/api/recipes/${recipeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your recipe was not updated. Please try again.',
        variant: 'destructive',
      });
    }

    setInitialData(data);
    router.refresh();
    return toast({
      description: 'Your recipe has been updated.',
    });
  }

  return (
    <RecipeDialog
      triggerText="Update recipe"
      dialogTitle="Update recipe"
      dialogDescription="Update the form below to edit the recipe."
      submitButtonText="Save"
      handleRecipe={handleUpdateRecipe}
      initialData={initialData}
    />
  );
}
