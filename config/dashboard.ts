import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  navItems: [],
  sidebarNavItems: [
    {
      title: 'Recipes',
      href: '/dashboard',
      icon: 'recipe',
    },
    {
      title: 'Billing',
      href: '/dashboard/billing',
      icon: 'billing',
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: 'settings',
    },
  ],
};
