import * as navigation from 'next/navigation';

import { DashboardNav } from '@/components/dashboard-nav';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { dashboardConfig } from '@/config/dashboard';
import { getCurrentUser } from '@/lib/auth';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return navigation.notFound();
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <Navbar
        navItems={dashboardConfig.navItems}
        currentUser={currentUser}
        className="sticky top-0 border-b bg-background"
      />
      <div className="md:grid-cols container grid flex-1 gap-12">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <Footer className="border-t" />
    </div>
  );
}
