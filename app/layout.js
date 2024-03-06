import { Nunito_Sans } from 'next/font/google'
import './reset.scss'
import './globals.scss'
import Nav from '../components/nav/Nav'

const Nunito = Nunito_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Periodic Table of Elements',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={Nunito.className}>
      <Nav />
      {children}
      </body>
    </html>
  )
}
