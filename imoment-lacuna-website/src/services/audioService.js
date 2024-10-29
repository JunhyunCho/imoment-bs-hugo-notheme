class AudioService {
    constructor() {
        this.audioElement = null;
        this.isInitialized = false;
    }

    init(audioElement) {
        this.cleanup();
        this.audioElement = audioElement;
        this.audioElement.volume = 0.8; // 기본 볼륨 설정
        this.isInitialized = true;
    }

    cleanup() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement = null;
        }
        this.isInitialized = false;
    }

    setVolume(volume) {
        if (this.audioElement) {
            this.audioElement.volume = volume;
        }
    }

    setLoop(shouldLoop) {
        if (this.audioElement) {
            this.audioElement.loop = shouldLoop;
        }
    }

    fadeOut(duration = 1) {
        return new Promise((resolve) => {
            if (!this.audioElement) {
                resolve();
                return;
            }

            const startVolume = this.audioElement.volume;
            const steps = 30; // 부드러운 페이드를 위한 단계 수
            const stepDuration = (duration * 1000) / steps;
            const volumeStep = startVolume / steps;

            const fadeInterval = setInterval(() => {
                if (this.audioElement.volume > volumeStep) {
                    this.audioElement.volume -= volumeStep;
                } else {
                    clearInterval(fadeInterval);
                    this.audioElement.volume = 0;
                    resolve();
                }
            }, stepDuration);
        });
    }
}

export default new AudioService();
