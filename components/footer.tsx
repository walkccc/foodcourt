import * as React from 'react';

import { Icons } from '@/components/icons';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={className}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo />
          <p className="text-center text-sm leading-loose md:text-left">
            Built with love in New York
          </p>
        </div>
      </div>
    </footer>
  );
}
