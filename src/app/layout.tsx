import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QWitness — An evidence trail for every answer',
  description: 'Post-quantum evidence receipts for onchain AI agents. Explore Ethereum lending data, inspect the evidence, and verify the signed receipt.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
