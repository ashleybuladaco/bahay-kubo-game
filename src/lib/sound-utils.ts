// Simple sound system using Web Audio API
class GameSounds {
    private audioContext: AudioContext | null = null
    private sounds: Map<string, AudioBuffer> = new Map()

    private async getAudioContext(): Promise<AudioContext> {
        if (!this.audioContext) {
            this.audioContext = new (
  window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
)()
        }

        // Resume context if suspended (required for user gesture)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume()
        }

        return this.audioContext
    }

    private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
        if (!this.audioContext) {
            throw new Error('Audio context not initialized')
        }

        const sampleRate = this.audioContext.sampleRate
        const numSamples = duration * sampleRate
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
        const channelData = buffer.getChannelData(0)

        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate
            let sample = 0

            switch (type) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t)
                    break
                case 'square':
                    sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
                    break
                case 'triangle':
                    sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
                    break
                default:
                    sample = Math.sin(2 * Math.PI * frequency * t)
            }

            // Apply envelope (fade in/out)
            const envelope = Math.min(t * 10, (duration - t) * 10, 1)
            channelData[i] = sample * envelope * 0.3 // Keep volume reasonable
        }

        return buffer
    }

    async initialize(): Promise<void> {
        try {
            const context = await this.getAudioContext()

            // Create different tones for different actions
            this.sounds.set('cardFlip', this.createTone(800, 0.1, 'sine'))
            this.sounds.set('match', this.createTone(600, 0.3, 'sine'))
            this.sounds.set('noMatch', this.createTone(200, 0.2, 'square'))
            this.sounds.set('victory', this.createTone(523, 0.5, 'sine')) // C note
            this.sounds.set('gameStart', this.createTone(440, 0.3, 'triangle')) // A note
        } catch (error) {
            console.warn('Could not initialize audio:', error)
        }
    }

    async play(soundName: string): Promise<void> {
        try {
            const context = await this.getAudioContext()
            const buffer = this.sounds.get(soundName)

            if (!buffer) {
                await this.initialize()
                const retryBuffer = this.sounds.get(soundName)
                if (!retryBuffer) return
            }

            const source = context.createBufferSource()
            const gainNode = context.createGain()

            source.buffer = buffer || this.sounds.get(soundName)!
            source.connect(gainNode)
            gainNode.connect(context.destination)

            // Set volume
            gainNode.gain.value = 0.1

            source.start(0)
        } catch (error) {
            // Silently fail for sounds - they're not critical
            console.warn('Could not play sound:', soundName, error)
        }
    }
}

const gameSounds = new GameSounds()

export async function playSound(soundName: string): Promise<void> {
    await gameSounds.play(soundName)
}

export async function initializeSounds(): Promise<void> {
    await gameSounds.initialize()

}
