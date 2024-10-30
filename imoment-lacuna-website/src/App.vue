<template>
    <div id="app">
        <!-- 기존 audio 엘리먼트들 -->
        <audio ref="testBGM" src="/lacuna/audio/bgm.mp3" preload="auto"></audio>
        <audio ref="mailBGM" src="/lacuna/audio/bell.mp3" preload="auto"></audio>
        
        <!-- 새로 추가되는 POI audio 엘리먼트들 -->

        <audio ref="mailFromK" src="/lacuna/audio/mailFromK.mp3" preload="auto"></audio>

        <audio ref="all" src="/lacuna/audio/all.m4a" preload="auto"></audio>
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

