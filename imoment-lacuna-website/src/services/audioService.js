class AudioService {
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.audioSource = null;
        this.audioElement = null;
        this.isInitialized = false;
    }

    init(audioElement) {
        this.cleanup();

        this.audioElement = audioElement;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.audioSource = this.audioContext.createMediaElementSource(audioElement);

        // 오디오 노드 연결
        this.audioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        this.isInitialized = true;
    }

    cleanup() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        // 오디오 노드 연결 해제
        if (this.audioSource) {
            this.audioSource.disconnect();
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
        }

        // AudioContext 정리
        if (this.audioContext) {
            this.audioContext.close();
        }

        // 상태 초기화
        this.audioContext = null;
        this.gainNode = null;
        this.audioSource = null;
        this.audioElement = null;
        this.isInitialized = false;
    }

    async fadeOut(duration = 3) {
        if (!this.gainNode || !this.audioElement) return;

        const currentTime = this.audioContext.currentTime;
        const currentVolume = this.gainNode.gain.value;

        this.gainNode.gain.setValueAtTime(currentVolume, currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

        return new Promise(resolve => {
            setTimeout(() => {
                this.cleanup();
                resolve();
            }, (duration * 1000) + 50);
        });
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    }

    setLoop(shouldLoop) {
        if (this.audioElement) {
            this.audioElement.loop = shouldLoop;
        }
    }
}

export default new AudioService();
