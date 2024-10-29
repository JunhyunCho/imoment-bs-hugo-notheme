<template>
    <div class="text-container">
        <transition name="fade">
            <img 
                v-if="showMail" 
                src="/lacuna/images/map.png" 
                alt="Map" 
                class="mail-image"
            >
        </transition>
        <transition name="fade">
            <div v-if="currentText" class="text">
                {{ currentText }}
            </div>
        </transition>
    </div>
</template>

<script>
import audioService from '../services/audioService';

export default {
    name: 'Scene4_2View',
    data() {
        return {
            audioInitialized: false,
            showMail: false,
            texts: [
                '안녕하세요. 잉여의 도시에 오신 여러분.',
                '저는 k라고 합니다. \n제가 잉여의 도시로 이주한지 벌써 많은 시간이 흘렀네요.',
                '잉여의 도시는 인간의 도시와 공존하기 때문에',
                '저희의 모습을 쉽게 발견하기는 어려웠을 수도 있어요.',
                '이곳에 머물고 있는 저와 저의 이웃들을 찾아보시고 \n또 저희가 남긴 흔적들을 발견해보세요.'
            ],
            currentText: '',
            currentIndex: 0,
            fadeTransitionTime: 1000,
            displayDurations: [3000, 3000, 3000, 3000, 3000]
        }
    },
    mounted() {
        setTimeout(async () => {
            try {
                const audio = this.$root.$refs.trainBGM;
                
                if (!this.audioInitialized) {
                    audioService.init(audio);
                    this.audioInitialized = true;
                }

                audio.addEventListener('ended', this.handleAudioEnd);

                audioService.setVolume(0.8);
                await audio.play();
                console.log('3_2_map.vue - 나레이션 재생 시작');
                
                this.showMail = true;
                this.startTextSequence();
            } catch (error) {
                console.error('3_2_map.vue - 오디오 재생 실패:', error);
                this.showMail = true;
                this.startTextSequence();
            }
        }, 1000);
    },
    beforeUnmount() {
        const audio = this.$root.$refs.mapBGM;
        if (audio) {
            audio.removeEventListener('ended', this.handleAudioEnd);
            audio.pause();
            audio.currentTime = 0;
        }
    },
    methods: {
        startTextSequence() {
            const showText = () => {
                if (this.currentIndex >= this.texts.length) {
                    return;
                }
                
                this.currentText = this.texts[this.currentIndex];
                
                setTimeout(() => {
                    this.currentText = '';
                    
                    setTimeout(() => {
                        this.currentIndex++;
                        showText();
                    }, this.fadeTransitionTime);
                }, this.displayDurations[this.currentIndex]);
            };
            
            showText();
        },
        handleAudioEnd() {
            console.log('나레이션 재생 완료');
            setTimeout(() => {
                const currentIndex = 0 ; 
                this.$router.push({ path: '/4_map_single', query: { currentIndex } });
            }, 1000);
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

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
