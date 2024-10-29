class AudioService {
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.audioSource = null;
        this.audioElement = null;
        this.isInitialized = false;
    }

    init(audioElement) {
        if (this.isInitialized) return;

        this.audioElement = audioElement;  // audioElement 저장
        this.audioElement.loop = false;  // loop 비활성화
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.audioSource = this.audioContext.createMediaElementSource(audioElement);

        // 오디오 노드 연결
        this.audioSource.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        this.isInitialized = true;
    }

    async fadeOut(duration = 3) {
        if (!this.gainNode || !this.audioElement) return;

        const currentTime = this.audioContext.currentTime;
        const currentVolume = this.gainNode.gain.value;

        // 현재 볼륨에서 시작
        this.gainNode.gain.setValueAtTime(currentVolume, currentTime);
        // 페이드아웃
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

        // audioContext 시간 기준으로 정확히 페이드아웃이 끝나는 시점에 오디오 정지
        return new Promise(resolve => {
            setTimeout(() => {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
                resolve();
            }, (duration * 1000) + 50); // 약간의 여유 시간 추가
        });
    }

    setVolume(value) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
        }
    }

    cleanup() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.gainNode = null;
            this.audioSource = null;
            this.audioElement = null;
            this.isInitialized = false;
        }
    }

    // loop 설정을 위한 새로운 메서드
    setLoop(shouldLoop) {
        if (this.audioElement) {
            this.audioElement.loop = shouldLoop;
        }
    }
}

export default new AudioService();
