import './globals.css'

export const metadata = {
  title: 'OL-Tipping 2026 - Milano-Cortina',
  description: 'Tippkonkurranse for vinter-OL 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
