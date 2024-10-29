<template>
    <div class="video-container">
        <video 
            ref="videoPlayer"
            class="video-player"
            autoplay
            controls
            @ended="handleVideoEnd"
        >
            <source src="/lacuna/video/vid_1.mp4" type="video/mp4">
            브라우저가 비디오를 지원하지 않습니다.
        </video>
        <router-link 
            v-if="showButton" 
            to="/4_map" 
            class="return-button"
        >
            지도로 돌아가기
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'Scene5View',
    data() {
        return {
            showButton: false
        }
    },
    methods: {
        handleVideoEnd() {
            this.showButton = true;
        }
    },
    mounted() {
        const video = this.$refs.videoPlayer;
        if (video) {
            video.play().catch(error => {
                console.error('비디오 재생 실패:', error);
            });
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
}

.video-player {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.return-button {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 30px;
    background-color: rgba(255, 255, 255, 0.9);
    color: black;
    text-decoration: none;
    border-radius: 5px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    z-index: 10;
}

.return-button:hover {
    background-color: white;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}
</style>
