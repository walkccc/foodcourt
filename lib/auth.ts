import { User } from 'next-auth';

import { auth } from '@/auth';

export const getCurrentUser = async (): Promise<User | undefined> => {
  const session = await auth();
  return session?.user;
};
