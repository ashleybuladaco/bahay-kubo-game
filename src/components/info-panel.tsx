'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Vegetable } from '@/types/game'
import { JSX } from 'react'

interface InfoPanelProps {
    vegetable: Vegetable | null
    isGameInfo?: boolean
    onClose: () => void
}

export function InfoPanel({ vegetable, isGameInfo = false, onClose }: InfoPanelProps): JSX.Element {
    if (isGameInfo) {
        return (
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg bg-gradient-to-br from-green-50 to-yellow-50">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl text-green-800">
                            🏠 About Bahay Kubo Memory Game
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-96">
                        <div className="space-y-4">
                            <div className="p-4 bg-green-100 rounded-lg">
                                <h3 className="font-semibold text-green-800 mb-2">The Song 🎵</h3>
                                <p className="text-sm text-green-700 italic leading-relaxed">
                                    "Bahay kubo, kahit munti,<br />
                                    Ang halaman doon ay sari-sari:<br />
                                    Singkamas at talong, sigarilyas at mani,<br />
                                    Sitaw, bataw, patani..."
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-green-800 mb-1">🎯 How to Play</h4>
                                    <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                                        <li>Click on cards to flip them over</li>
                                        <li>Match two cards with the same vegetable</li>
                                        <li>Learn about each vegetable when you make a match</li>
                                        <li>Complete all pairs to win</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-green-800 mb-1">🌟 Scoring</h4>
                                    <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                                        <li>Easy: 100 points per match</li>
                                        <li>Medium: 150 points per match</li>
                                        <li>Hard: 200 points per match</li>
                                        <li>Time and move bonuses for great performance</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-green-800 mb-1">🎓 Educational Value</h4>
                                    <p className="text-sm text-green-700">
                                        This game teaches Filipino children (and adults!) about traditional vegetables
                                        mentioned in the beloved "Bahay Kubo" song, including their nutritional benefits
                                        and culinary uses in Filipino cooking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        )
    }

    if (!vegetable) return <></>

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-yellow-50">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl text-green-800 flex items-center justify-center gap-2">
                        <span className="text-2xl">{vegetable.emoji}</span>
                        {vegetable.filipinoName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Card className="bg-white/80">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{vegetable.emoji}</div>
                            <h3 className="text-lg font-bold text-green-800 mb-1">
                                {vegetable.filipinoName}
                            </h3>
                            <p className="text-green-600 mb-3">{vegetable.name}</p>
                            <p className="text-sm text-gray-700">{vegetable.description}</p>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Badge className="mb-2 bg-blue-100 text-blue-800">💪 Health Benefits</Badge>
                            <p className="text-sm text-blue-800">{vegetable.nutritionalBenefit}</p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                            <Badge className="mb-2 bg-green-100 text-green-800">🌱 Season</Badge>
                            <p className="text-sm text-green-800">{vegetable.seasonality}</p>
                        </div>

                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Badge className="mb-2 bg-orange-100 text-orange-800">🍽️ Cooking</Badge>
                            <p className="text-sm text-orange-800">{vegetable.culinaryUse}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}