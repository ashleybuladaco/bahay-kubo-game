'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatTime } from '@/lib/game-utils'
import { JSX } from 'react'

interface GameStatsProps {
    score: number
    moves: number
    timeElapsed: number
    difficulty: 'easy' | 'medium' | 'hard'
    isVisible: boolean
}

export function GameStats({ score, moves, timeElapsed, difficulty, isVisible }: GameStatsProps): JSX.Element {
    if (!isVisible) return <></>

    const getDifficultyEmoji = (level: string): string => {
        switch (level) {
            case 'easy': return '🌱'
            case 'medium': return '🌿'
            case 'hard': return '🌳'
            default: return '🌱'
        }
    }

    const getDifficultyColor = (level: string): string => {
        switch (level) {
            case 'easy': return 'text-green-600'
            case 'medium': return 'text-yellow-600'
            case 'hard': return 'text-red-600'
            default: return 'text-green-600'
        }
    }

    return (
        <Card className="mt-6 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-2xl">🏆</div>
                        <div className="text-lg font-bold text-yellow-600">{score}</div>
                        <div className="text-xs text-gray-600">Score</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-2xl">👆</div>
                        <div className="text-lg font-bold text-blue-600">{moves}</div>
                        <div className="text-xs text-gray-600">Moves</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-2xl">⏱️</div>
                        <div className="text-lg font-bold text-purple-600">{formatTime(timeElapsed)}</div>
                        <div className="text-xs text-gray-600">Time</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-2xl">{getDifficultyEmoji(difficulty)}</div>
                        <div className={`text-lg font-bold capitalize ${getDifficultyColor(difficulty)}`}>
                            {difficulty}
                        </div>
                        <div className="text-xs text-gray-600">Level</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}