<template>
    <div class="text-container">
        <button class="test-button" @click="handleTestButtonClick"></button>
        <transition name="fade">
            <div v-show="currentText" class="text">{{ currentText }}</div>
        </transition>
        <transition name="fade">
            <img v-show="showMailImage" src="/lacuna/images/mail.png" class="mail-image" />
        </transition>
        <transition name="fade">
            <button 
                v-if="showPlayButton" 
                @click="handlePlayButtonClick" 
                class="play-button"
            >
                PLAY
            </button>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Scene4View',
    data() {
        return {
            currentText: '',
            sequence: [
                { time: '0:00', text: '기차 소리가 들리면 \n안내원을 따라 철도원을 찾아주세요.' },
                { time: '0:10', text: ' ' },
                { time: '1:32', text: '저마다의 이야기를 \n이고지고 모이는 존재들이\n정류장 앞에 줄지어 \n순서를 기다리고 있습니다.' },
                { time: '1:41', text: '떠나세요. 잉여의 도시로' },
                { time: '1:50', text: '지금 이 장소가 낯선가요?' },
                { time: '1:54', text: '혹은 익숙하신가요?' },
                { time: '1:57', text: '여러분이 어쩌면 한 번쯤 \n지나쳤을 수도 있는\n혹은 전혀 방문한 적이 없었던 \n장소일지도 모를 이곳은 \n일종의 평행 세계.' },
                { time: '2:10', text: '인간의 세계와는 어울리지 않는 것들이\n뒤틀어낸 또 다른 세상' },
                { time: '2:17', text: '비어있는 시간이 그 어떤 시간보다\n가치 있게 측정되죠.' },
                { time: '2:24', text: '이곳에는 몇 가지 규칙이 존재합니다.' },
                { time: '2:29', text: '첫째, 인간의 도시에서 바라보던 시선으로\n그들을 바라보지 마세요.' },
                { time: '2:38', text: '새로운 시선, 넓어진 시야를 가지고\n잉여의 도시를 감각하세요.' },
                { time: '2:47', text: '둘째, 옮겨가지 않는 \n나만의 가치가 존재합니다.' },
                { time: '2:53', text: '그것은 이곳의 아름다움입니다.\n그들을 함부로 평가하지 마세요.' },
                { time: '3:01', text: '셋째, 잉여의 도시에서 길을 잃는다면\n라쿠나 직원을 찾아주세요.' },
                { time: '3:08', text: '넷째, 도시의 틈에는 이곳에 머물고 있는\n자들의 흔적이 존재합니다.' },
                { time: '3:17', text: '여러분은 이제 그 흔적을 \n발견하실 수 있는데요.\n거리를 거닐다 표식을 발견하면 \nQR을 찍어주세요.' },
                { time: '3:29', text: '자, 이제 잉여의 도시에 진입하겠습니다.' },
                { time: '3:35', text: '' },
                { time: '3:44', text: '떠나세요. 잉여의 도시로.' },
                { time: '3:50', text: ' ' },
                { time: '3:54', text: 'K로부터 편지가 도착했습니다.', showMail: true },
                { time: '3:59', text: ' ', showMail: false },  // 5초 후 이미지 제거
                { time: '4:08', text: '안녕하세요.\nK입니다.' },
                { time: '4:11', text: '잉여의 도시에 오신 여러분을 환영합니다.' },
                { time: '4:16', text: '이곳에서 저희는 보이지 않는 틈에서 \n자리를 지키며 살고 있습니다.' },
                { time: '4:23', text: '잉여의 도시는 인간의 도시와 공존하기 때문에\n저희의 모습을 쉽게 발견하기는 어려웠을 수도 있어요.' },
                { time: '4:32', text: '이제 우리의 이야기를 들려드릴께요' },
                { time: '4:36', text: '서계동 곳곳에 우리가 남긴 \n이야기의 흔적이 존재합니다.' },
                { time: '4:41', text: '지도에서 보이는 표시를 따라 \n우리를 찾으러 오세요' },
                { time: '4:45', text: '' }  // 마지막 시점
            ],
            startTimestamp: 0,
            fadeTransitionTime: 1000,
            animationFrameId: null,
            showPlayButton: false,
            showMailImage: false,
            currentOpacity: 1,
        }
    },
    computed: {
        timePointsMs() {
            return this.sequence.map(item => {
                const [minutes, seconds] = item.time.split(':').map(Number);
                return (minutes * 60 + seconds) * 1000;
            });
        }
    },
    mounted() {
        this.startTimestamp = Date.now();
        this.startSequence();
        
        // visibility change 이벤트 리스너 추가
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    beforeUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    },
    methods: {
        startSequence() {
            const updateText = () => {
                const currentTime = Date.now() - this.startTimestamp;
                const currentIndex = this.getCurrentIndex(currentTime);

                if (currentIndex >= this.sequence.length) {
                    this.$router.push({ path: '/4_map_single', query: { currentIndex: 10 } });
                    return;
                }

                const textStartTime = this.timePointsMs[currentIndex];
                const textEndTime = this.timePointsMs[currentIndex + 1] || textStartTime + 5000;
                const fadeStartTime = textEndTime - this.fadeTransitionTime;

                if (currentTime >= fadeStartTime && currentTime < textEndTime) {
                    const progress = (currentTime - fadeStartTime) / this.fadeTransitionTime;
                    this.currentOpacity = 1 - progress;
                } else if (currentTime >= textStartTime && currentTime < textStartTime + this.fadeTransitionTime) {
                    const progress = (currentTime - textStartTime) / this.fadeTransitionTime;
                    this.currentOpacity = progress;
                    this.currentText = this.sequence[currentIndex].text;
                    this.showMailImage = this.sequence[currentIndex].showMail || false;
                } else if (currentTime >= textStartTime + this.fadeTransitionTime && currentTime < fadeStartTime) {
                    this.currentOpacity = 1;
                    this.currentText = this.sequence[currentIndex].text;
                    this.showMailImage = this.sequence[currentIndex].showMail || false;
                } else {
                    this.currentOpacity = 0;
                    if (this.currentOpacity <= 0) {
                        this.currentText = '';
                        this.showMailImage = false;
                    }
                }

                this.animationFrameId = requestAnimationFrame(updateText);
            };

            updateText();
        },

        getCurrentIndex(currentTime) {
            return this.timePointsMs.findIndex((time, index) => {
                const nextTime = this.timePointsMs[index + 1] || Infinity;
                return currentTime >= time && currentTime < nextTime;
            });
        },

        handleVisibilityChange() {
            if (document.hidden) {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                }
            } else {
                const currentIndex = this.getCurrentIndex(Date.now() - this.startTimestamp);
                this.startTimestamp = Date.now() - this.timePointsMs[currentIndex];
                this.startSequence();
            }
        }
    }
}
</script>

<style scoped>
.text-container {
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
    justify-content: center;
    align-items: center;
    padding-bottom: 20vh;
}

.text {
    font-size: 1.3rem;
    text-align: center;
    white-space: pre-line;
    line-height: 1.8;
    font-family: 'Noto Sans KR', sans-serif;
    width: 100%;
    padding: 0 20px;
    opacity: v-bind(currentOpacity);
    transition: opacity v-bind(fadeTransitionTime + 'ms') ease;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity v-bind(fadeTransitionTime + 'ms');
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

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

.test-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.play-button {
    width: 50vw;
    aspect-ratio: 4 / 1;  /* 가로:세로 = 2:1 비율 */
    background-color: transparent;
    border: 1px solid black;
    border-radius: 8px;
    color: black;
    font-size: 1.2rem;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
}

.play-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.mail-image {
    width: 50vw;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: v-bind(currentOpacity);
    transition: opacity v-bind(fadeTransitionTime + 'ms') ease;
}
</style>
