<template>
    <div class="mail-container">
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
                
                // 자동 재생 시도
                await audio.play().then(() => {
                    // 재생 성공시에만 초기화
                    audioService.init(audio);
                    audioService.setVolume(0.8);
                    console.log('3_1_mail.vue - 알림음 재생 시작');
                    
                    this.showMail = true;
                    this.startSequence();
                }).catch(error => {
                    console.error('mounted: audio.play() 오디오 재생 실패:', error);
                    // cleanup 호출하지 않고 UI 표시만 진행
                    this.showMail = true;
                    this.startSequence();
                });
                
            } catch (error) {
                console.error('3_1_mail.vue - 오디오 재생 실패:', error);
                this.showMail = true;
                this.startSequence();
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
            const audio = this.$root.$refs.mailBGM;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            this.$router.push('/3_2_map');
        },
        startSequence() {
            setTimeout(() => {
                this.showText = true;
                
                setTimeout(() => {
                    this.showMail = false;
                    this.showText = false;
                    
                    setTimeout(() => {
                        audioService.cleanup();
                        this.$router.push('/3_2_map');
                    }, 1000);
                }, 3000);
            }, 1000);
        }
    }
}
</script>

<style scoped>
.mail-container {
    min-height: 100vh;
    position: relative;
    padding: 0;
    margin: 0;
    width: 100vw;
    background-image: url('~@/assets/white_wall_background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20vh;
}

.mail-image {
    width: 50vw;
    cursor: pointer;
    margin-top: 30vh;
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
    transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to,
.fade-long-enter-from,
.fade-long-leave-to {
    opacity: 0;
}
</style>
