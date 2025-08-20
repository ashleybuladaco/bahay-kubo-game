'use client'

import { useState, useEffect, JSX } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy, Star, Clock, Target, Calendar, Award } from 'lucide-react'
import { getGameHistory, getGardenStats } from '@/lib/garden-storage'
import type { GameHistory, GardenStats } from '@/types/garden'

interface ScoreboardProps {
    isOpen: boolean
    onClose: () => void
}

export function Scoreboard({ isOpen, onClose }: ScoreboardProps): JSX.Element | null {
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
    const [gardenStats, setGardenStats] = useState<GardenStats | null>(null)

    useEffect(() => {
        if (isOpen) {
            setGameHistory(getGameHistory())
            setGardenStats(getGardenStats())
        }
    }, [isOpen])

    if (!isOpen) return null

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'hard': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const renderStars = (count: number): JSX.Element => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3].map(star => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= count ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        )
    }

    const bestGame = gameHistory.reduce((best, game) =>
        game.score > (best?.score || 0) ? game : best,
        null as GameHistory | null
    )

    const totalPoints = gardenStats?.totalPoints || 0
    const totalGames = gardenStats?.totalGamesPlayed || 0
    const avgScore = totalGames > 0 ? Math.round(gameHistory.reduce((sum, game) => sum + game.score, 0) / totalGames) : 0

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-yellow-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                            <Trophy className="w-6 h-6" />
                            📊 Bahay Kubo Scoreboard
                        </CardTitle>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-green-700 hover:text-green-900"
                        >
                            ✕
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <Tabs defaultValue="stats" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="stats" className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Stats
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                History
                            </TabsTrigger>
                            <TabsTrigger value="records" className="flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                Records
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="stats" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl font-bold text-green-800 mb-2">{totalPoints}</div>
                                        <div className="text-sm font-medium text-green-700">🌱 Binhi Points</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl font-bold text-yellow-800 mb-2">{totalGames}</div>
                                        <div className="text-sm font-medium text-yellow-700">🎮 Games Played</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl font-bold text-blue-800 mb-2">{gardenStats?.gardenLevel || 1}</div>
                                        <div className="text-sm font-medium text-blue-700">🏡 Garden Level</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl font-bold text-purple-800 mb-2">{avgScore}</div>
                                        <div className="text-sm font-medium text-purple-700">⭐ Avg Score</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl font-bold text-pink-800 mb-2">{gardenStats?.totalVegetablesHarvested || 0}</div>
                                        <div className="text-sm font-medium text-pink-700">🥕 Harvested</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl font-bold text-indigo-800 mb-2">{gardenStats?.unlockedVegetables.length || 0}</div>
                                        <div className="text-sm font-medium text-indigo-700">🔓 Unlocked</div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="history" className="mt-6">
                            <ScrollArea className="h-96">
                                {gameHistory.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p>No games played yet!</p>
                                        <p className="text-sm">Start playing to build your history 🎮</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {gameHistory.map(game => (
                                            <Card key={game.id} className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <Badge className={getDifficultyColor(game.difficulty)}>
                                                                {game.difficulty.toUpperCase()}
                                                            </Badge>
                                                            {renderStars(game.stars)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatDate(game.timestamp)}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Trophy className="w-4 h-4 text-yellow-600" />
                                                            <span>{game.score} pts</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-blue-600" />
                                                            <span>{formatTime(game.timeElapsed)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Target className="w-4 h-4 text-green-600" />
                                                            <span>{game.moves} moves</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">🌱</span>
                                                            <span className="font-medium text-green-700">+{game.pointsEarned}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="records" className="mt-6">
                            {bestGame ? (
                                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 mb-6">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-yellow-800 flex items-center gap-2">
                                            <Trophy className="w-6 h-6" />
                                            🏆 Best Performance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-800">{bestGame.score}</div>
                                                <div className="text-sm text-yellow-700">Highest Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-800">{formatTime(bestGame.timeElapsed)}</div>
                                                <div className="text-sm text-blue-700">Time Taken</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-800">{bestGame.moves}</div>
                                                <div className="text-sm text-green-700">Moves Used</div>
                                            </div>
                                            <div className="text-center">
                                                <Badge className={getDifficultyColor(bestGame.difficulty)}>
                                                    {bestGame.difficulty}
                                                </Badge>
                                                <div className="mt-2">{renderStars(bestGame.stars)}</div>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4 text-sm text-gray-600">
                                            Achieved on {formatDate(bestGame.timestamp)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>No records yet!</p>
                                    <p className="text-sm">Play some games to set your first record 🎯</p>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <Card className="text-center p-4">
                                    <div className="text-lg font-bold text-green-800">
                                        {gameHistory.filter(g => g.difficulty === 'easy').length}
                                    </div>
                                    <div className="text-sm text-green-700">Easy Wins</div>
                                </Card>
                                <Card className="text-center p-4">
                                    <div className="text-lg font-bold text-yellow-800">
                                        {gameHistory.filter(g => g.difficulty === 'medium').length}
                                    </div>
                                    <div className="text-sm text-yellow-700">Medium Wins</div>
                                </Card>
                                <Card className="text-center p-4">
                                    <div className="text-lg font-bold text-red-800">
                                        {gameHistory.filter(g => g.difficulty === 'hard').length}
                                    </div>
                                    <div className="text-sm text-red-700">Hard Wins</div>
                                </Card>
                                <Card className="text-center p-4">
                                    <div className="text-lg font-bold text-purple-800">
                                        {gameHistory.filter(g => g.stars === 3).length}
                                    </div>
                                    <div className="text-sm text-purple-700">Perfect Games</div>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}