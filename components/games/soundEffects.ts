// Minimalist Web Audio API sound synthesis for retro arcade mini-games
// Zero external assets, instant loading, auto-clean up

class SoundEffects {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    // Sound is enabled by default with subtle pleasant volume
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("game_sfx_muted")
      this.muted = saved === "true"
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }
  }

  public isMuted(): boolean {
    return this.muted
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    if (typeof window !== "undefined") {
      localStorage.setItem("game_sfx_muted", this.muted ? "true" : "false")
    }
    return this.muted
  }

  public playBlip(freq = 440, type: OscillatorType = "sine", duration = 0.08, vol = 0.08) {
    if (this.muted) return
    try {
      this.initContext()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(vol, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Audio context might be blocked before user interaction
    }
  }

  public hit() {
    this.playBlip(520, "triangle", 0.06, 0.08)
  }

  public bounce() {
    this.playBlip(320, "sine", 0.05, 0.07)
  }

  public score() {
    this.playBlip(680, "sine", 0.1, 0.1)
    setTimeout(() => this.playBlip(880, "sine", 0.12, 0.1), 80)
  }

  public win() {
    const notes = [523, 659, 784, 1046]
    notes.forEach((f, i) => {
      setTimeout(() => this.playBlip(f, "triangle", 0.15, 0.1), i * 100)
    })
  }

  public lose() {
    const notes = [380, 320, 260, 200]
    notes.forEach((f, i) => {
      setTimeout(() => this.playBlip(f, "sawtooth", 0.12, 0.06), i * 90)
    })
  }

  public jump() {
    this.playBlip(480, "sine", 0.08, 0.08)
  }

  public whack() {
    this.playBlip(240, "square", 0.08, 0.07)
    setTimeout(() => this.playBlip(440, "triangle", 0.06, 0.08), 30)
  }
}

export const sfx = new SoundEffects()
