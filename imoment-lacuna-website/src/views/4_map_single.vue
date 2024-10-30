<template>
    <div class="map-container">
        <div id="map"></div>
        <router-link to="/" class="home-button">홈으로</router-link>
        <button @click="getCurrentLocation" class="location-button">
            현재 위치 찾기
        </button>
        <div v-if="logMessage" class="log-display">
            {{ logMessage }}
        </div>
        <div class="group-display">
            {{ userGroup }}
        </div>
    </div>
</template>

<script>
/* global google */
import { Loader } from "@googlemaps/js-api-loader"

export default {
    name: 'MapSingleView',
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
                    index: 0
                },
                { 
                    lat: 37.5510769, lng: 126.9635697, 
                    title: '시계', 
                    index: 1
                },
                { 
                    lat: 37.5512088, lng: 126.9641548, 
                    title: '우산', 
                    index: 2
                },
                { 
                    lat: 37.5510527, lng: 126.9640948, 
                    title: '비둘기', 
                    index: 3
                },
                { 
                    lat: 37.5511070, lng: 126.9641643, 
                    title: '너히비의자', 
                    index: 4
                },
                { 
                    lat: 37.5514419, lng: 126.9641430, 
                    title: '기찻길', 
                    index: 5
                },
                { 
                    lat: 37.5518265, lng: 126.9642855, 
                    title: '성전', 
                    index: 6
                },
                { 
                    lat: 37.5521822, lng: 126.9645926, 
                    title: '퇴적층', 
                    index: 7
                },
                { 
                    lat: 37.5513629, lng: 126.9641665, 
                    title: '낡은의자', 
                    index: 8
                }
            ],
            isFirstLocation: true, // 첫 위치 추적 여부 확인용 변수 추가
            userGroup: '',
            currentIndex: null,
            nextPOIIndex: null,
            logMessage: ''
        }
    },
    methods: {
        addPOIMarkers() {
            const userGroup = localStorage.getItem('userGroup') || 'A';
            const currentIndex = parseInt(this.$route.query.currentIndex, 10);

                        // 그룹별 POI 순서 정의
                const groupSequences = {
                    A: [0, 2, 8, 5, 1, 4, 3, 6],  // 우산->낡은의자->기찻길->시계->너히비의자->비둘기->성전
                    B: [0, 7, 5, 1, 3, 8, 2, 6],     // 퇴적층->기찻길->시계->비둘기->낡은의자->우산->성전
                    C: [0, 4, 3, 5, 2, 8, 6]      // 너히비의자->비둘기->기찻길->우산->낡은의자->성전
                };

                const sequence = groupSequences[userGroup];
                const currentSequenceIndex = sequence.indexOf(currentIndex);
                
                // 현재 인덱스가 시퀀스의 마지막이 아니면 다음 인덱스를, 마지막이면 첫 인덱스를 선택
                const nextPOIIndex = currentSequenceIndex === sequence.length - 1 
                    ? sequence[0] 
                    : sequence[currentSequenceIndex + 1];

                // data에 값 저장
                this.userGroup = userGroup;
                this.currentIndex = currentIndex;
                this.nextPOIIndex = nextPOIIndex;
                this.logMessage = `${currentIndex} ${nextPOIIndex}`;

                console.log('Adding marker', userGroup, currentIndex,  nextPOIIndex);
 

            // 기존 마커들 제거
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];

            // 다음 POI 마킹
            const poi = this.pois[nextPOIIndex];
            if (poi) {
                console.log('poi:', poi);
                const marker = new google.maps.Marker({
                    position: { lat: poi.lat, lng: poi.lng },
                    map: this.map,
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
            }
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
    display: none; /* 으로 버튼 숨기기 */
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

.log-display {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 14px;
    z-index: 1000;
}

.group-display {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0.3);
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 60px;
    font-weight: bold;
    z-index: 1000;
}
</style>

