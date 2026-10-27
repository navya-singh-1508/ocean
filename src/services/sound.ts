/**
 * Synthesized Deep Sea Hydrophone Ambient Audio Engine
 * Uses the Web Audio API — completely self-contained with ZERO external audio files.
 */

let audioCtx: AudioContext | null = null
let ambientGain: GainNode | null = null
let noiseNode: AudioNode | null = null
let filterNode: BiquadFilterNode | null = null
let isPlaying = false
let pingIntervalId: number | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Creates low-frequency ocean rumble using brown/pink noise filtering
 */
function createOceanRumble(ctx: AudioContext): AudioNode {
  const bufferSize = ctx.sampleRate * 2
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const output = noiseBuffer.getChannelData(0)
  let lastOut = 0.0

  // Brown noise synthesis
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1
    output[i] = (lastOut + (0.02 * white)) / 1.02
    lastOut = output[i]
    output[i] *= 3.5 // compensation gain
  }

  const whiteNoise = ctx.createBufferSource()
  whiteNoise.buffer = noiseBuffer
  whiteNoise.loop = true

  // Deep ocean low-pass filter (simulates miles of water dampening high frequencies)
  filterNode = ctx.createBiquadFilter()
  filterNode.type = 'lowpass'
  filterNode.frequency.setValueAtTime(140, ctx.currentTime)
  filterNode.Q.setValueAtTime(2.5, ctx.currentTime)

  whiteNoise.connect(filterNode)
  whiteNoise.start()
  return filterNode
}

/**
 * Synthesizes a soft, distant submarine active sonar ping
 */
export function playSonarPing(frequency = 780): void {
  if (!audioCtx || audioCtx.state !== 'running' || !isPlaying) return

  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.96, audioCtx.currentTime + 1.2)

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8)

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.start()
    osc.stop(audioCtx.currentTime + 1.9)
  } catch {
    // Ignore audio errors
  }
}

/**
 * Toggle deep sea ambient sound
 */
export function toggleAmbientSound(onToggle?: (active: boolean) => void): boolean {
  try {
    const ctx = getAudioContext()

    if (isPlaying) {
      if (ambientGain) {
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
        setTimeout(() => {
          if (ambientGain) ambientGain.disconnect()
          if (pingIntervalId) window.clearInterval(pingIntervalId)
          isPlaying = false
          if (onToggle) onToggle(false)
        }, 500)
      }
      return false
    } else {
      ambientGain = ctx.createGain()
      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime)
      ambientGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.0)

      noiseNode = createOceanRumble(ctx)
      noiseNode.connect(ambientGain)
      ambientGain.connect(ctx.destination)

      // Play soft sonar ping every ~14 seconds
      pingIntervalId = window.setInterval(() => {
        playSonarPing(Math.random() > 0.5 ? 820 : 690)
      }, 14000)

      // Initial ping after 1 second
      setTimeout(() => playSonarPing(780), 800)

      isPlaying = true
      if (onToggle) onToggle(true)
      return true
    }
  } catch {
    return false
  }
}

export function isAudioActive(): boolean {
  return isPlaying
}
