import type { Vegetable, GameCard } from '@/types/game'

export function createGameDeck(vegetables: Vegetable[]): GameCard[] {
    const cards: GameCard[] = []
    let cardId = 0

    vegetables.forEach((vegetable) => {
        // Create front card (shows vegetable info)
        cards.push({
            id: cardId++,
            vegetableId: vegetable.id,
            type: 'front',
            vegetable
        })

        // Create back card (shows vegetable info)
        cards.push({
            id: cardId++,
            vegetableId: vegetable.id,
            type: 'back',
            vegetable
        })
    })

    return cards
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function calculateStars(moves: number, timeElapsed: number, difficulty: 'easy' | 'medium' | 'hard'): number {
    const maxMoves = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 20 : 30
    const maxTime = difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240

    let stars = 3

    // Deduct stars based on performance
    if (moves > maxMoves * 1.5) stars--
    if (timeElapsed > maxTime * 1.5) stars--
    if (moves > maxMoves * 2 || timeElapsed > maxTime * 2) stars--

    return Math.max(1, stars)
}

export function getEncouragementMessage(stars: number, difficulty: string): string {
    const messages = {
        3: [
            `Ang galing mo! Perfect ka sa ${difficulty} mode! ⭐⭐⭐`,
            `Sobrang husay! Alam mo na talaga ang mga gulay! 🌟`,
            `Excellent work! You're a true Bahay Kubo expert! 💚`
        ],
        2: [
            `Magaling ka! Good job sa ${difficulty} mode! ⭐⭐`,
            `Great work! Keep practicing para mas maging expert! 👏`,
            `Well done! You know your vegetables well! 🥬`
        ],
        1: [
            `Good try! Practice pa para mas maging magaling! ⭐`,
            `Keep going! Mas magiging expert ka sa mga gulay! 💪`,
            `Nice effort! Try again to improve your score! 🌱`
        ]
    }

    const starMessages = messages[stars as keyof typeof messages] || messages[1]
    return starMessages[Math.floor(Math.random() * starMessages.length)]
}