// Audio Utility Functions for Live API (PCM 16kHz input, 24kHz output playback)

export function pcm16ToBase64(inputData: Float32Array): string {
  const pcm16 = new Int16Array(inputData.length);
  for (let i = 0; i < inputData.length; i++) {
    const s = Math.max(-1, Math.min(1, inputData[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isMuted = false;

  constructor(sampleRate: number = 24000) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      this.audioCtx = new AudioCtxClass({ sampleRate });
    }
  }

  public async resumeContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  public playPcmBase64(base64Pcm: string, onEnded?: () => void) {
    if (this.isMuted || !this.audioCtx) return;

    try {
      const float32Data = base64ToFloat32Array(base64Pcm);
      if (float32Data.length === 0) return;

      const audioBuffer = this.audioCtx.createBuffer(1, float32Data.length, this.audioCtx.sampleRate);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);

      const currentTime = this.audioCtx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime + 0.05; // 50ms buffer for seamless jitter prevention
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

      this.activeSources.push(source);

      source.onended = () => {
        const index = this.activeSources.indexOf(source);
        if (index > -1) {
          this.activeSources.splice(index, 1);
        }
        if (onEnded) onEnded();
      };
    } catch (e) {
      console.error('[AudioPlayer] Error playing PCM chunk:', e);
    }
  }

  public interrupt() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // already stopped
      }
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.interrupt();
    }
  }

  public close() {
    this.interrupt();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
