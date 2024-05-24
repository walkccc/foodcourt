import { z } from 'zod';

import { canCurrentUserAccessToIngredient } from '@/lib/access';
import { db } from '@/lib/db';
import { ingredientSchema } from '@/lib/validations/ingredient';

const routeContextSchema = z.object({
  params: z.object({
    ingredientId: z.string(),
  }),
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the current user has access to this ingredient.
    if (!(await canCurrentUserAccessToIngredient(params.ingredientId))) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const json = await req.json();
    const body = ingredientSchema.parse(json);

    // Update the ingredient.
    await db.ingredient.update({
      where: { id: params.ingredientId },
      data: {
        name: body.name,
        bought: body.bought,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error: unknown) {
    return error instanceof z.ZodError
      ? new Response(JSON.stringify(error.issues), { status: 422 })
      : new Response(null, { status: 500 });
  }
}
