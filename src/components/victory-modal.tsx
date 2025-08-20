'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatTime, calculateStars, getEncouragementMessage } from '@/lib/game-utils'
import { calculateGameReward } from '@/lib/garden-storage'
import { JSX } from 'react'

interface VictoryModalProps {
    isOpen: boolean
    onClose: () => void
    score: number
    moves: number
    timeElapsed: number
    difficulty: 'easy' | 'medium' | 'hard'
    onPlayAgain: () => void
    onNewDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void
}

export function VictoryModal({
    isOpen,
    onClose,
    score,
    moves,
    timeElapsed,
    difficulty,
    onPlayAgain,
    onNewDifficulty
}: VictoryModalProps): JSX.Element {
    const stars = calculateStars(moves, timeElapsed, difficulty)
    const encouragementMessage = getEncouragementMessage(stars, difficulty)
    const { points: earnedPoints } = calculateGameReward(score, timeElapsed, moves, difficulty)

    const renderStars = (): JSX.Element[] => {
        return Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="text-2xl">
                {i < stars ? '⭐' : '☆'}
            </span>
        ))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-yellow-50">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl text-green-800">
                        🎉 Congratulations! 🎉
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 text-center">
                    {/* Stars */}
                    <div className="flex justify-center space-x-1">
                        {renderStars()}
                    </div>

                    {/* Encouragement Message */}
                    <div className="p-4 bg-green-100 rounded-lg">
                        <p className="text-green-800 font-medium">
                            {encouragementMessage}
                        </p>
                    </div>

                    {/* Points Reward */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-green-50 border-2 border-green-200 rounded-lg">
                        <div className="text-center">
                            <div className="text-3xl mb-2">🎊</div>
                            <p className="text-green-800 font-bold text-lg">
                                You earned {earnedPoints} Binhi Points!
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                                Use them to buy seeds and grow your bahay kubo garden! 🌱
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="space-y-1">
                            <div className="text-2xl">🏆</div>
                            <div className="text-lg font-bold text-yellow-600">{score}</div>
                            <div className="text-xs text-gray-600">Final Score</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-2xl">👆</div>
                            <div className="text-lg font-bold text-blue-600">{moves}</div>
                            <div className="text-xs text-gray-600">Total Moves</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-2xl">⏱️</div>
                            <div className="text-lg font-bold text-purple-600">{formatTime(timeElapsed)}</div>
                            <div className="text-xs text-gray-600">Total Time</div>
                        </div>

                        <div className="space-y-1 bg-green-100 rounded-lg p-2">
                            <div className="text-2xl">🌱</div>
                            <div className="text-lg font-bold text-green-600">+{earnedPoints}</div>
                            <div className="text-xs text-gray-600">Binhi Points!</div>
                        </div>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="text-lg px-4 py-2 capitalize">
                            {difficulty === 'easy' && '🌱'}
                            {difficulty === 'medium' && '🌿'}
                            {difficulty === 'hard' && '🌳'}
                            {difficulty} Mode Completed
                        </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={onPlayAgain}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                        >
                            🔄 Play Again ({difficulty})
                        </Button>

                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                onClick={() => onNewDifficulty('easy')}
                                variant="outline"
                                size="sm"
                                className={`${difficulty === 'easy' ? 'bg-green-100' : ''}`}
                            >
                                🌱 Easy
                            </Button>
                            <Button
                                onClick={() => onNewDifficulty('medium')}
                                variant="outline"
                                size="sm"
                                className={`${difficulty === 'medium' ? 'bg-yellow-100' : ''}`}
                            >
                                🌿 Medium
                            </Button>
                            <Button
                                onClick={() => onNewDifficulty('hard')}
                                variant="outline"
                                size="sm"
                                className={`${difficulty === 'hard' ? 'bg-red-100' : ''}`}
                            >
                                🌳 Hard
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}