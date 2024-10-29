<template>
  <div class="entry-container">
      <div class="content">
          <h3 class="instruction-text">
              본 공연은 소리와 영상이 함께 제공됩니다.<br>
              이어폰을 착용하시고 <br>
              아래 버튼을 눌러서 소리가 적절히 들리게끔<br>
              볼륨을 조절해주세요.
          </h3>
          <button 
              @click="audioEnabled ? goToEntry() : enableAudio()" 
              class="audio-button"
          >
              {{ audioEnabled ? '입장하기' : '오디오 재생' }}
          </button>
      </div>
      <div class="group-indicator">
          {{ userGroup }} Group
      </div>
  </div>
</template>

<script>
// import WebSocketComponent from '../components/WebSocketComponent.vue'
import websocketService from '../services/websocketService';
import audioService from '../services/audioService';

export default {
  name: 'HomeView',
  // components: {
  //     WebSocketComponent
  // },
  data() {
      return {
          audioEnabled: false,
          userGroup: null // 그룹 정보 저장
      }
  },
  mounted() {
      // 오디오 초기 설정
      const audio = this.$root.$refs.testBGM;
      audio.volume = 0.8;
      // WebSocket 리스너 등록
      websocketService.addMessageListener('1_test', this.handleSceneMessage);
      websocketService.connect();
  },
  beforeUnmount() {
      const audio = this.$root.$refs.testBGM;
      if (audio) {
          //audio.pause();
          //audio.currentTime = 0;
      }
      // 리스너 제거
      websocketService.removeMessageListener('1_test');
  },
  methods: {
      async enableAudio() {
          this.audioEnabled = true;
          console.log('오디오 활성화');

          const audio = this.$root.$refs.testBGM;
          try {
              audioService.init(audio);
              audioService.setVolume(0.8);
              await audio.play();
              console.log('오디오 재생 성공');
          } catch (error) {
              console.error('오디오 재생 실패:', error);
          }
      },
      async goToScene1() {
          try {
              await this.playScene1Audio();
              this.$router.push('/1_test');  // 여기를 수정
          } catch (error) {
              console.error('Scene1 이동 중 오류 발생:', error);
          }
      },
      async handleSceneMessage(message) {
          try {
              const data = JSON.parse(message);
              
              if (data.group) {
                  this.userGroup = data.group;
                  localStorage.setItem('userGroup', this.userGroup);
                  console.log('1_entry.vue - Assigned to group:', this.userGroup);
              }
              else if (message === 'Scene1') {
                  if (this.audioEnabled) {
                      try {
                          await this.playScene1Audio();
                      } catch (error) {
                          console.error('오디오 재생 실패:', error);
                      }
                  }
                  this.$router.push('/scene1');
              }
          } catch (error) {
              console.error('1_entry.vue - 메시지 처리 중 오류:', error);
          }
      },
      goToEntry() {
          
          // 동시에 페이드아웃 시작
          const audio = this.$root.$refs.testBGM;
          if (audio) {
              audioService.fadeOut(3).catch(error => {
                  console.error('오디오 페이드아웃 실패:', error);
              });
          }

          // 먼저 라우팅 시작
          this.$router.push('/1_entry');
      }
  }
}
</script>

<style scoped>
.entry-container {
  min-height: 105vh;
  position: relative;
  padding: 20px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30vh;
}

.instruction-text {
    text-align: center;
    line-height: 1.6;
    margin-bottom: 40px;
    font-weight: normal;
}

.audio-button {
    width: 50%;
    aspect-ratio: 5 / 1;
    background-color: #FFFFFF;
    color: black;
    border: 1px solid black;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s;
}

.audio-button:hover {
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
