import type { Metadata } from 'next'
import { Roboto, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const roboto = Roboto({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Thank You for Inspiring Us | Data Science G2',
  description: 'A heartfelt thank-you gift from Data Science G2 to our beloved Career Readiness Course teacher',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/love_story.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/love_story-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/love_story.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/love_story.png.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
