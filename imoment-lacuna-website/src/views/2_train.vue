<template>
    <div class="train-container">
        <transition name="fade">
            <div v-if="showFirstText" class="text">
                안내자를 따라 철도원을 찾아주세요
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showSecondText" class="text">
                철도원을 찾으셨다면 아래 버튼을 눌러주세요
            </div>
        </transition>
        <transition name="fade">
            <button 
                v-if="showButton"
                @click="handleButtonClick" 
                class="action-button"
                :class="{ 
                    'fade-in': showButton && !isLeaving, 
                    'fade-out': isLeaving,
                    'visible': showButton 
                }"
            >
                다음
            </button>
        </transition>
    </div>
</template>

<script>
import audioService from '../services/audioService';

export default {
    name: 'Scene2View',
    data() {
        return {
            audioInitialized: false,
            showFirstText: false,
            showSecondText: false,
            showButton: false,
            isLeaving: false
        }
    },
    async mounted() {
        try {
            const audio = this.$root.$refs.mailBGM; // 기차 소리
            
            if (!this.audioInitialized) {
                audioService.init(audio);
                this.audioInitialized = true;
            }

            audioService.setVolume(0.8);
            await audio.play();
            console.log('2_train.vue - 기차 소리 재생 시작');

            // 1초 후 첫 번째 텍스트 표시
            setTimeout(() => {
                this.showFirstText = true;
                
                // 5초 후 첫 번째 텍스트 페이드아웃
                setTimeout(() => {
                    this.showFirstText = false;
                    
                    // 1초 후 두 번째 텍스트와 버튼 표시
                    setTimeout(() => {
                        this.showSecondText = true;
                        this.showButton = true;
                    }, 1000);
                }, 5000);
            }, 1000);

        } catch (error) {
            console.error('2_train.vue - 오디오 재생 실패:', error);
        }
    },
    methods: {
        async handleButtonClick() {
            this.isLeaving = true;
            this.$router.push('/3_narration');
        }
    }
}
</script>

<style scoped>
.train-container {
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.text {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 2rem;
    font-family: 'Noto Sans KR', sans-serif;
}

.action-button {
    width: 50%;
    aspect-ratio: 5 / 1;
    background-color: #FFFFFF;
    color: black;
    border: 1px solid black;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
    opacity: 0;
    visibility: hidden;
}

.action-button.visible {
    visibility: visible;
}

.action-button.fade-in {
    opacity: 1;
    transition: opacity 1s ease-in;
}

.action-button.fade-out {
    opacity: 0;
    transition: opacity 1s ease-out;
}

.action-button:hover {
    background-color: #f0f0f0;
    border-color: #333;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
