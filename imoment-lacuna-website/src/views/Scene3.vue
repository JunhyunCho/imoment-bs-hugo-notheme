<template>
    <div class="map-container">
        <div id="map"></div>
        <router-link to="/" class="home-button">홈으로</router-link>
    </div>
</template>

<script>

// ESLint에게 'google'이 전역 변수임을 알려줍니다
/* global google */


import { Loader } from "@googlemaps/js-api-loader"

export default {
    name: 'Scene3View',
    data() {
        return {
            map: null
        }
    },
    async mounted() {
        const loader = new Loader({
            apiKey: "AIzaSyAYcjpCTG8LexYskRI6r7aWVNW42h9hIE4",
            version: "weekly"
        });

        await loader.load();
        const { Map } = await google.maps.importLibrary("maps");
        
        this.map = new Map(document.getElementById('map'), {
            center: {lat: 37.551666, lng: 126.964625},
            zoom: 15,
            mapId: 'f20adec0637874ba'
        });
    }
}
</script>

<style scoped>
.map-container {
    position: relative;
    width: 100vw;
    height: 100vh;
}

#map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.home-button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
    padding: 10px 20px;
    background-color: white;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
