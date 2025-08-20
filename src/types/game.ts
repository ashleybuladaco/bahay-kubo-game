export interface Vegetable {
    id: string
    name: string
    filipinoName: string
    emoji: string
    description: string
    nutritionalBenefit: string
    seasonality: string
    culinaryUse: string
}

export interface GameCard {
    id: number
    vegetableId: string
    type: 'front' | 'back'
    vegetable: Vegetable
}

export interface GameStats {
    score: number
    moves: number
    timeElapsed: number
    difficulty: 'easy' | 'medium' | 'hard'
}

export interface SoundType {
    cardFlip: string
    match: string
    noMatch: string
    victory: string
    gameStart: string
}