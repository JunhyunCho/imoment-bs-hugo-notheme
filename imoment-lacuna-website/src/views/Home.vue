<template>
    <div>
        <h1 style="text-align: center;">잉여의 도시</h1> <br>
        <h3 style="text-align: center;"> 참여해주셔서 감사합니다.  <br>
            아래 버튼을 누르면 오디오가 재생됩니다.<br>
            적절한 볼륨으로 들리는지 확인해주세요.
        </h3>
        
        <nav>
            <button @click="goToScene1" class="nav-button">Scene 1</button> |
            <router-link to="/scene2">Scene 2</router-link> |
            <router-link to="/scene3">Scene 3</router-link>
        </nav>
        <button @click="enableAudio">오디오 활성화</button>
        <WebSocketComponent @scene-message="handleSceneMessage" />
    </div>
</template>

<script>
import WebSocketComponent from '../components/WebSocketComponent.vue'

export default {
    name: 'HomeView',
    components: {
        WebSocketComponent
    },
    data() {
        return {
            audioEnabled: false
        }
    },
    mounted() {
        // 오디오 초기 설정
        const audio = this.$root.$refs.audioElement;
        audio.volume = 0.8;
    },
    methods: {
        async playScene1Audio() {
            if (!this.audioEnabled) {
                console.log('오디오가 아직 활성화되지 않았습니다');
                return;
            }

            const audio = this.$root.$refs.audioElement;
            try {
                await audio.play();
                console.log('오디오 재생 성공');
            } catch (error) {
                console.error('오디오 재생 실패:', error);
            }
        },
        enableAudio() {
            this.audioEnabled = true;
            console.log('오디오 활성화');
            this.playScene1Audio();
        },
        async goToScene1() {
            try {
                await this.playScene1Audio();
                this.$router.push('/scene1');
            } catch (error) {
                console.error('Scene1 이동 중 오류 발생:', error);
            }
        },
        async handleSceneMessage(message) {
            if (message === 'Scene1') {
                if (this.audioEnabled) {
                    try {
                        await this.playScene1Audio();
                    } catch (error) {
                        console.error('오디오 재생 실패:', error);
                    }
                }
                this.$router.push('/scene1');
            }
        }
    },
    beforeUnmount() {
        const audio = this.$root.$refs.audioElement;
        if (audio) {
            //audio.pause();
            //audio.currentTime = 0;
        }
    }
}
</script>

<style scoped>
.nav-button {
    background: none;
    border: none;
    color: #2c3e50;
    text-decoration: none;
    cursor: pointer;
    font-size: 1em;
}
</style>
