export interface PlantedVegetable {
    id: string
    vegetableId: string
    plantedAt: number
    lastWatered: number
    growthStage: 'seed' | 'sprout' | 'growing' | 'mature' | 'ready'
    position: { x: number; y: number }
    waterings: number
}

export interface GardenStats {
    totalPoints: number
    totalGamesPlayed: number
    totalVegetablesHarvested: number
    gardenLevel: number
    unlockedVegetables: string[]
}

export interface GameHistory {
    id: string
    timestamp: number
    difficulty: 'easy' | 'medium' | 'hard'
    score: number
    moves: number
    timeElapsed: number
    pointsEarned: number
    stars: number
}

export interface ShopItem {
    id: string
    vegetableId: string
    name: string
    filipinoName: string
    emoji: string
    cost: number
    description: string
    unlockLevel: number
    isUnlocked: boolean
    isPurchased: boolean
}

export interface GardenPlot {
    id: number
    isOccupied: boolean
    plantId?: string
    unlockLevel: number
}

export type PlantGrowthStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'ready'