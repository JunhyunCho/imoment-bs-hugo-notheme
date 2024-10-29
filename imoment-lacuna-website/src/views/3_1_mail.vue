<template>
    <div class="text-container">
        <transition name="fade">
            <img 
                v-if="showMail" 
                src="/lacuna/images/mail.png" 
                alt="Mail" 
                class="mail-image"
                @click="handleMailClick"
            >
        </transition>
        <transition name="fade-long">
            <div v-if="showText" class="text">
                K로부터 편지가 도착하였습니다.<br>
                편지를 눌러주세요
            </div>
        </transition>
    </div>
</template>

<script>
import audioService from '../services/audioService';

export default {
    name: 'Scene4_1View',
    data() {
        return {
            audioInitialized: false,
            showMail: false,
            showText: false
        }
    },
    mounted() {
        setTimeout(async () => {
            try {
                const audio = this.$root.$refs.mailBGM;
                
                if (!this.audioInitialized) {
                    audioService.init(audio);
                    this.audioInitialized = true;
                }

                audioService.setVolume(0.8);
                await audio.play();
                console.log('3_1_mail.vue - 알림음 재생 시작');
                
                this.showMail = true;
                
                setTimeout(() => {
                    this.showText = true;
                }, 1000);
                
            } catch (error) {
                console.error('3_1_mail.vue - 오디오 재생 실패:', error);
                // 오디오 실패해도 시각 요소는 표시
                this.showMail = true;
                setTimeout(() => {
                    this.showText = true;
                }, 1000);
            }
        }, 1000);
    },
    beforeUnmount() {
        const audio = this.$root.$refs.mailBGM;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    },
    methods: {
        handleMailClick() {
            this.$router.push('/3_2_map');
        }
    }
}
</script>

<style scoped>
.text-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100vh;
    width: 100vw;
    padding-top: 20vh;
}

.mail-image {
    width: 50vw;
    cursor: pointer;
}

.text {
    font-size: 1.5rem;
    text-align: center;
    white-space: pre-line;
    line-height: 1.8;
    font-family: 'Noto Sans KR', sans-serif;
    margin-top: 2rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-long-enter-active,
.fade-long-leave-active {
    transition: opacity 2s;
}

.fade-enter-from,
.fade-leave-to,
.fade-long-enter-from,
.fade-long-leave-to {
    opacity: 0;
}
</style>
