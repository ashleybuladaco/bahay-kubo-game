'use client'

import { useState, useEffect, JSX } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { GameCard } from '@/types/game'

interface GameCardProps {
    card: GameCard
    isSelected: boolean
    isMatched: boolean
    onClick: () => void
    disabled: boolean
}

export function GameCard({ card, isSelected, isMatched, onClick, disabled }: GameCardProps): JSX.Element {
    const [isFlipped, setIsFlipped] = useState<boolean>(false)
    const [showContent, setShowContent] = useState<boolean>(false)

    useEffect(() => {
        if (isSelected || isMatched) {
            setIsFlipped(true)
            setTimeout(() => setShowContent(true), 150)
        } else {
            setShowContent(false)
            setTimeout(() => setIsFlipped(false), 150)
        }
    }, [isSelected, isMatched])

    const handleClick = (): void => {
        if (!disabled && !isMatched && !isSelected) {
            onClick()
        }
    }

    return (
        <div className="relative w-full aspect-square">
            <Card
                className={`
          absolute inset-0 cursor-pointer transition-all duration-300 transform-gpu
          ${isFlipped ? 'rotate-y-180' : 'hover:scale-105'}
          ${isMatched ? 'ring-2 ring-green-400 shadow-lg' : ''}
          ${isSelected ? 'ring-2 ring-blue-400 shadow-lg' : ''}
          ${disabled && !isMatched && !isSelected ? 'cursor-not-allowed opacity-50' : ''}
        `}
                onClick={handleClick}
            >
                <CardContent className="p-0 h-full relative overflow-hidden">
                    {/* Back of card (default state) */}
                    <div className={`
            absolute inset-0 backface-hidden transition-opacity duration-200
            ${isFlipped ? 'opacity-0' : 'opacity-100'}
            bg-gradient-to-br from-green-400 via-green-500 to-green-600
            flex items-center justify-center
          `}>
                        <div className="text-center text-white">
                            <div className="text-3xl sm:text-4xl mb-1">🏠</div>
                            <div className="text-xs font-medium tracking-wider">BAHAY</div>
                            <div className="text-xs font-medium tracking-wider">KUBO</div>
                        </div>
                    </div>

                    {/* Front of card (flipped state) */}
                    <div className={`
            absolute inset-0 backface-hidden transition-opacity duration-200
            ${isFlipped ? 'opacity-100' : 'opacity-0'}
            bg-gradient-to-br from-yellow-50 to-green-50
            flex flex-col items-center justify-center p-2
            ${isMatched ? 'bg-gradient-to-br from-green-100 to-green-200' : ''}
          `}>
                        {showContent && (
                            <div className="text-center h-full flex flex-col justify-center">
                                <div className="text-2xl sm:text-3xl mb-2">
                                    {card.vegetable.emoji}
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-green-800 leading-tight mb-1">
                                    {card.vegetable.filipinoName}
                                </div>
                                <div className="text-xs text-green-600 leading-tight">
                                    {card.vegetable.name}
                                </div>
                                {isMatched && (
                                    <div className="absolute top-1 right-1 text-green-500">
                                        ✓
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Matching animation */}
                    {isMatched && (
                        <div className="absolute inset-0 bg-green-400/20 animate-pulse rounded-lg"></div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}