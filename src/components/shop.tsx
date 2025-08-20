'use client'

import { useState, useEffect, JSX } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShoppingCart, Lock, CheckCircle, Star, Coins } from 'lucide-react'
import { getGardenStats, updateGardenStats, addPlantedVegetable, getPlantedVegetables, unlockVegetable } from '@/lib/garden-storage'
import { vegetables } from '@/data/vegetables'
import type { GardenStats, ShopItem } from '@/types/garden'

interface ShopProps {
    isOpen: boolean
    onClose: () => void
}

export function Shop({ isOpen, onClose }: ShopProps): JSX.Element | null {
    const [gardenStats, setGardenStats] = useState<GardenStats | null>(null)
    const [shopItems, setShopItems] = useState<ShopItem[]>([])
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
    const [purchaseMessage, setPurchaseMessage] = useState<string>('')

    useEffect(() => {
        if (isOpen) {
            const stats = getGardenStats()
            setGardenStats(stats)

            // Create shop items from vegetables
            const items: ShopItem[] = vegetables.map((vegetable, index) => {
                const baseCost = 50 + (index * 25) // Increasing cost
                const unlockLevel = Math.ceil((index + 1) / 2) // 2 vegetables per level
                const isUnlocked = stats.gardenLevel >= unlockLevel
                const isPurchased = stats.unlockedVegetables.includes(vegetable.id)

                return {
                    id: `shop_${vegetable.id}`,
                    vegetableId: vegetable.id,
                    name: vegetable.name,
                    filipinoName: vegetable.filipinoName,
                    emoji: vegetable.emoji,
                    cost: baseCost,
                    description: vegetable.description,
                    unlockLevel,
                    isUnlocked,
                    isPurchased
                }
            })

            setShopItems(items)
        }
    }, [isOpen])

    if (!isOpen || !gardenStats) return null

    const canAfford = (cost: number): boolean => gardenStats.totalPoints >= cost
    const availablePlots = 9 - getPlantedVegetables().length

    const handlePurchase = async (item: ShopItem): Promise<void> => {
        if (!canAfford(item.cost) || !item.isUnlocked || item.isPurchased || availablePlots <= 0) {
            return
        }

        // Deduct points and unlock vegetable
        const newStats = updateGardenStats({
            totalPoints: gardenStats.totalPoints - item.cost
        })
        unlockVegetable(item.vegetableId)

        setGardenStats(newStats)
        setPurchaseMessage(`🎉 Purchased ${item.filipinoName} seeds! Check your inventory to plant them.`)

        // Update shop items
        setShopItems(prev => prev.map(shopItem =>
            shopItem.id === item.id
                ? { ...shopItem, isPurchased: true }
                : shopItem
        ))

        setTimeout(() => setPurchaseMessage(''), 3000)
    }

    const handlePlantSeed = (item: ShopItem): void => {
        if (!item.isPurchased || availablePlots <= 0) return

        // Find next available plot position
        const plantedVegetables = getPlantedVegetables()
        const occupiedPositions = plantedVegetables.map((_, index) => ({ x: index % 3, y: Math.floor(index / 3) }))

        let plotPosition = { x: 0, y: 0 }
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (!occupiedPositions.some(pos => pos.x === x && pos.y === y)) {
                    plotPosition = { x, y }
                    break
                }
            }
        }

        // Plant the seed
        const now = Date.now()
        addPlantedVegetable({
            vegetableId: item.vegetableId,
            plantedAt: now,
            lastWatered: now,
            growthStage: 'seed',
            position: plotPosition,
            waterings: 0
        })

        setPurchaseMessage(`🌱 Planted ${item.filipinoName} in your garden!`)
        setTimeout(() => setPurchaseMessage(''), 3000)
    }

    const getItemStatus = (item: ShopItem): { text: string; color: string; canBuy: boolean; canPlant: boolean } => {
        if (!item.isUnlocked) {
            return { text: `🔒 Level ${item.unlockLevel}`, color: 'bg-gray-100 text-gray-600', canBuy: false, canPlant: false }
        }
        if (item.isPurchased) {
            return { text: '✅ Owned', color: 'bg-green-100 text-green-800', canBuy: false, canPlant: availablePlots > 0 }
        }
        if (!canAfford(item.cost)) {
            return { text: '💰 Too Expensive', color: 'bg-red-100 text-red-800', canBuy: false, canPlant: false }
        }
        return { text: '🛒 Buy Now', color: 'bg-blue-100 text-blue-800', canBuy: true, canPlant: false }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-yellow-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6" />
                            🛒 Bahay Kubo Seed Shop
                        </CardTitle>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-green-700 hover:text-green-900"
                        >
                            ✕
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                            <Coins className="w-4 h-4" />
                            {gardenStats.totalPoints} Binhi Points
                        </Badge>
                        <Badge variant="outline">
                            🏡 Level {gardenStats.gardenLevel}
                        </Badge>
                        <Badge variant="outline">
                            🌱 {availablePlots}/9 Empty Plots
                        </Badge>
                    </div>

                    {purchaseMessage && (
                        <Alert className="mt-4 bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription className="text-green-800">
                                {purchaseMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardHeader>

                <CardContent className="p-6">
                    {availablePlots === 0 && (
                        <Alert className="mb-6 bg-orange-50 border-orange-200">
                            <AlertDescription className="text-orange-800">
                                🌿 Your garden is full! Harvest some vegetables to make space for new plants.
                            </AlertDescription>
                        </Alert>
                    )}

                    <ScrollArea className="h-96">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {shopItems.map(item => {
                                const status = getItemStatus(item)
                                const vegetableData = vegetables.find(v => v.id === item.vegetableId)

                                return (
                                    <Card
                                        key={item.id}
                                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedItem?.id === item.id ? 'ring-2 ring-green-400' : ''
                                            } ${!item.isUnlocked ? 'opacity-60' : ''}`}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-3xl">{item.emoji}</div>
                                                    <div>
                                                        <div className="font-semibold text-green-800">
                                                            {item.filipinoName}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            ({item.name})
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className={status.color}>
                                                    {status.text}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-3">{item.description}</p>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>🌱 {item.cost} points</span>
                                                    {!item.isUnlocked && (
                                                        <span className="flex items-center gap-1">
                                                            <Lock className="w-3 h-3" />
                                                            Level {item.unlockLevel}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.unlockLevel > gardenStats.gardenLevel && (
                                                    <div className="flex">
                                                        {Array.from({ length: item.unlockLevel }, (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < gardenStats.gardenLevel ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {vegetableData && (
                                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                                                    <div><strong>Benefit:</strong> {vegetableData.nutritionalBenefit}</div>
                                                    <div><strong>Season:</strong> {vegetableData.seasonality}</div>
                                                    <div><strong>Use:</strong> {vegetableData.culinaryUse}</div>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                {status.canBuy && (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handlePurchase(item)
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                                        disabled={availablePlots === 0}
                                                    >
                                                        Buy Seeds ({item.cost} 🌱)
                                                    </Button>
                                                )}
                                                {status.canPlant && (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handlePlantSeed(item)
                                                        }}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                                                    >
                                                        Plant Now
                                                    </Button>
                                                )}
                                                {!item.isUnlocked && (
                                                    <Button
                                                        disabled
                                                        className="bg-gray-400 text-gray-600 flex-1 cursor-not-allowed"
                                                    >
                                                        Locked
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </ScrollArea>

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">🌟 How to Earn More Binhi Points:</h3>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• 🎮 Play memory games (50-150 points per win)</li>
                            <li>• ⚡ Complete games quickly for time bonuses</li>
                            <li>• 🎯 Use fewer moves for efficiency bonuses</li>
                            <li>• 🥕 Harvest vegetables (+20-50 points each)</li>
                            <li>• 💧 Water plants regularly for better yields</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}