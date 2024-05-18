import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { recipeSchema } from '@/lib/validations/recipe';

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return new Response('Unauthorized', { status: 403 });
    }

    // TODO: Check if the current user is on the PRO plan.

    const json = await req.json();
    const body = recipeSchema.parse(json);

    const recipe = await db.recipe.create({
      data: {
        name: body.name,
        description: body?.description || '',
        ingredients: body?.ingredients || [],
        userId: currentUser.id,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(recipe));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    // TODO: Handle RequiresProPlanError

    return new Response(null, { status: 500 });
  }
}
