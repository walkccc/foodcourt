import { db } from '@/lib/db';

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
};
