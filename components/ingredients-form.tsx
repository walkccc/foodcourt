'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { FullRecipe } from '@/types/prisma';

const FormSchema = z.object({
  ingredients: z.array(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

interface IngredientsFormProps {
  recipe: FullRecipe;
}

export function IngredientsForm({ recipe }: IngredientsFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ingredients: recipe.ingredients
        .filter((ingredient) => ingredient.bought)
        .map((ingredient) => ingredient.name),
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  function handleUncheckAll() {
    form.setValue('ingredients', []);
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    for (const ingredient of recipe.ingredients) {
      const response = await fetch(`/api/ingredients/${ingredient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ingredient.name,
          bought: data.ingredients.includes(ingredient.name),
        }),
      });

      if (!response.ok) {
        return toast({
          title: 'Something went wrong.',
          description: 'Your recipe was not updated. Please try again.',
          variant: 'destructive',
        });
      }
    }

    setIsSaving(false);

    toast({
      title: 'You submitted the following ingredients:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ingredients"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Ingredients</FormLabel>
              </div>
              {recipe.ingredients.map((ingredient) => (
                <FormField
                  key={ingredient.name}
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={ingredient.name}
                        className="ingredients-start flex flex-row space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(ingredient.name)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    ingredient.name,
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== ingredient.name,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {ingredient.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3">
          <Button type="button" variant="secondary" onClick={handleUncheckAll}>
            Uncheck all
          </Button>
          <Button type="submit">
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save status</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
