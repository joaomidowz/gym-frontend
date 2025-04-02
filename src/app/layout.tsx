import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gym App',
  description: 'Treine como um monstro, registre como um dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
