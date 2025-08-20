'use client'

import { useState, useEffect, useCallback, JSX } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GameCard } from '@/components/game-card'
import { GameHeader } from '@/components/game-header'
import { GameStats } from '@/components/game-stats'
import { VictoryModal } from '@/components/victory-modal'
import { InfoPanel } from '@/components/info-panel'
import { NavigationBar } from '@/components/navigation-bar'
import { Scoreboard } from '@/components/scoreboard'
import { Garden } from '@/components/garden'
import { Shop } from '@/components/shop'
import { vegetables } from '@/data/vegetables'
import { createGameDeck, shuffleArray } from '@/lib/game-utils'
import { playSound } from '@/lib/sound-utils'
import { addGameToHistory, addPoints, calculateGameReward } from '@/lib/garden-storage'
import type { Vegetable, GameCard as GameCardType } from '@/types/game'

export default function BahayKuboGame(): JSX.Element {
  const [gameCards, setGameCards] = useState<GameCardType[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [score, setScore] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameCompleted, setGameCompleted] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [matchedVegetable, setMatchedVegetable] = useState<Vegetable | null>(null)

  // New modal states
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false)
  const [showGarden, setShowGarden] = useState<boolean>(false)
  const [showShop, setShowShop] = useState<boolean>(false)

  // Initialize game
  const initializeGame = useCallback((level: 'easy' | 'medium' | 'hard' = 'easy') => {
    const cardCount = level === 'easy' ? 6 : level === 'medium' ? 8 : 10
    const selectedVegetables = vegetables.slice(0, cardCount)
    const deck = createGameDeck(selectedVegetables)
    const shuffledDeck = shuffleArray(deck)

    setGameCards(shuffledDeck)
    setSelectedCards([])
    setMatchedPairs([])
    setScore(0)
    setMoves(0)
    setTimeElapsed(0)
    setGameStarted(true)
    setGameCompleted(false)
    setDifficulty(level)
    setMatchedVegetable(null)

    playSound('gameStart')
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameCompleted])

  // Handle card selection
  const handleCardClick = useCallback((cardId: number) => {
    if (selectedCards.length >= 2 || selectedCards.includes(cardId) || matchedPairs.includes(cardId)) {
      return
    }

    const newSelected = [...selectedCards, cardId]
    setSelectedCards(newSelected)
    playSound('cardFlip')

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1)

      const [card1, card2] = newSelected.map(id => gameCards.find(card => card.id === id)!)

      setTimeout(() => {
        if (card1.vegetableId === card2.vegetableId) {
          // Match found
          setMatchedPairs(prev => [...prev, ...newSelected])
          setScore(prev => prev + (difficulty === 'easy' ? 100 : difficulty === 'medium' ? 150 : 200))
          setMatchedVegetable(vegetables.find(v => v.id === card1.vegetableId)!)
          playSound('match')

          // Show vegetable info for 2 seconds
          setTimeout(() => {
            setMatchedVegetable(null)
          }, 2000)

        } else {
          // No match
          playSound('noMatch')
        }
        setSelectedCards([])
      }, 1000)
    }
  }, [selectedCards, matchedPairs, gameCards, difficulty])

  // Check for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs.length === gameCards.length && gameCards.length > 0) {
      setGameCompleted(true)
      setGameStarted(false)
      playSound('victory')

      // Calculate and award points
      const finalGameScore = score + getPerformanceBonus()
      const { points: earnedPoints, stars } = calculateGameReward(finalGameScore, timeElapsed, moves, difficulty)

      // Add points and save game to history
      addPoints(earnedPoints)
      addGameToHistory({
        difficulty,
        score: finalGameScore,
        moves,
        timeElapsed,
        pointsEarned: earnedPoints,
        stars
      })
    }
  }, [matchedPairs.length, gameCards.length, gameStarted, score, timeElapsed, moves, difficulty])

  // Calculate performance bonus
  const getPerformanceBonus = (): number => {
    if (!gameCompleted) return 0
    const timeBonus = Math.max(0, 300 - timeElapsed) * 10
    const moveBonus = Math.max(0, gameCards.length - moves) * 50
    return timeBonus + moveBonus
  }

  const finalScore = score + getPerformanceBonus()
  const progress = gameCards.length > 0 ? (matchedPairs.length / gameCards.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <NavigationBar
          onOpenScoreboard={() => setShowScoreboard(true)}
          onOpenGarden={() => setShowGarden(true)}
          onOpenShop={() => setShowShop(true)}
        />

        <GameHeader
          score={score}
          moves={moves}
          timeElapsed={timeElapsed}
          onInfoClick={() => setShowInfo(true)}
        />

        {!gameStarted && !gameCompleted && (
          <Card className="mb-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-green-800 mb-2">
                  🏠 Bahay Kubo: Memory ng mga Gulay
                </h1>
                <p className="text-lg text-green-700">
                  Match the vegetables from the beloved Filipino song!
                </p>
              </div>

              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 italic leading-relaxed">
                  "Bahay kubo, kahit munti,<br />
                  Ang halaman doon ay sari-sari..."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => initializeGame('easy')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  🌱 Easy (6 pairs)
                </Button>
                <Button
                  onClick={() => initializeGame('medium')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg"
                >
                  🌿 Medium (8 pairs)
                </Button>
                <Button
                  onClick={() => initializeGame('hard')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  🌳 Hard (10 pairs)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {gameStarted && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-sm">
                Progress: {matchedPairs.length / 2} / {gameCards.length / 2} pairs
              </Badge>
              <Badge variant="outline" className="text-sm capitalize">
                {difficulty} mode
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {gameStarted && (
          <div className={`grid gap-4 ${difficulty === 'easy' ? 'grid-cols-3 sm:grid-cols-4' :
              difficulty === 'medium' ? 'grid-cols-4 sm:grid-cols-4' :
                'grid-cols-4 sm:grid-cols-5'
            } max-w-2xl mx-auto`}>
            {gameCards.map((card) => (
              <GameCard
                key={card.id}
                card={card}
                isSelected={selectedCards.includes(card.id)}
                isMatched={matchedPairs.includes(card.id)}
                onClick={() => handleCardClick(card.id)}
                disabled={selectedCards.length >= 2}
              />
            ))}
          </div>
        )}

        <GameStats
          score={score}
          moves={moves}
          timeElapsed={timeElapsed}
          difficulty={difficulty}
          isVisible={gameStarted}
        />

        {matchedVegetable && (
          <InfoPanel
            vegetable={matchedVegetable}
            onClose={() => setMatchedVegetable(null)}
          />
        )}

        <VictoryModal
          isOpen={gameCompleted}
          onClose={() => setGameCompleted(false)}
          score={finalScore}
          moves={moves}
          timeElapsed={timeElapsed}
          difficulty={difficulty}
          onPlayAgain={() => initializeGame(difficulty)}
          onNewDifficulty={(newDifficulty) => initializeGame(newDifficulty)}
        />

        {showInfo && (
          <InfoPanel
            vegetable={null}
            isGameInfo={true}
            onClose={() => setShowInfo(false)}
          />
        )}

        <Scoreboard
          isOpen={showScoreboard}
          onClose={() => setShowScoreboard(false)}
        />

        <Garden
          isOpen={showGarden}
          onClose={() => setShowGarden(false)}
          onOpenShop={() => {
            setShowGarden(false)
            setShowShop(true)
          }}
        />

        <Shop
          isOpen={showShop}
          onClose={() => setShowShop(false)}
        />
      </div>
    </div>
  )
}