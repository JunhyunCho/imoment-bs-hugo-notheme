<template>
    <div class="map-container">
        <iframe
            width="100%"
            height="100%"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            :src="mapUrl">
        </iframe>
        <router-link to="/" class="home-button">홈으로</router-link>
        <button @click="getUserLocation" class="location-button">현재 위치 찾기</button>
    </div>
</template>

<script>
export default {
    name: 'Scene4View',
    data() {
        return {
            apiKey: 'AIzaSyAYcjpCTG8LexYskRI6r7aWVNW42h9hIE4',
            center: '37.551666,126.964625', // 서울 중심 좌표
            zoom: 18
        }
    },
    methods: {
        getUserLocation() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = `${position.coords.latitude},${position.coords.longitude}`;
                }, error => {
                    console.error('위치 정보를 가져오는데 실패했습니다:', error);
                    alert('위치 정보 접근이 거부되었거나 오류가 발생했습니다.');
                });
            } else {
                alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
            }
        }
    },
    computed: {
        mapUrl() {
            return `https://www.google.com/maps/embed/v1/view`
                + `?key=${this.apiKey}`
                + `&center=${this.center}`
                + `&zoom=${this.zoom}`;
        }
    }
}
</script>

<style scoped>
.map-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
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

.home-button:hover {
    background-color: #f0f0f0;
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