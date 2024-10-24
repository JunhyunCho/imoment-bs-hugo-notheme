<template>
    <div id="app">
        <audio ref="audioElement" src="/lacuna/audio/bgm.mp3" loop></audio>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

