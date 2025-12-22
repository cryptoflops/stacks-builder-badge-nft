'use client'

import { useState, useEffect } from 'react'
import { Zap, Shield, User, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityEvent {
    id: string
    timestamp: string
    type: 'nft_mint' | 'vault_action'
    event: string
    user?: string
    buyer?: string
    amount?: number
    "token-id"?: string
    price?: number
}

export function ActivityFeed() {
    const [events, setEvents] = useState<ActivityEvent[]>([])
    const [loading, setLoading] = useState(true)

    const fetchActivity = async () => {
        try {
            const res = await fetch('http://localhost:3002/api/activity')
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error('Failed to fetch activity:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivity()
        const interval = setInterval(fetchActivity, 5000)
        return () => clearInterval(interval)
    }, [])

    if (loading && events.length === 0) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-800/50 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {events.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    <p className="text-sm italic">No recent activity detected yet.</p>
                    <p className="text-xs mt-1">Events will appear here in real-time.</p>
                </div>
            ) : (
                events.map((event) => (
                    <div
                        key={event.id}
                        className="group relative flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 rounded-2xl transition-all duration-300"
                    >
                        <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                            event.type === 'nft_mint' ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                            {event.type === 'nft_mint' ? <Zap size={18} /> : <Shield size={18} />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-slate-200">
                                    {event.type === 'nft_mint' ? 'Bundle Minted' :
                                        event.event === 'pubkey-registered' ? 'Vault Created' :
                                            event.event === 'deposit' ? 'STX Deposited' :
                                                event.event === 'withdrawal' ? 'STX Withdrawn' : 'Vault Action'}
                                </p>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1">
                                <User size={10} className="text-slate-500" />
                                {event.buyer || event.user || 'Unknown'}
                            </p>

                            {event.price && (
                                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                                    {event.price / 1000000} STX
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
