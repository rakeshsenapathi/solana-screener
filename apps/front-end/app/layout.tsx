import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/Header'

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
})

export const metadata: Metadata = {
    title: 'Meme Scan',
    description: 'Screener for Solana Memes',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="min-h-screen">
            <body
                className={cn(
                    'bg-background font-sans antialiased bg-[#0A0A0A]',
                    fontSans.variable
                )}
            >
                <div className="flex flex-col h-full">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                    >
                        <Header />
                        <div className="flex-grow">{children}</div>
                    </ThemeProvider>
                </div>
            </body>
        </html>
    )
}
