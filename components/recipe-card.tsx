import { IngredientsForm } from '@/components/ingredients-form';
import { RecipeOperations } from '@/components/recipe-operations';
import { RecipeUpdateButton } from '@/components/recipe-update-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FullRecipe } from '@/types/prisma';

type RecipeCardProps = {
  recipe: FullRecipe;
};

type CardProps = React.ComponentProps<typeof Card>;

export async function RecipeCard({
  recipe,
  className,
  ...props
}: CardProps & RecipeCardProps) {
  return (
    <Card
      className={cn('mx-auto flex w-full flex-col justify-between', className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{recipe.name}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid">
        <IngredientsForm recipe={recipe} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <RecipeOperations recipe={recipe} />
        <RecipeUpdateButton recipeId={recipe.id} />
      </CardFooter>
    </Card>
  );
}
