'use client'

import { Dashboard } from '@/components/Dashboard'
import { Token } from '@/types'
import { useEffect, useState } from 'react'

export default function Home() {
    const [lpTokens, setLpTokens] = useState<Token[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        setLoading(true)
        const ws = new WebSocket(`ws://localhost:4000`)
        ws.onopen = () => {
            console.log('web socket client connection opened')
        }

        ws.onmessage = (event) => {
            setLoading(false)
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
            ws.close()
        }
    }, [])

    return (
        <main className="flex min-h-screen flex-col bg-[#0A0A0A] w-screen">
            <div>
                <Dashboard lpTokens={lpTokens} loading={loading} />
            </div>
        </main>
    )
}
