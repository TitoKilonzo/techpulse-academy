import './globals.css';
import { Syne, Outfit, JetBrains_Mono } from 'next/font/google';
import ToastProvider from '@/components/ui/ToastProvider';

const syne = Syne({ 
  subsets: ['latin'], 
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: { default: 'TechPulse Academy', template: '%s | TechPulse Academy' },
  description: 'Premium interactive learning platform for Tech, Cybersecurity, AI, Open Source & Cloud Computing.',
  themeColor: '#E8860C',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-body bg-bg-primary text-text-primary">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
