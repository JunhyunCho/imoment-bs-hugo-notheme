<template>
    <div class="text-container">
        <button class="test-button" @click="handleTestButtonClick"></button>
        <transition name="fade">
            <div v-if="currentText" class="text">{{ currentText }}</div>
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
import NoSleep from 'nosleep.js';

export default {
    name: 'Scene4View',
    data() {
        return {
            currentText: '',
            texts: [
                '기차 소리가 들리면 \n안내원을 따라 철도원을 찾아주세요.', 
                ' ',
                '저마다의 이야기를 \n이고지고 모이는 존재들이\n정류장 앞에 줄지어 \n순서를 기다리고 있습니다.',
                '떠나세요. 잉여의 도시로',
                '지금 이 장소가 낯선가요?',
                '혹은 익숙하신가요?',
                '여러분이 어쩌면 한 번쯤 \n지나쳤을 수도 있는\n혹은 전혀 방문한 적이 없었던 \n장소일지도 모를 이곳은 \n일종의 평행 세계.',
                '인간의 세계와는 어울리지 않는 것들이\n뒤틀어낸 또 다른 세상',
                '비어있는 시간이 그 어떤 시간보다\n가치 있게 측정되죠.',
                '이곳에는 몇 가지 규칙이 존재합니다.',
                '첫째, 인간의 도시에서 바라보던 시선으로\n그들을 바라보지 마세요.',
                '새로운 시선, 넓어진 시야를 가지고\n잉여의 도시를 감각하세요.',
                '둘째, 옮겨가지 않는 \n나만의 가치가 존재합니다.',
                '그것은 이곳의 아름다움입니다.\n그들을 함부로 평가하지 마세요.',
                '셋째, 잉여의 도시에서 길을 잃는다면\n라쿠나 직원을 찾아주세요.',
                '넷째, 도시의 틈에는 이곳에 머물고 있는\n자들의 흔적이 존재합니다.',
                '여러분은 이제 그 흔적을 \n발견하실 수 있는데요.\n거리를 거닐다 표식을 발견하면 \nQR을 찍어주세요.',
                '자, 이제 잉여의 도시에 진입하겠습니다.',
                '떠나세요. 잉여의 도시로.'
            ],
            currentIndex: 0,
            fadeTransitionTime: 1000,
            displayDurations: [
                10000,  // 0:00 - 0:10
                82000,  // 0:10 - 1:32
                9000,   // 1:32 - 1:42
                9000,   // 1:42 - 1:49
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
                9000    // 3:43 - end
            ],
            showPlayButton: false,
            noSleep: null
        }
    },
    mounted() {
        this.noSleep = new NoSleep();
        this.enableWakeLock();
        this.startTextSequence();
        //this.startMapSequence();
    },
    methods: {
        async startTextSequence() {
            const showText = async () => {
                if (this.currentIndex >= this.texts.length) {
                    await this.startMailSequence();
                    return;
                }
                
                this.currentText = this.texts[this.currentIndex];
                
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.currentText = '';
                        
                        setTimeout(() => {
                            this.currentIndex++;
                            resolve();
                        }, this.fadeTransitionTime);
                    }, this.displayDurations[this.currentIndex] - this.fadeTransitionTime);
                });
                
                showText();
            };
            
            showText();
        },

        async startMailSequence() {
            try {
                await this.showMailUI();
                await this.startMapSequence();
            } catch (error) {
                console.error('메일 시퀀스 실행 중 오류:', error);
                this.startMapSequence();
            }
        },

        async startMapSequence() {
            try {
                await this.showMapUI();
                this.$router.push({ path: '/4_map_single', query: { currentIndex: 10 } });
            } catch (error) {
                console.error('맵 시퀀스 실행 중 오류:', error);
                this.$router.push({ path: '/4_map_single', query: { currentIndex: 10 } });
            }
        },

        async showMailUI() {
            // 메일 이미지와 텍스트 표시 로직
            const mailContainer = document.createElement('div');
            mailContainer.className = 'mail-sequence-container';
            
            // 스타일 추가
            Object.assign(mailContainer.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'inherit',
                zIndex: 1000
            });

            // 메일 이미지 추가
            const mailImage = document.createElement('img');
            mailImage.src = '/lacuna/images/mail.png';
            mailImage.style.width = '50vw';
            mailImage.style.opacity = '0';
            mailImage.style.transition = 'opacity 1s';
            
            // 텍스트 추가
            const mailText = document.createElement('div');
            mailText.textContent = 'K로부터 편지가 도착하였습니다.';
            mailText.style.opacity = '0';
            mailText.style.transition = 'opacity 1s';
            mailText.style.marginTop = '2rem';
            mailText.style.fontSize = '1.5rem';
            
            mailContainer.appendChild(mailImage);
            mailContainer.appendChild(mailText);
            document.body.appendChild(mailContainer);

            // 애니메이션 시퀀스
            await new Promise(resolve => {
                setTimeout(() => {
                    mailImage.style.opacity = '1';
                    
                    setTimeout(() => {
                        mailText.style.opacity = '1';
                        
                        setTimeout(() => {
                            mailImage.style.opacity = '0';
                            mailText.style.opacity = '0';
                            
                            setTimeout(() => {
                                mailContainer.remove();
                                //this.startMapSequence();
                                resolve();
                            }, 1000);
                        }, 3000);
                    }, 1000);
                }, 1000);
            });
        },

        async showMapUI() {
            const mapTexts = [
                ' ',
                '안녕하세요.\nK입니다.',
                '잉여의 도시에 오신 여러분을 환영합니다.',
                '이곳에서 저희는 보이지 않는 틈에서 \n자리를 지키며 살고 있습니다.',
                '잉여의 도시는 인간의 도시와 공존하기 때문에\n저희의 모습을 쉽게 발견하기는 어려웠을 수도 있어요.',
                '이제 우리의 이야기를 들려드릴께요',
                '서계동 곳곳에 우리가 남긴 \n이야기의 흔적이 존재합니다.',
                '지도에서 보이는 표시를 따라 \n우리를 찾으러 오세요'
            ];

            const displayDurations = [
                7000, 3000, 3000, 6000, 8000, 2000, 5000, 4000
            ];

            const mapContainer = document.createElement('div');
            mapContainer.className = 'map-sequence-container';
            Object.assign(mapContainer.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'inherit',
                zIndex: 1000,
                paddingBottom: '20vh',
            });


            const textDiv = document.createElement('div');
            textDiv.style.fontSize = '1.3rem';
            textDiv.style.textAlign = 'center';
            textDiv.style.whiteSpace = 'pre-line';
            textDiv.style.lineHeight = '1.8';
            textDiv.style.opacity = '0';
            textDiv.style.transition = 'opacity 1s';
            textDiv.style.marginTop = '2rem';

            mapContainer.appendChild(textDiv);
            document.body.appendChild(mapContainer);

            // 텍스트 시퀀스 실행
            for (let i = 0; i < mapTexts.length; i++) {
                await new Promise(resolve => {
                    setTimeout(() => {
                        textDiv.textContent = mapTexts[i];
                        textDiv.style.opacity = '1';
                        
                        setTimeout(() => {
                            textDiv.style.opacity = '0';
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        }, displayDurations[i] - 1000);
                    }, 1000);
                });
            }


                setTimeout(() => {
                    mapContainer.remove();
                }, 1000);

        },

        enableWakeLock() {
            document.addEventListener('click', () => {
                this.noSleep.enable();
            }, { once: true });
        }
    },
    beforeUnmount() {
        if (this.noSleep) {
            this.noSleep.disable();
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
</style>
