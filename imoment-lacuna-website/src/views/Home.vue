<template>
    <div>
        <h1>테스트 시티 홈</h1>
        <nav>
            <router-link to="/scene1" @click="playScene1Audio">Scene 1</router-link> |
            <router-link to="/scene2">Scene 2</router-link> |
            <router-link to="/scene3">Scene 3</router-link>
        </nav>
        <WebSocketComponent />
    </div>
</template>

<script>
import WebSocketComponent from '../components/WebSocketComponent.vue'

export default {
    name: 'HomeView',
    components: {
        WebSocketComponent
    },
    methods: {
        playScene1Audio() {
            // Scene1.vue에서 음악이 자동으로 재생되도록 하기 위해 추가적인 작업은 필요 없음
            // 단순히 페이지 전환 시 음악이 재생되도록 Scene1.vue에서 처리
        }
    }
}
</script>
