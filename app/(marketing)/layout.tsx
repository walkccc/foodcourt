import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { marketingConfig } from '@/config/marketing';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <Navbar navItems={marketingConfig.navItems} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
