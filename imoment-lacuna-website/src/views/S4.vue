<template>
    <div class="container">


        <!-- 기존 아이템 렌더링 -->
        <div v-for="item in items" :key="item.id" 
            class="item"
            :class="{ 
                'fade-in': item.isFadeIn,
                'fade-out': item.isFadeOut 
            }"
            :style="item.style"
        >
            <img :src="`/lacuna/images/items/${item.imageNumber}.png`" :alt="`item ${item.imageNumber}`">
        </div>

        <!-- 기존 버튼 -->
        <button 
            v-if="!isLeaving" 
            @click="handleButtonClick" 
            class="action-button"
            :class="{ 
                'fade-in': showButton && !isLeaving, 
                'fade-out': isLeaving,
                'visible': showButton 
            }"
        >
            관객들이 준비되면 눌러주세요
        </button>
    </div>
</template>

<script>
import audioService from '../services/audioService';

export default {
    name: 'Scene6View',
    data() {
        return {
            showButton: false,
            isLeaving: false,
            items: [],
            positions: [
                { top: '10%', left: '10%' },
                { top: '50%', left: '10%' },
                { top: '80%', left: '10%' },
                { top: '10%', left: '70%' },
                { top: '50%', left: '70%' },
                { top: '80%', left: '70%' }
            ],
            currentPositionIndex: 0,
            animationInterval: null
        }
    },
    mounted() {
        setTimeout(() => {
            this.showButton = true;
        }, 1000);

        this.startItemAnimation();
    },
    methods: {
        async handleButtonClick() {

            this.isLeaving = true;
            
            try {
                const audio = this.$root.$refs.S4;
                audioService.init(audio);
                audioService.setVolume(0.8);
                
                // 오디오 종료 이벤트 리스너 추가
                audio.addEventListener('ended', this.handleAudioEnd);
                
                await audio.play();
                console.log('오디오 재생 성공');
            } catch (error) {
                console.error('오디오 재생 실패:', error);
                this.handleAudioEnd(); // 오류 발생시에도 다음 화면으로 이동
            }
        },
        
        handleAudioEnd() {
            // 4_map_single 뷰로 이동할 때 숫자 넘기기
            const currentIndex = 4 ; 
            this.$router.push({ path: '/4_map_single', query: { currentIndex } });
        },

        getRandomImageNumber() {
            return Math.floor(Math.random() * 11) + 1; // 1-11 사이의 랜덤 숫자
        },

        getRandomSize() {
            return Math.floor(Math.random() * (300) + 800); 
        },

        // 랜덤 위치 선택 메서드 추가
        getRandomPosition() {
            // 현재 사용 중인 position 인덱스들 수집
            const usedIndices = this.items.map(item => item.positionIndex);

            // 사용 가능한 인덱스 필터링
            const availableIndices = Array.from(
                { length: this.positions.length }, 
                (_, i) => i
            ).filter(i => !usedIndices.includes(i));

            // 사용 가능한 인덱스가 없으면 전체 중에서 랜덤 선택
            if (availableIndices.length === 0) {
                const randomIndex = Math.floor(Math.random() * this.positions.length);
                return {
                    position: this.positions[randomIndex],
                    index: randomIndex
                };
            }

            // 사용 가능한 인덱스 중에서 랜덤 선택
            const randomIndex = availableIndices[
                Math.floor(Math.random() * availableIndices.length)
            ];
            
            return {
                position: this.positions[randomIndex],
                index: randomIndex
            };
        },

        async showItem() {
            if (this.isLeaving) return;

            // 랜덤 포지션과 인덱스 가져오기
            const { position, index } = this.getRandomPosition();
            const randomImageNumber = this.currentImageNumber || 1;
            this.currentImageNumber = randomImageNumber >= 11 ? 1 : randomImageNumber + 1;
            const randomSize = this.getRandomSize();
            
            const item = {
                id: Date.now(),
                imageNumber: randomImageNumber,
                isFadeIn: false,
                isFadeOut: false,
                positionIndex: index, // 포지션 인덱스 저장
                style: {
                    ...position,
                    width: `${randomSize}px`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                }
            };

            this.items.push(item);
            await this.$nextTick();
            item.isFadeIn = true;
            //position log - index and real position
            console.log(item.positionIndex, item.style);
            // Fade in
            // if (this.items[this.items.length - 1]) {
            //     console.log(this.items, this.items.length);
            //     this.items[this.items.length - 1].isFadeIn = true;
            // }

            // Fade out 첫 번째 아이템
            setTimeout(() => {
               // console.log(this.items, this.items.length);
                if (this.items[0]) {
                    console.log('fade out', this.items[0].positionIndex, 'of', this.items.length);
                    this.items[0].isFadeIn = false;
                    this.items[0].isFadeOut = true;
                    
                    // 요소 제거
                    setTimeout(() => {
                        if (this.items.length > 0) {
                            this.items.shift();  // 배열의 첫 번째 요소 제거
                        }
                    }, 5000);
                }
            }, 5000);
        },

        startItemAnimation() {
            // 첫 번째 아이템 즉시 생성
            this.showItem();
            
            
            // 2초마다 새 아이템 생성
            const intervalId = setInterval(() => {
                if (this.isLeaving) {
                    // 페이지를 떠날 때 interval 정리
                    clearInterval(intervalId);
                    return;
                }
                this.showItem();
            }, 3000);

            // 컴포넌트가 제거될 때 정리하기 위해 intervalId 저장
            this.animationInterval = intervalId;
            
        }
    },
    beforeUnmount() {
        const audio = this.$root.$refs.trainBGM;
        if (audio) {
            audio.removeEventListener('ended', this.handleAudioEnd);
        }

        // interval 정리 추가
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}
</script>

<style scoped>
.container {
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
    position: absolute;
    top: 65vh;
    left: 50%;
    transform: translateX(-50%);
}

.action-button.visible {
    visibility: visible;
}

.action-button.fade-in {
    opacity: 1;
    transition: opacity 2s ease-in;
}

.action-button.fade-out {
    opacity: 0;
    transition: opacity 2s ease-out;
}

.action-button:hover {
    background-color: #f0f0f0;
    border-color: #333;
}

.item {
    position: absolute;
    opacity: 0;
}

.item.fade-in {
    opacity: 0.5;
    transition: opacity 2s ease-in;
}

.item.fade-out {
    opacity: 0;
    transition: opacity 1s ease-out;
}

.item img {
    width: 100%;
    height: auto;
}

/* 테스트 이미지를 위한 스타일 추가 */
.test-image {
    position: absolute;
    width: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
}
</style>
