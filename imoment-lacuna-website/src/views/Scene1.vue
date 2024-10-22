<template>
  <div class="scene1-container">
    <h1 class="scene-title">Scene 1</h1>
    <img src="/images/train.png" alt="Train" class="train-image" />

    <img src="/lacuna/images/train.png" alt="Train" class="train-image" />
    <div class="content">
      <p>여기에 Scene 1의 내용을 넣으세요.</p>
    </div>
    <router-link to="/" class="home-link">홈으로</router-link>
    <audio ref="audioPlayer" loop>
      <source src="/audio/bgm.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script>
export default {
  name: 'Scene1View',
  mounted() {
    this.playAudio();
  },
  methods: {
    playAudio() {
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.volume = 0.8; // 볼륨을 50%로 설정
      audioPlayer.play().catch(() => {
        console.log("Auto-play was prevented. Please enable auto-play in your browser settings.");
      });
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

.home-link {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}
</style>
