<template>
    <div class="entry-container">
        <div class="content">
            <img src="/lacuna/images/1_lacuna.png" alt="Lacuna" class="lacuna-image">
            <button 
                @click="handleButtonClick" 
                class="action-button"
                :class="{ 
                    'fade-in': showButton && !isLeaving, 
                    'fade-out': isLeaving,
                    'visible': showButton 
                }"
            >
                입장하기
            </button>
        </div>
    </div>
</template>

<script>
//import audioService from '../services/audioService';

export default {
    name: 'HomeView',

    data() {
        return {
            showButton: false,
            isLeaving: false
        }
    },
    mounted() {
        setTimeout(() => {
            this.showButton = true;
        }, 1000);



    },
    beforeUnmount() {
        // audioService.cleanup(); // 필요한 경우에만 사용
    },
    methods: {
        async handleButtonClick() {
            this.isLeaving = true;
            
            try {
                // 3초 동안 페이드아웃
                //await audioService.fadeOut(3);
                
                // 페이드아웃 완료 후 라우팅
                this.$router.push('/3_narration');
            } catch (error) {
                console.error('오디오 페이드아웃 실패:', error);
                // 에러가 발생해도 다음 화면으로 이동
                this.$router.push('/3_narration');
            }
        }
    }
}
</script>

<style scoped>
.entry-container {
    min-height: 105vh;
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

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30vh;
}

.lacuna-image {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 10vh;
    transform: translateX(-50%);
}

.action-button {
    width: 50%;
    aspect-ratio: 5 / 1;
    background-color: #FFFFFF00;
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
    transition: opacity 3s ease-out;  /* 3초 동안 페이드아웃 */
}

.action-button:hover {
    background-color: #f0f0f0;
    border-color: #333;
}

.group-indicator {
    position: absolute;
    bottom: 20px;
    right: 20px;
    color: #808080;
    font-size: 14px;
}
</style>
