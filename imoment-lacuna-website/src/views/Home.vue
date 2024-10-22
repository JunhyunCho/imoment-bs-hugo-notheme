<template>
    <div>
        <h1>테스트 시티 홈</h1>
        <nav>
            <router-link to="/scene1">Scene 1</router-link> |
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
    }
}
</script>