'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { User } from 'next-auth';
import * as React from 'react';

import { Icons } from '@/components/icons';
import { MobileNav } from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import { UserAccountNav } from '@/components/user-account-nav';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  navItems?: NavItem[];
  children?: React.ReactNode;
  currentUser?: User;
}

export function Navbar({
  navItems,
  children,
  currentUser,
  className,
}: NavbarProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <header className={cn(className, 'z-40')}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Icons.logo />
            <span className="hidden font-bold sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems?.map((navItem, index) => (
              <Link
                key={index}
                href={navItem.disabled ? '#' : navItem.href}
                className={cn(
                  'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                  navItem.href.startsWith(`/${segment}`)
                    ? 'text-foreground/100'
                    : 'text-foreground/50',
                  navItem.disabled && 'cursor-not-allowed opacity-80',
                )}
              >
                {navItem.title}
              </Link>
            ))}
          </nav>
          <button
            className="flex items-center space-x-2 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <Icons.close /> : <Icons.logo />}
            <span className="font-bold">Menu</span>
          </button>
          {showMobileMenu && navItems && (
            <MobileNav navItems={navItems}>{children}</MobileNav>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {currentUser ? (
            <UserAccountNav user={currentUser} />
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'px-4',
              )}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
