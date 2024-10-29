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
                    
                    setTimeout(() => {
                        this.showMail = false;
                        this.showText = false;
                        
                        setTimeout(() => {
                            this.$router.push('/3_2_map');
                        }, 1000);
                    }, 3000);
                }, 1000);
                
            } catch (error) {
                console.error('3_1_mail.vue - 오디오 재생 실패:', error);
                this.showMail = true;
                
                setTimeout(() => {
                    this.showText = true;
                    
                    setTimeout(() => {
                        this.showMail = false;
                        this.showText = false;
                        
                        setTimeout(() => {
                            this.$router.push('/3_2_map');
                        }, 1000);
                    }, 3000);
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
            const audio = this.$root.$refs.mailBGM;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            this.$router.push('/3_2_map');
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
