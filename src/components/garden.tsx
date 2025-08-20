'use client'

import { useState, useEffect, useCallback, JSX } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sprout, Droplets, Scissors, Clock, Star, ShoppingCart } from 'lucide-react'
import { getGardenStats, getPlantedVegetables, updatePlantedVegetable, removePlantedVegetable, updateGardenStats } from '@/lib/garden-storage'
import { vegetables } from '@/data/vegetables'
import type { PlantedVegetable, GardenStats, PlantGrowthStage } from '@/types/garden'

interface GardenProps {
    isOpen: boolean
    onClose: () => void
    onOpenShop: () => void
}

export function Garden({ isOpen, onClose, onOpenShop }: GardenProps): JSX.Element | null {
    const [plantedVegetables, setPlantedVegetables] = useState<PlantedVegetable[]>([])
    const [gardenStats, setGardenStats] = useState<GardenStats | null>(null)

    const loadGardenData = useCallback(() => {
        setPlantedVegetables(getPlantedVegetables())
        setGardenStats(getGardenStats())
    }, [])

    useEffect(() => {
        if (isOpen) {
            loadGardenData()
        }
    }, [isOpen, loadGardenData])

    useEffect(() => {
        if (!isOpen) return

        const interval = setInterval(() => {
            loadGardenData()
        }, 30000) // Update every 30 seconds

        return () => clearInterval(interval)
    }, [isOpen, loadGardenData])

    if (!isOpen) return null

    const getGrowthStageProgress = (stage: PlantGrowthStage): number => {
        const stages = { seed: 0, sprout: 25, growing: 50, mature: 75, ready: 100 }
        return stages[stage] || 0
    }

    const getGrowthStageEmoji = (stage: PlantGrowthStage): string => {
        const emojis = { seed: '🌰', sprout: '🌱', growing: '🌿', mature: '🍃', ready: '✨' }
        return emojis[stage] || '🌰'
    }

    const getTimeUntilNextStage = (plant: PlantedVegetable): string => {
        const now = Date.now()
        const plantAge = now - plant.plantedAt
        const stageTime = 2 * 60 * 1000 // 2 minutes per stage

        const stageIndex = ['seed', 'sprout', 'growing', 'mature', 'ready'].indexOf(plant.growthStage)
        const nextStageTime = (stageIndex + 1) * stageTime

        if (plant.growthStage === 'ready') return 'Ready to harvest!'
        if (plantAge >= nextStageTime) return 'Ready to grow!'

        const timeLeft = nextStageTime - plantAge
        const minutes = Math.ceil(timeLeft / (60 * 1000))
        return `${minutes}m until next stage`
    }

    const canWaterPlant = (plant: PlantedVegetable): boolean => {
        const now = Date.now()
        const timeSinceLastWater = now - plant.lastWatered
        const waterCooldown = 1 * 60 * 1000 // 1 minute cooldown
        return timeSinceLastWater >= waterCooldown && plant.growthStage !== 'ready'
    }

    const updatePlantGrowth = (plant: PlantedVegetable): PlantedVegetable => {
        const now = Date.now()
        const plantAge = now - plant.plantedAt
        const stageTime = 2 * 60 * 1000 // 2 minutes per stage
        const waterBonus = plant.waterings * 30 * 1000 // 30 seconds bonus per watering
        const effectiveAge = plantAge + waterBonus

        let newStage: PlantGrowthStage = 'seed'

        if (effectiveAge >= 4 * stageTime) newStage = 'ready'
        else if (effectiveAge >= 3 * stageTime) newStage = 'mature'
        else if (effectiveAge >= 2 * stageTime) newStage = 'growing'
        else if (effectiveAge >= stageTime) newStage = 'sprout'

        return { ...plant, growthStage: newStage }
    }

    const handleWaterPlant = async (plantId: string): Promise<void> => {
        const plant = plantedVegetables.find(p => p.id === plantId)
        if (!plant || !canWaterPlant(plant)) return

        const updatedPlant = {
            ...plant,
            lastWatered: Date.now(),
            waterings: plant.waterings + 1
        }

        const updated = updatePlantedVegetable(plantId, updatedPlant)
        setPlantedVegetables(updated.map(updatePlantGrowth))
    }

    const handleHarvestPlant = async (plantId: string): Promise<void> => {
    const plant = plantedVegetables.find(p => p.id === plantId)
    if (!plant) return

    const updatedPlant = updatePlantGrowth(plant)
    if (updatedPlant.growthStage !== 'ready') return

    const harvestPoints = 20 + (updatedPlant.waterings * 5)
    const currentStats = getGardenStats()
    updateGardenStats({
        totalPoints: currentStats.totalPoints + harvestPoints,
        totalVegetablesHarvested: currentStats.totalVegetablesHarvested + 1
    })

    const updated = removePlantedVegetable(plantId)
    setPlantedVegetables(updated)
    setGardenStats(getGardenStats())

    console.log(`Harvested ${updatedPlant.vegetableId} for ${harvestPoints} points!`)
}


    const getVegetableData = (vegetableId: string) => {
        return vegetables.find(v => v.id === vegetableId)
    }

    const renderGardenPlot = (index: number): JSX.Element => {
        const plant = plantedVegetables[index]
        const isEmpty = !plant

        return (
            <div
                key={index}
                className={`
          aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center
          ${isEmpty ? 'border-gray-300 bg-gradient-to-br from-green-50 to-green-100' : 'border-green-400 bg-gradient-to-br from-green-100 to-green-200'}
          transition-all duration-200 hover:shadow-md
        `}
            >
                {isEmpty ? (
                    <div className="text-center p-2">
                        <div className="text-2xl mb-1">🌱</div>
                        <div className="text-xs text-gray-600">Empty Plot</div>
                    </div>
                ) : (
                    <div className="text-center p-2 w-full">
                        <div className="text-2xl mb-1">
                            {getGrowthStageEmoji(updatePlantGrowth(plant).growthStage)}
                        </div>
                        <div className="text-xs text-green-800 font-medium mb-1">
                            {getVegetableData(plant.vegetableId)?.filipinoName}
                        </div>
                        <Progress
                            value={getGrowthStageProgress(updatePlantGrowth(plant).growthStage)}
                            className="h-1 mb-2"
                        />
                        <div className="flex gap-1 justify-center">
                            {updatePlantGrowth(plant).growthStage === 'ready' ? (
                                <Button
                                    size="sm"
                                    onClick={() => handleHarvestPlant(plant.id)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 h-6 text-xs"
                                >
                                    <Scissors className="w-3 h-3" />
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() => handleWaterPlant(plant.id)}
                                    disabled={!canWaterPlant(plant)}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-2 py-1 h-6 text-xs"
                                >
                                    <Droplets className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const activePlants = plantedVegetables.map(updatePlantGrowth)
    const readyToHarvest = activePlants.filter(plant => plant.growthStage === 'ready').length
    const totalPlots = 9 // 3x3 grid
    const occupiedPlots = plantedVegetables.length

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-yellow-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                            <Sprout className="w-6 h-6" />
                            🏡 My Bahay Kubo Garden
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
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Level {gardenStats?.gardenLevel || 1}
                        </Badge>
                        <Badge variant="outline">
                            🌱 {gardenStats?.totalPoints || 0} Binhi Points
                        </Badge>
                        <Badge variant="outline">
                            🥕 {gardenStats?.totalVegetablesHarvested || 0} Harvested
                        </Badge>
                        {readyToHarvest > 0 && (
                            <Badge className="bg-orange-100 text-orange-800 animate-pulse">
                                ✨ {readyToHarvest} Ready to Harvest!
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <Tabs defaultValue="garden" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="garden" className="flex items-center gap-2">
                                <Sprout className="w-4 h-4" />
                                Garden Plot
                            </TabsTrigger>
                            <TabsTrigger value="plants" className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Plant Status
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="garden" className="mt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-800 mb-1">Garden Overview</h3>
                                    <p className="text-sm text-gray-600">
                                        {occupiedPlots}/{totalPlots} plots occupied • Click 🛒 Shop to buy seeds
                                    </p>
                                </div>
                                <Button
                                    onClick={onOpenShop}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    🛒 Shop Seeds
                                </Button>
                            </div>

                            {/* 3x3 Garden Grid */}
                            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                                {Array.from({ length: totalPlots }, (_, index) => renderGardenPlot(index))}
                            </div>

                            {plantedVegetables.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Sprout className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>Your garden is empty!</p>
                                    <p className="text-sm mb-4">Buy seeds from the shop to start growing vegetables 🌱</p>
                                    <Button
                                        onClick={onOpenShop}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Visit Shop
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="plants" className="mt-6">
                            <ScrollArea className="h-96">
                                {activePlants.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p>No plants growing!</p>
                                        <p className="text-sm">Plant some seeds to see their growth progress 🌱</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {activePlants.map(plant => {
                                            const vegetableData = getVegetableData(plant.vegetableId)
                                            const timeInfo = getTimeUntilNextStage(plant)

                                            return (
                                                <Card key={plant.id} className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-2xl">{vegetableData?.emoji}</div>
                                                                <div>
                                                                    <div className="font-semibold text-green-800">
                                                                        {vegetableData?.filipinoName} ({vegetableData?.name})
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">{timeInfo}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-2xl">{getGrowthStageEmoji(plant.growthStage)}</div>
                                                                <Badge variant="outline" className="capitalize">
                                                                    {plant.growthStage}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm text-gray-600">Growth Progress</span>
                                                                <span className="text-sm font-medium">{getGrowthStageProgress(plant.growthStage)}%</span>
                                                            </div>
                                                            <Progress value={getGrowthStageProgress(plant.growthStage)} className="h-2" />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm text-gray-600">
                                                                💧 Watered {plant.waterings} times
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {plant.growthStage === 'ready' ? (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleHarvestPlant(plant.id)}
                                                                        className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1"
                                                                    >
                                                                        <Scissors className="w-4 h-4" />
                                                                        Harvest
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleWaterPlant(plant.id)}
                                                                        disabled={!canWaterPlant(plant)}
                                                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white flex items-center gap-1"
                                                                    >
                                                                        <Droplets className="w-4 h-4" />
                                                                        Water
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
