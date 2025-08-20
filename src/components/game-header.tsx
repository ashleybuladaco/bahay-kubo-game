'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/game-utils'
import { JSX } from 'react'

interface GameHeaderProps {
    score: number
    moves: number
    timeElapsed: number
    onInfoClick: () => void
}

export function GameHeader({ score, moves, timeElapsed, onInfoClick }: GameHeaderProps): JSX.Element {
    return (
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl">🏠</div>
                        <div>
                            <h1 className="text-xl font-bold text-green-800">
                                Bahay Kubo Memory
                            </h1>
                            <p className="text-sm text-green-600">
                                Memory ng mga Gulay
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="text-yellow-600">🏆</span>
                                <span>{score}</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <span className="text-blue-600">👆</span>
                                <span>{moves}</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <span className="text-purple-600">⏱️</span>
                                <span>{formatTime(timeElapsed)}</span>
                            </Badge>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onInfoClick}
                            className="text-green-700 border-green-300 hover:bg-green-50"
                        >
                            ℹ️ Info
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}