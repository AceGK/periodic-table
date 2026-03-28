import { Nunito_Sans } from 'next/font/google'
import '@/styles/reset.scss'
import '@/styles/globals.scss'
import Nav from '@/components/ui/Nav'
import Footer from '@/components/ui/Footer'

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
      <Footer />
      </body>
    </html>
  )
}
