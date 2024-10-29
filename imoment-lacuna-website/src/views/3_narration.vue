<template>
    <div class="text-container">
        <!-- 테스트용 투명 버튼 추가 -->
        <button 
            class="test-button"
            @click="handleTestButtonClick"
        ></button>

        <transition name="fade">
            <div v-if="currentText" class="text">
                {{ currentText }}
            </div>
        </transition>
        <!-- 오디오 시간 표시 -->
        <div v-if="audioInitialized" class="time-display">
            {{ formattedTime }}
        </div>
    </div>
</template>

<script>
import audioService from '../services/audioService';

export default {
    name: 'Scene4View',
    data() {
        return {
            audioInitialized: false,
            texts: [
                '기차 소리가 들리면 안내원을 따라 철도원을 찾아주세요.',
                ' ',
                '저마다의 이야기를 이고지고 모이는 존재들이\n정류장 앞에 줄지어 순서를 기다리고 있습니다.',
                '떠나세요. 잉여의 도시로',
                '지금 이 장소가 낯선가요?',
                '혹은 익숙하신가요?',
                '여러분이 어쩌면 한 번쯤 지나쳤을 수도 있는\n혹은 전혀 방문한 적이 없었던 장소일지도\n모를 이곳은 일종의 평행 세계.',
                '인간의 세계와는 어울리지 않는 것들이\n뒤틀어낸 또 다른 세상',
                '비어있는 시간이 그 어떤 시간보다\n가치 있게 측정되죠.',
                '이곳에는 몇 가지 규칙이 존재합니다.',
                '첫째, 인간의 도시에서 바라보던 시선으로\n그들을 바라보지 마세요.',
                '새로운 시선, 넓어진 시야를 가지고\n잉여의 도시를 감각하세요.',
                '둘째, 옮겨가지 않는 나만의 가치가 존재합니다.',
                '그것은 이곳의 아름다움입니다.\n그들을 함부로 평가하지 마세요.',
                '셋째, 잉여의 도시에서 길을 잃는다면\n라쿠나 직원을 찾아주세요.',
                '넷째, 도시의 틈에는 이곳에 머물고 있는\n자들의 흔적이 존재합니다.',
                '여러분은 이제 그 흔적을 발견하실 수 있는데요.\n거리를 거닐다 표식을 발견하면 QR을 찍어주세요.',
                '자 이제 잉여의 도시에 진입하겠습니다.',
                '떠나세요. 잉여의 도시로.'
            ],
            currentText: '',
            currentIndex: 0,
            fadeTransitionTime: 1000, // ms 단위
            displayDurations: [ // 각 텍스트별 표시 시간 (ms 단위)
                10000,  // 0:00 - 0:10
                82000,  // 0:10 - 1:32
                7000,  // 1:32 - 1:42
                7000,   // 1:42 - 1:49
                4000,   // 1:49 - 1:53
                3000,   // 1:53 - 1:56
                13000,  // 1:56 - 2:09
                7000,   // 2:09 - 2:16
                7000,   // 2:16 - 2:23
                5000,   // 2:23 - 2:28
                9000,   // 2:28 - 2:37
                9000,   // 2:37 - 2:46
                6000,   // 2:46 - 2:52
                8000,   // 2:52 - 3:00
                7000,   // 3:00 - 3:07
                11000,  // 3:07 - 3:18
                10000,  // 3:18 - 3:28
                15000,  // 3:28 - 3:43
                5000    // 3:43 - end
            ],
            currentTime: 0
        }
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.currentTime / 60);
            const seconds = Math.floor(this.currentTime % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    mounted() {
        try {
            const audio = this.$root.$refs.S0;
            
            if (!this.audioInitialized) {
                audioService.init(audio);
                this.audioInitialized = true;

                // 시간 업데이트를 위한 이벤트 리스너 추가
                audio.addEventListener('timeupdate', () => {
                    this.currentTime = audio.currentTime;
                });
            }

            // 오디오 종료 이벤트 리스너 추가
            audio.addEventListener('ended', this.handleAudioEnd);

            audioService.setVolume(0.8);
            audio.play();
            console.log('3_narration.vue - 나레이션 재생 시작');
            
            // 오디오 재생 시작 후 텍스트 시퀀스 시작
            this.startTextSequence();
        } catch (error) {
            console.error('3_narration.vue - 오디오 재생 실패:', error);
            // 오디오 실패해도 텍스트는 표시
            this.startTextSequence();
        }
    },
    beforeUnmount() {
        const audio = this.$root.$refs.narrationBGM;
        if (audio) {
            // 이벤트 리스너 제거
            audio.removeEventListener('timeupdate', () => {});
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
            // 마지막 텍스트가 표시되고 나서 1초 후에 라우팅

            setTimeout(() => {
                this.$router.push('/3_1_mail');
            }, 1000);
        },
        handleTestButtonClick() {
            const audio = this.$root.$refs.narrationBGM;
            if (audio) {
                audio.pause();
            }
            this.$router.push('/3_1_mail');
        }
    }
}
</script>

<style scoped>
.text-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: relative; /* 추가 */
}

.text {
    font-size: 1.5rem;
    text-align: center;
    white-space: pre-line;
    line-height: 1.8; /* 줄간격 150% */
    font-family: 'Noto Sans KR', sans-serif;
}

.time-display {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0);
    color: #cdcdcd;
    padding: 5px 10px;
    border-radius: 5px;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 1rem;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity v-bind(fadeTransitionTime + 'ms');
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* 테스트 버튼 스타일 추가 */
.test-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20vh;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 100;
}

/* 테스트용으로 호버 시 약간의 배경색 표시 (선택사항) */
.test-button:hover {
    background: rgba(255, 255, 255, 0.1);
}
</style>
