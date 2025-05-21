import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ML Portfolio - Hamid Rezaee', // Updated website title
  description: "Hamid Rezaee's interactive machine learning portfolio.", // Optional: Update description
  generator: '',
  icons: {
    icon: '/favicon.png', // Path to your favicon in the public folder
    // You can also add other icon types if needed:
    // apple: '/apple-touch-icon.png',
    // shortcut: '/shortcut-icon.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Next.js automatically handles the <head> tag content based on the Metadata object */}
      <body>{children}</body>
    </html>
  )
}