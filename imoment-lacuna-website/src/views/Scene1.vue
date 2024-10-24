<template>
  <div class="scene1-container">
    <h1 class="scene-title">Scene 1</h1>
    <img src="/lacuna/images/train.png" alt="Train" class="train-image" />
    <div class="content">
      <p>여기에 Scene 1의 내용을 넣으세요.</p>
    </div>
    <div class="button-container">
      <button @click="toggleAudio" class="audio-button">
        {{ isPlaying ? '음악 끄기' : '음악 켜기' }}
      </button>
      <button @click="$router.push('/')" class="home-link">홈으로</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scene1View',
  data() {
    return {
      isPlaying: true
    }
  },
  methods: {
    toggleAudio() {
      const audio = this.$root.$refs.audioElement;
      if (!audio) {
        console.error('오디오 요소를 찾을 수 없습니다.');
        return;
      }
      
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          console.error('오디오 재생 실패:', error);
        });
      }
      this.isPlaying = !this.isPlaying;
    }
  },
  mounted() {
    // 컴포넌트 마운트 시 현재 오디오 상태 확인
    const audio = document.querySelector('audio');
    if (audio) {
      console.log('scene1 mounted : audio 찾음');
      this.isPlaying = !audio.paused;
    }
  }
}
</script>

<style scoped>
.scene1-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.scene-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.train-image {
  width: 70%; /* 가로 기준으로 70% 크기 */
  max-width: 600px; /* 최대 너비를 설정하여 너무 커지지 않도록 함 */
  height: auto; /* 비율을 유지하기 위해 자동으로 높이 조정 */
  margin-bottom: 20px; /* 이미지와 다른 요소 간의 간격 */
}

.content {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  gap: 10px; /* 버튼 사이의 간격 */
}

.audio-button {
  background-color: #2196F3; /* 파란색으로 구분 */
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.home-link {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.audio-button:hover, .home-link:hover {
  opacity: 0.9;
}
</style>
