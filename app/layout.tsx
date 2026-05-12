import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CustomCursor } from '@/components/animations/CustomCursor'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  weight: ['400', '500', '700']
});

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-display',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'Gangaji Karthikeyan | Full-Stack Developer & AI/ML Engineer',
  description: 'Portfolio of Gangaji Karthikeyan - Full-stack AI builder from Hyderabad. CS student at CMR Technical Campus.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} bg-black scroll-smooth`}>
      <body className="font-sans antialiased bg-black text-white cursor-none">
        <CustomCursor />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
