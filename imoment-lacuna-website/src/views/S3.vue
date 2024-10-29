<template>
    <div class="video-container">
        <video 
            ref="videoPlayer"
            class="video-player"
            @ended="handleVideoEnd"
        >
            <source src="/lacuna/video/S3.mp4" type="video/mp4">
            브라우저가 비디오를 지원하지 않습니다.
        </video>
        <button 
            v-if="!isPlaying" 
            @click="handlePlayClick" 
            class="play-button"
        >
            PLAY
        </button>
    </div>
</template>

<script>
export default {
    name: 'Scene3View',
    data() {
        return {
            isPlaying: false
        }
    },
    methods: {
        handleVideoEnd() {
            const currentIndex = 3;
            this.$router.push({ 
                path: '/4_map_single', 
                query: { currentIndex } 
            });
        },
        handlePlayClick() {
            const video = this.$refs.videoPlayer;
            if (video) {
                this.isPlaying = true;
                video.play().catch(error => {
                    console.error('비디오 재생 실패:', error);
                    this.handleVideoEnd();
                });
            }
        }
    }
}
</script>

<style scoped>
.video-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
}

.video-player {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.play-button {
    position: absolute;
    width: 50%;
    aspect-ratio: 5 / 1;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
    top: 70vh;
    left: 50%;
    transform: translateX(-50%);
}
.play-button:hover {
    background-color: #f0f0f0;
    border-color: #333;
}
</style>
