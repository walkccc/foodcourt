import { z } from 'zod';

import { canCurrentUserAccessToRecipe } from '@/lib/access';
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
      where: { id: params.recipeId },
      include: { ingredients: true },
    });

    return new Response(
      JSON.stringify({
        name: recipe?.name,
        description: recipe?.description,
        ingredients: recipe?.ingredients.map((ingredient) => ingredient.name),
      }),
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return error instanceof z.ZodError
      ? new Response(JSON.stringify(error.issues), { status: 422 })
      : new Response(null, { status: 500 });
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
      where: { id: params.recipeId },
    });

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return error instanceof z.ZodError
      ? new Response(JSON.stringify(error.issues), { status: 422 })
      : new Response(null, { status: 500 });
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
    await db.$transaction([
      db.ingredient.deleteMany({
        where: {
          AND: [
            { recipeId: params.recipeId },
            { NOT: { name: { in: body.ingredients ?? [] } } },
          ],
        },
      }),
      db.recipe.update({
        where: { id: params.recipeId },
        data: {
          name: body.name,
          description: body.description,
          ingredients: {
            connectOrCreate: (body.ingredients ?? []).map((ingredient) => ({
              where: { name: ingredient },
              create: { name: ingredient, bought: false },
            })),
          },
          updatedAt: new Date(),
        },
      }),
    ]);

    return new Response(null, { status: 200 });
  } catch (error: unknown) {
    return error instanceof z.ZodError
      ? new Response(JSON.stringify(error.issues), { status: 422 })
      : new Response(null, { status: 500 });
  }
}
