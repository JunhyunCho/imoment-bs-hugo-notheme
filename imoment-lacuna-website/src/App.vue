<template>
    <div id="app">
        <!-- 기존 audio 엘리먼트들 -->
        <audio ref="testBGM" src="/lacuna/audio/bgm.mp3" preload="auto"></audio>

        <audio ref="all" src="/lacuna/audio/all_new.mp3" preload="auto"></audio>
        <audio ref="S0" src="/lacuna/audio/S0.mp3" preload="auto"></audio>
        <audio ref="S1" src="/lacuna/audio/S1.mp3" preload="auto"></audio>
        <audio ref="S2" src="/lacuna/audio/S2.mp3" preload="auto"></audio>

        <audio ref="S4" src="/lacuna/audio/S4.mp3" preload="auto"></audio>
        
        <audio ref="S6" src="/lacuna/audio/S6.mp3" preload="auto"></audio>
        <audio ref="S7" src="/lacuna/audio/S7.mp3" preload="auto"></audio>
        <audio ref="S8" src="/lacuna/audio/S8.mp3" preload="auto"></audio>

        
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

