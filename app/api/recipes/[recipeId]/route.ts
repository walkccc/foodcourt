import * as z from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { recipeSchema } from '@/lib/validations/recipe';

const routeContextSchema = z.object({
  params: z.object({
    recipeId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the current user has access to this recipe.
    if (!(await canCurrentUserAccessToRecipe(params.recipeId))) {
      return new Response(null, { status: 403 });
    }

    const recipe = await db.recipe.findUnique({
      where: {
        id: params.recipeId,
      },
    });

    console.log(recipe);

    return new Response(
      JSON.stringify({
        name: recipe?.name,
        description: recipe?.description,
        ingredients: recipe?.ingredients,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the current user has access to this recipe.
    if (!(await canCurrentUserAccessToRecipe(params.recipeId))) {
      return new Response(null, { status: 403 });
    }

    // Delete the recipe.
    await db.recipe.delete({
      where: {
        id: params.recipeId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the current user has access to this recipe.
    if (!(await canCurrentUserAccessToRecipe(params.recipeId))) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const json = await req.json();
    const body = recipeSchema.parse(json);

    // Update the recipe.
    // TODO: Implement sanitization for content.
    await db.recipe.update({
      data: {
        name: body.name,
        description: body.description,
        ingredients: body.ingredients,
      },
      where: {
        id: params.recipeId,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

async function canCurrentUserAccessToRecipe(recipeId: string) {
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
