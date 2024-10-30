import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import _1_entry from './views/1_entry.vue'
import _1_test from './views/1_test.vue'
import _2_train from './views/2_train.vue'
import _4_map from './views/4_map.vue'
import _3_narration from './views/3_narration.vue'
import _3_narration_new from './views/3_narration_new.vue'
import _3_1_mail from './views/3_1_mail.vue'
import Scene5 from './views/Scene5.vue'
import Scene6 from './views/Scene6.vue'
import _3_2_map from './views/3_2_map.vue'
import _4_map_single from './views/4_map_single.vue'
import S1 from './views/S1.vue'
import S2 from './views/S2.vue'
import S3 from './views/S3.vue'
import S4 from './views/S4.vue'
import S6 from './views/S6.vue'
import S7 from './views/S7.vue'
import S8 from './views/S8.vue'
import S5 from './views/S5.vue'
import S_A from './views/S_A.vue'
import S_V from './views/S_V.vue'
const router = createRouter({
    history: createWebHashHistory(process.env.NODE_ENV === 'production' ? '/lacuna/' : '/lacuna/'),
    routes: [
        { path: '/', component: _1_test },
        { path: '/1_entry', component: _1_entry },
        { path: '/2_train', component: _2_train },
        { path: '/4_map', component: _4_map },
        { path: '/3_narration', component: _3_narration },
        { path: '/3_narration_new', component: _3_narration_new },
        { path: '/3_1_mail', component: _3_1_mail },
        { path: '/scene5', component: Scene5 },
        { path: '/scene6', component: Scene6 },
        { path: '/3_2_map', component: _3_2_map },
        { path: '/4_map_single', component: _4_map_single },
        { path: '/S1', component: S1 },
        { path: '/S2', component: S2 },
        { path: '/S3', component: S3 },
        { path: '/S4', component: S4 },
        { path: '/S5', component: S5 },
        { path: '/S6', component: S6 },
        { path: '/S7', component: S7 },
        { path: '/S8', component: S8 },
        { path: '/S_A', component: S_A },
        { path: '/S_V', component: S_V },
    ]
})

createApp(App).use(router).mount('#app')
