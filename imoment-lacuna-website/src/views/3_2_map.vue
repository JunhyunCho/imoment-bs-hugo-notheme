<template>
    <div class="map-container">
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
            showMail: false,
            texts: [
                ' ',
                '안녕하세요.\nK입니다.',
                '잉여의 도시에 오신 여러분을 환영합니다.',
                '이곳에서 저희는 보이지 않는 틈에서 \n자리를 지키며 살고 있습니다.',
                '잉여의 도시는 인간의 도시와 공존하기 때문에\n저희의 모습을 쉽게 발견하기는 어려웠을 수도 있어요.',
                '이제 우리의 이야기를 들려드릴께요',
                '서계동 곳곳에 우리가 남긴 이야기의 흔적이 존재합니다.',
                '지도에서 보이는 표시를 따라 우리를 찾으러 오세요'
            ],
            currentText: '',
            currentIndex: 0, 
            fadeTransitionTime: 1000,
            displayDurations: [
                8000,   // 0:00 - 0:09
                3000,   // 0:09 - 0:12
                3000,   // 0:12 - 0:16
                6000,   // 0:16 - 0:23
                8000,   // 0:23 - 0:32
                2000,   // 0:32 - 0:35
                5000,    // 0:35 - 0:41
                4000,   // 0:41 - 0:45
            ]
        }
    },
    mounted() {
        setTimeout(async () => {
            try {
                const audio = this.$root.$refs.mailFromK;
                console.log('Audio element:', audio);
                
                // 오디오 초기화 및 재생
                audioService.init(audio);
                audioService.setVolume(0.8);
                
                // ended 이벤트는 audio 엘리먼트에 직접 추가
                audio.addEventListener('ended', this.handleAudioEnd);
                
                await audio.play();
                console.log('3_2_map.vue - 나레이션 재생 시작');
                
                this.showMail = false; //굳이 지도 표시 안해도 될듯. 
                this.startTextSequence();
            } catch (error) {
                console.error('3_2_map.vue - 오디오 재생 실패:', error);
                this.showMail = false;
                this.startTextSequence();
            }
        }, 1000);
    },
    beforeUnmount() {
        const audio = this.$root.$refs.mailFromK;  // mailFromK로 수정
        if (audio) {
            audio.removeEventListener('ended', this.handleAudioEnd);
            audioService.cleanup();  // audioService cleanup 호출
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
        async handleAudioEnd() {
            console.log('나레이션 재생 완료');
            try {
                await audioService.fadeOut(1);  // 1초 동안 페이드아웃
                setTimeout(() => {
                    const currentIndex = 0;
                    this.$router.push({ path: '/4_map_single', query: { currentIndex } });
                }, 1000);
            } catch (error) {
                console.error('페이드아웃 실패:', error);
                // 에러가 발생해도 다음 화면으로 이동
                this.$router.push({ path: '/4_map_single', query: { currentIndex: 0 } });
            }
        }
    }
}
</script>

<style scoped>
.map-container {
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
    justify-content: center;
    align-items: center;
    padding-bottom: 20vh;
}

.mail-image {
    width: 50vw;
}

.text {
    font-size: 1.3rem;
    text-align: center;
    white-space: pre-line;
    line-height: 1.8;
    font-family: 'Noto Sans KR', sans-serif;
    width: 100%;
    padding: 0 20px;
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
