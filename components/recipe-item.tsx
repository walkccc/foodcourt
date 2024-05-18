'use client';

import { Recipe } from '@prisma/client';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { RecipeOperations } from './recipe-operations';

type RecipeItemProps = {
  recipe: Recipe;
};

type CardProps = React.ComponentProps<typeof Card>;

export function RecipeItem({
  recipe,
  className,
  ...props
}: CardProps & RecipeItemProps) {
  return (
    <Card className={cn('mx-auto w-11/12', className)} {...props}>
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid">
        <div>
          {recipe.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="grid grid-cols-[25px_1fr] items-start py-1"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{ingredient}</p>
                {/* <p className="text-sm text-muted-foreground">{ingredient}</p> */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Uncheck all</Button>
        <RecipeOperations recipe={recipe} />
      </CardFooter>
    </Card>
  );
}
