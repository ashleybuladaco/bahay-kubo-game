'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Sprout, ShoppingCart, BarChart3 } from 'lucide-react'
import { JSX, useEffect, useState } from 'react'
import { getGardenStats } from '@/lib/garden-storage'
import type { GardenStats } from '@/types/garden'

interface NavigationBarProps {
    onOpenScoreboard: () => void
    onOpenGarden: () => void
    onOpenShop: () => void
}

export function NavigationBar({ onOpenScoreboard, onOpenGarden, onOpenShop }: NavigationBarProps): JSX.Element {
    const [gardenStats, setGardenStats] = useState<GardenStats | null>(null)

    useEffect(() => {
        const loadStats = () => {
            setGardenStats(getGardenStats())
        }

        loadStats()

        // Update stats periodically
        const interval = setInterval(loadStats, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-green-200 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏡</span>
                        <div>
                            <h2 className="font-bold text-green-800">My Bahay Kubo</h2>
                            <p className="text-sm text-green-600">Level {gardenStats?.gardenLevel || 1}</p>
                        </div>
                    </div>

                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <span className="text-lg">🌱</span>
                        {gardenStats?.totalPoints || 0} Binhi Points
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenScoreboard}
                        className="border-blue-200 hover:bg-blue-50 text-blue-700 flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        📊 Stats
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenGarden}
                        className="border-green-200 hover:bg-green-50 text-green-700 flex items-center gap-2"
                    >
                        <Sprout className="w-4 h-4" />
                        🌱 Garden
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenShop}
                        className="border-yellow-200 hover:bg-yellow-50 text-yellow-700 flex items-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        🛒 Shop
                    </Button>
                </div>
            </div>

            {gardenStats && (
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <span>🎮 Games: {gardenStats.totalGamesPlayed}</span>
                    <span>🥕 Harvested: {gardenStats.totalVegetablesHarvested}</span>
                    <span>🔓 Unlocked: {gardenStats.unlockedVegetables.length}/10 vegetables</span>
                </div>
            )}
        </div>
    )
}