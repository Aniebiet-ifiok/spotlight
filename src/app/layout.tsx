import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import { Manrope, Ubuntu } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
});

export const metadata: Metadata = {
  title: 'SalesPaddi',
  description: 'AI-Powered Sales and marketing platform',
  authors: [
    {
      name: "Pluscode",
      url: "https://pluscodeltd.vercel.app",
    },
  ],
  keywords: [
    'AI webinar platform',
    'automated webinar software',
    'live webinar hosting',
    'webinar automation',
    'AI-powered presentations',
    'interactive webinars',
    'automated sales funnel',
    'webinar sales automation',
    'lead generation webinars',
    'conversion optimization',
    'sales webinar platform',
    'marketing automation',
    'real-time chat integration',
    'AI chatbot webinars',
    'voice AI integration',
    'stream chat',
    'live streaming platform',
    'video conferencing',
    'SaaS webinar platform',
    'business webinar software',
    'online presentation tool',
    'virtual events platform',
    'digital marketing tools',
    'customer engagement',
    'artificial intelligence',
    'machine learning webinars',
    'Next.js application',
    'React webinar platform',
    'TypeScript',
    'Prisma database',
    'Stripe integration',
    'payment processing',
    'Clerk authentication',
    'Vapi.ai integration',
    'API integration',
    'webhook automation',
    'webinar monetization',
    'online course platform',
    'digital product sales',
    'e-learning platform',
    'virtual training',
    'remote presentations',
  ],
  creator: "Pluscode",
  publisher: "Pluscode",
  openGraph: {
    title: 'SalesPaddi',
    description:
      'AI-Powered Sales and marketing platform',
    url: "https://pluscodeltd.vercel.app",
    siteName: "Pluscode",
    // images: [
    //   {
    //     url: "https://pluscodeltd.vercel.app/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SalesPaddi',
    description:
      'AI-Powered Sales and marketing platform',
    images: [""],
    creator: "pluscode",
  },
  category: 'Technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${manrope.variable} ${ubuntu.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
