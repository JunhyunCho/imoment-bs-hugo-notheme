import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Scene1 from './views/Scene1.vue'
import Scene2 from './views/Scene2.vue'
import Scene3 from './views/Scene3.vue'
import Scene4 from './views/Scene4.vue'

const router = createRouter({
    history: createWebHistory(process.env.NODE_ENV === 'production' ? '/lacuna/' : '/lacuna/'),
    routes: [
        { path: '/', component: Home },
        { path: '/scene1', component: Scene1 },
        { path: '/scene2', component: Scene2 },
        { path: '/scene3', component: Scene3 },
        { path: '/scene4', component: Scene4 },
    ]
})

createApp(App).use(router).mount('#app')
