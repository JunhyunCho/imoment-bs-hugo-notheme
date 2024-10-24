<template>
    <div class="map-container">
        <div id="map"></div>
        <router-link to="/" class="home-button">홈으로</router-link>
        <!-- 위치 찾기 버튼 추가 -->
        <button @click="getCurrentLocation" class="location-button">현재 위치 찾기</button>
    </div>
</template>

<script>
/* global google */

import { Loader } from "@googlemaps/js-api-loader"

export default {
    name: 'Scene3View',
    data() {
        return {
            map: null,
            currentLocationMarker: null
        }
    },
    methods: {
        async getCurrentLocation() {
            if ("geolocation" in navigator) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        });
                    });
                    
                    const { latitude, longitude } = position.coords;
                    const currentLocation = { lat: latitude, lng: longitude };
                    
                    // 지도 중심 이동
                    this.map.setCenter(currentLocation);
                    
                    // 기존 마커가 있다면 제거
                    if (this.currentLocationMarker) {
                        this.currentLocationMarker.setMap(null);
                    }
                    
                    // 새 마커 생성
                    this.currentLocationMarker = new google.maps.Marker({
                        position: currentLocation,
                        map: this.map,
                        title: '현재 위치'
                    });

                } catch (error) {
                    console.error('위치 정보를 가져오는데 실패했습니다:', error);
                    alert('위치 정보 접근이 거부되었거나 오류가 발생했습니다.');
                }
            } else {
                alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
            }
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

/* 위치 버튼 스타일 추가 */
.location-button {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
    padding: 10px 20px;
    background-color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.location-button:hover {
    background-color: #f0f0f0;
}
</style>