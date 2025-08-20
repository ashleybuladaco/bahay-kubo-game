'use client'

import type { PlantedVegetable, GardenStats, GameHistory } from '@/types/garden'

const STORAGE_KEYS = {
    GARDEN_STATS: 'bahayKubo_gardenStats',
    PLANTED_VEGETABLES: 'bahayKubo_plantedVegetables',
    GAME_HISTORY: 'bahayKubo_gameHistory'
}

// Default garden stats
const DEFAULT_GARDEN_STATS: GardenStats = {
    totalPoints: 0,
    totalGamesPlayed: 0,
    totalVegetablesHarvested: 0,
    gardenLevel: 1,
    unlockedVegetables: ['singkamas', 'talong'] // Start with 2 unlocked vegetables
}

// Garden Stats Management
export const getGardenStats = (): GardenStats => {
    if (typeof window === 'undefined') return DEFAULT_GARDEN_STATS

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.GARDEN_STATS)
        return stored ? JSON.parse(stored) : DEFAULT_GARDEN_STATS
    } catch {
        return DEFAULT_GARDEN_STATS
    }
}

export const updateGardenStats = (updates: Partial<GardenStats>): GardenStats => {
    if (typeof window === 'undefined') return DEFAULT_GARDEN_STATS

    const current = getGardenStats()
    const updated = { ...current, ...updates }

    // Calculate garden level based on total points
    updated.gardenLevel = Math.floor(updated.totalPoints / 1000) + 1

    localStorage.setItem(STORAGE_KEYS.GARDEN_STATS, JSON.stringify(updated))
    return updated
}

export const addPoints = (points: number): GardenStats => {
    const current = getGardenStats()
    return updateGardenStats({
        totalPoints: current.totalPoints + points,
        totalGamesPlayed: current.totalGamesPlayed + 1
    })
}

export const unlockVegetable = (vegetableId: string): GardenStats => {
    const current = getGardenStats()
    if (!current.unlockedVegetables.includes(vegetableId)) {
        return updateGardenStats({
            unlockedVegetables: [...current.unlockedVegetables, vegetableId]
        })
    }
    return current
}
// Planted Vegetables Management
export function getPlantedVegetables(): PlantedVegetable[] {
    if (typeof localStorage === 'undefined') return []

    const stored = localStorage.getItem(STORAGE_KEYS.PLANTED_VEGETABLES)
    return stored ? JSON.parse(stored) : []
}

export const addPlantedVegetable = (
    vegetable: Omit<PlantedVegetable, 'id'>
): PlantedVegetable => {
    if (typeof window === 'undefined') return { ...vegetable, id: Date.now().toString() }

    const planted: PlantedVegetable = {
        ...vegetable,
        id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const current = getPlantedVegetables()
    const updated = [...current, planted]

    localStorage.setItem(STORAGE_KEYS.PLANTED_VEGETABLES, JSON.stringify(updated))
    return planted
}

export const updatePlantedVegetable = (
    id: string,
    updates: Partial<PlantedVegetable>
): PlantedVegetable[] => {
    if (typeof window === 'undefined') return []

    const current = getPlantedVegetables()
    const updated = current.map(plant =>
        plant.id === id ? { ...plant, ...updates } : plant
    )

    localStorage.setItem(STORAGE_KEYS.PLANTED_VEGETABLES, JSON.stringify(updated))
    return updated
}

export function removePlantedVegetable(id: string): PlantedVegetable[] {
    if (typeof window === 'undefined') return []

    const current = getPlantedVegetables()
    const updated = current.filter(p => p.id !== id)

    localStorage.setItem(STORAGE_KEYS.PLANTED_VEGETABLES, JSON.stringify(updated))
    return updated
}

// Game History Management
export const getGameHistory = (): GameHistory[] => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export const addGameToHistory = (game: Omit<GameHistory, 'id' | 'timestamp'>): GameHistory => {
    if (typeof window === 'undefined') return { ...game, id: Date.now().toString(), timestamp: Date.now() }

    const gameEntry: GameHistory = {
        ...game,
        id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
    }

    const current = getGameHistory()
    const updated = [gameEntry, ...current].slice(0, 50) // Keep last 50 games

    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(updated))
    return gameEntry
}

// Calculate game points and stars
export const calculateGameReward = (
    score: number,
    timeElapsed: number,
    moves: number,
    difficulty: 'easy' | 'medium' | 'hard'
): { points: number; stars: number } => {
    const basePoints = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 150
    const bonusPoints = Math.max(0, score / 10)
    const timeBonus = Math.max(0, (300 - timeElapsed) * 2)

    const totalPoints = Math.floor(basePoints + bonusPoints + timeBonus)

    // Calculate stars (1-3) based on performance
    let stars = 1
    if (timeElapsed < 120 && moves < 20) stars = 3
    else if (timeElapsed < 180 && moves < 30) stars = 2

    return { points: totalPoints, stars }
}
