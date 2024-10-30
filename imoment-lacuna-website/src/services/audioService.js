class AudioService {
    constructor() {
        this.audioElement = null;
        this.isInitialized = false;
        this.audioContext = null;
        this.gainNode = null;
        this.source = null;
    }

    init(audioElement) {
        this.cleanup();
        this.audioElement = audioElement;

        try {
            // AudioContext 초기화
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.source = this.audioContext.createMediaElementSource(audioElement);

            // 연결: source -> gainNode -> destination
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            // 초기 볼륨 설정
            this.gainNode.gain.value = 0.8;
            this.isInitialized = true;
        } catch (error) {
            console.error('Audio API 초기화 실패:', error);
        }
    }

    cleanup() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        if (this.gainNode) {
            this.gainNode.disconnect();
        }
        if (this.source) {
            this.source.disconnect();
        }

        this.audioElement = null;
        this.gainNode = null;
        this.source = null;
        this.isInitialized = false;
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    }

    fadeOut(duration = 1) {
        return new Promise((resolve) => {
            if (!this.gainNode) {
                this.audioElement?.pause();
                resolve();
                return;
            }

            const currentTime = this.audioContext.currentTime;
            this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

            setTimeout(() => {
                this.audioElement?.pause();
                console.log('페이드아웃 완료');
                resolve();
            }, duration * 1000);
        });
    }
}

export default new AudioService();
