import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  navItems: [
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'Demo',
      href: '/demo',
      disabled: true,
    },
  ],
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
