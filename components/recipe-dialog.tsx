'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Ingredient } from '@prisma/client';
import { SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { recipeSchema } from '@/lib/validations/recipe';

type FormData = z.infer<typeof recipeSchema>;

interface RecipeDialogProps {
  triggerText: string;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
  handleRecipe: (data: FormData) => Promise<any>;
  initialData: FormData | undefined;
}

export function RecipeDialog({
  triggerText,
  dialogTitle,
  dialogDescription,
  submitButtonText,
  handleRecipe,
  initialData,
}: RecipeDialogProps) {
  const { register, handleSubmit, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(recipeSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setIngredients(initialData.ingredients ?? []);
    }
  }, [initialData, reset]);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setIngredient(e.target.value);
  };

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      const newIngredients = [...ingredients, ingredient.trim()];
      setIngredients(newIngredients);
      setValue('ingredients', newIngredients); // Update the form state
      setIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    setValue('ingredients', newIngredients); // Update the form state
  };

  async function onSubmit(data: z.infer<typeof recipeSchema>) {
    setIsSaving(true);
    await handleRecipe(data);
    setIsSaving(false);
    setIsOpen(false);
    setIngredients(initialData?.ingredients || []);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register('name')}
                placeholder="湖北麻辣牛油火鍋"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-3"
                placeholder="好吃的火鍋"
                {...register('description')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ingredients" className="text-right">
                Ingredients
              </Label>
              <Input
                id="ingredients"
                value={ingredient}
                className="col-span-2"
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
                placeholder="Add an ingredient"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddIngredient}
              >
                Add
              </Button>
              <div className="col-span-4">
                {ingredients.map((ingredient, index) => (
                  <p key={index} className="mb-2 flex items-center">
                    <span className="mr-2 cursor-default rounded bg-foreground/10 px-3 py-1 hover:bg-gray-300">
                      {ingredient}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-500"
                      aria-label={`Remove ${ingredient}`}
                    >
                      <Icons.close className="h-4 w-4" />
                    </button>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>{submitButtonText}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
