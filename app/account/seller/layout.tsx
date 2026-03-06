import { ReactNode } from 'react';
import { SellerNav } from '@/components/SellerNav';

const SellerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <SellerNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        {children}
      </main>
    </div>
  );
};

export default SellerLayout;