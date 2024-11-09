import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SubscriptionsProvider } from '@/context/subscriptions-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Subscription Manager',
  description: 'Manage your business subscriptions efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SubscriptionsProvider>
            {children}
          </SubscriptionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}