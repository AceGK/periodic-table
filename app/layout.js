import { Inter } from 'next/font/google'
import './reset.scss'
import './globals.scss'
import Nav from '../components/nav/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Periodic Table of Elements',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Nav />
      {children}
      </body>
    </html>
  )
}
