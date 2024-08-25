'use client'

import { Dashboard } from '@/components/Dashboard'
import { Header } from '@/components/Header'
import { Token } from '@/types'
import { useEffect, useState } from 'react'

export default function Home() {
    const [lpTokens, setLpTokens] = useState<Token[]>([])

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:4000`)

        console.log('ws', ws)

        ws.onopen = () => {
            console.log('web socket client connection opened')
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setLpTokens(data)
        }

        ws.onclose = () => {
            console.log('Disconnected from WebSocket /dashboard')
        }

        ws.onerror = (err) => {
            console.log('error', err)
        }

        return () => {
            if (ws.readyState === 1) {
                ws.close()
            }
        }
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-[#0A0A0A]">
            <div>
                <Header />
                <Dashboard lpTokens={lpTokens} />
            </div>
        </main>
    )
}
