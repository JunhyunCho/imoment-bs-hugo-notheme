<template>
    <div class="map-container">
        <div id="map"></div>
        <router-link to="/" class="home-button">홈으로</router-link>
        <button @click="getCurrentLocation" class="location-button">
            현재 위치 찾기
        </button>
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
            currentLocationMarker: null,
            watchId: null,
            isTracking: false,
            markers: [], // 마커 관리를 위한 배열 추가
            pois: [
                { 
                    lat: 37.5523504, lng: 126.9652729, 
                    title: '라쿠나 출입 문', 
                    indexA: 0, indexB: 0, indexC: 0 
                },
                { 
                    lat: 37.5514943, lng: 126.9633434, 
                    title: '시계', 
                    indexA: 1, indexB: 1, indexC: 1 
                },
                { 
                    lat: 37.5511968, lng: 126.9641541, 
                    title: '우산', 
                        indexA: 2, indexB: 2, indexC: 2 
                },
                { 
                    lat: 37.5510854, lng: 126.9640810, 
                    title: '비둘기', 
                    indexA: 3, indexB: 3, indexC: 3 
                },
                { 
                    lat: 37.55130, lng: 126.9636, 
                    title: '너히비의자', 
                    indexA: 4, indexB: 4, indexC: 4 
                },
                { 
                    lat: 37.55163, lng: 126.9637, 
                    title: '기찻길', 
                    indexA: 5, indexB: 5, indexC: 5 
                },
                { 
                    lat: 37.5519488, lng: 126.9646255, 
                    title: '성전', 
                    indexA: 6, indexB: 6, indexC: 6 
                },
                { 
                    lat: 37.5520525, lng: 126.9648790, 
                    title: '퇴적층', 
                    indexA: 7, indexB: 7, indexC: 7 
                },
                { 
                    lat: 37.5513651, lng: 126.9642202, 
                    title: '낡은의자', 
                    indexA: 8, indexB: 8, indexC: 8 
                }
            ],
            isFirstLocation: true // 첫 위치 추적 여부 확인용 변수 추가
        }
    },
    methods: {
        addPOIMarkers() {
            const userGroup = localStorage.getItem('userGroup') || 'A';
            const indexKey = `index${userGroup}`;
            
            console.log('Adding markers for group:', userGroup);

            // 기존 마커들 제거
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];

            this.pois.forEach((poi, index) => {
                try {
                    // 마커 라벨 설정
                    const label = {
                        text: String(poi[indexKey]),
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    };

                    // 일반 마커 생성
                    const marker = new google.maps.Marker({
                        position: { lat: poi.lat, lng: poi.lng },
                        map: this.map,
                        label: label,
                        title: poi.title,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#FF0000',
                            fillOpacity: 0.5,
                            strokeColor: '#FF0000',
                            strokeWeight: 1,
                            scale: 15
                        }
                    });

                    this.markers.push(marker);
                    //console.log(`Marker ${index} created successfully`);
                } catch (error) {
                    console.error(`Error creating marker ${index}:`, error);
                }
            });

            // if (this.map && this.pois.length > 0) {
            //     this.map.setCenter({ lat: this.pois[0].lat, lng: this.pois[0].lng });
            // }
        },

        getCurrentLocation() {
            if (!("geolocation" in navigator)) {
                alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
                return;
            }

            if (this.isTracking) {
                this.stopTracking();
            } else {
                this.startTracking();
            }
        },

        startTracking() {
            this.isTracking = true;
            this.isFirstLocation = true; // 추적 시작할 때 초기화
            
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentLocation = { lat: latitude, lng: longitude };
                    
                    // 첫 위치일 경우 지도 중심 이동
                    if (this.isFirstLocation) {
                        this.map.setCenter(currentLocation);
                        this.isFirstLocation = false;
                    }
                    
                    this.updateLocationMarker(currentLocation);
                },
                (error) => {
                    console.error('위치 추적 오류:', error);
                    alert('위치 추적 중 오류가 발생했습니다.');
                    this.stopTracking();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
            
            const button = document.querySelector('.location-button');
            button.textContent = '위치 추적 중지';
            button.style.backgroundColor = '#4444ff';
            button.style.color = 'white';
        },

        updateLocationMarker(location) {
            console.log('currentLocationMarker:', this.currentLocationMarker);
            if (this.currentLocationMarker && this.currentLocationMarker.getMap()) {
                // 마커가 존재하고 지도에 표시된 상태일 때만 위치 업데이트
                console.log('currentLocationMarker already exists- update location');
                this.currentLocationMarker.setPosition(location);
            } else {
                // 마커가 없거나 지도에서 제거된 상태면 새로 생성
                console.log('currentLocationMarker does not exist- create new marker');
                this.currentLocationMarker = new google.maps.Marker({
                    position: location,
                    map: this.map,
                    title: '현재 위치',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#4285F4',
                        fillOpacity: 0.5,
                        strokeColor: '#4285F4',
                        strokeWeight: 1,
                        scale: 12
                    },
                    optimized: false
                });
            }
        },

        stopTracking() {
            if (this.watchId !== null) {
                // watchPosition 중지
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
                this.isTracking = false;
                
                // 현재 위치 마커 명시적으로 제거
                if (this.currentLocationMarker) {
                    this.currentLocationMarker.setMap(null);
                    this.currentLocationMarker = null;
                }
                
                const button = document.querySelector('.location-button');
                button.textContent = '현재 위치 찾기';
                button.style.backgroundColor = 'white';
                button.style.color = 'black';
            }
        }
    },
    async mounted() {
        const loader = new Loader({
            apiKey: "AIzaSyAYcjpCTG8LexYskRI6r7aWVNW42h9hIE4",
            version: "weekly"
        });

        try {
            await loader.load();
            const { Map } = await google.maps.importLibrary("maps");
            
            this.map = new Map(document.getElementById('map'), {
                center: {lat: 37.5520, lng: 126.9648},
                zoom: 17,
                mapId: 'f20adec0637874ba',
                mapTypeControl: false,  // 지도/위성 컨트롤 숨기기
                streetViewControl: false,  // 스트리트뷰 컨트롤도 숨기기
                zoomControl: false,  // 줌 컨트롤도 숨기기
                fullscreenControl: false,  // 전체화면 컨트롤도 숨기기
                gestureHandling: 'greedy'  // 한 손가락으로 지도 이동 가능하게 설정
            });
            
            console.log('Map initialized');
            await this.addPOIMarkers();
            console.log('Markers added');
        } catch (error) {
            console.error('Map initialization error:', error);
        }
    },
    beforeUnmount() {
        this.stopTracking();
        // 모든 마커 제거
        this.markers.forEach(marker => marker.setMap(null));
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
    display: none; /* 홈으로 버튼 숨기기 */
}

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
    transition: all 0.3s ease;
}

.location-button:hover {
    background-color: #f0f0f0;
}
</style>

