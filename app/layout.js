import './globals.css'

export const metadata = {
  title: 'OL-Tipping 2026 | Milano-Cortina',
  description: 'Tippespill for Vinter-OL Milano-Cortina 2026 - 55 øvelser, 16 dager med action!',
  manifest: '/manifest.json',
  themeColor: '#0891b2',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OL-Tipping',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-icon-180.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="OL-Tipping" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
      </head>
      <body className="bg-slate-900">{children}</body>
    </html>
  )
}
