'use client';

import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  return <button onClick={() => signOut()}>Sign Out</button>;
}
