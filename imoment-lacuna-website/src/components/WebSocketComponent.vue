<template>
    <div>
        <div id="upper-half">
            <div id="messages"></div>
        </div>
        <div id="lower-half">
            <div id="log" ref="log"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WebSocketComponent',
    data() {
        return {
            socket: null, // 웹소켓 객체
            logElement: null, // 로그를 표시할 DOM 요소
            deviceId: this.getOrCreateUUID() // UUID 생성 또는 가져오기
        }
    },
    methods: {
        log(message) {
            // 로그 메시지를 화면에 추가하는 메소드
            if (this.logElement) {
                this.logElement.innerHTML += message + '\n'; // 로그에 메시지 추가
                this.logElement.scrollTop = this.logElement.scrollHeight; // 스크롤을 아래로 이동
            } else {
                console.log(message); // 로그가 없으면 콘솔에 출력
            }
        },
        generateUUID() {
            // UUID를 생성하는 메소드
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0; // 0-15 사이의 랜덤 숫자 생성
                const v = c === 'x' ? r : (r & 0x3 | 0x8); // UUID 형식에 맞게 숫자 설정
                return v.toString(16); // 16진수 문자열로 변환
            });
        },
        getOrCreateUUID() {
            // 로컬 스토리지에서 UUID를 가져오거나 새로 생성하는 메소드
            let uuid = localStorage.getItem('deviceId'); // 로컬 스토리지에서 UUID 가져오기
            if (!uuid) {
                uuid = this.generateUUID(); // UUID가 없으면 새로 생성
                localStorage.setItem('deviceId', uuid); // 로컬 스토리지에 저장
            }
            return uuid; // UUID 반환
        },
        connect() {
            // 웹소켓 연결 메소드
            this.socket = new WebSocket('wss://imoment-node-server-heroku-178f19c891f3.herokuapp.com/');

            this.socket.onmessage = (event) => {
                // 서버로부터 메시지를 수신했을 때 실행되는 콜백
                if (event.data === 'ping') {
                    // 서버로부터 핑 메시지를 수신하면 퐁 메시지 전송
                    this.socket.send(JSON.stringify({ type: 'pong' }));
                    this.log('서버로 부터 Ping 수신 - 퐁 메시지 전송');
                } else {
                    // 일반 메시지 수신
                    this.log(`메시지 수신: ${event.data}`);
                    this.$emit('scene-message', event.data); // scene-message 이벤트 발생
                }
            };

            this.socket.onopen = () => {
                // 웹소켓이 연결되었을 때 실행되는 콜백
                this.log('웹소켓 연결 성공');
                
                // UUID를 서버로 전송
                this.socket.send(JSON.stringify({ type: 'register', deviceId: this.deviceId }));
                this.log('UUID 전송: ' + this.deviceId);

                // 30초마다 핑 메시지 전송
                setInterval(() => {
                    if (this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(JSON.stringify({ type: 'ping' }));
                        this.log('핑 메시지 전송');
                    }
                }, 30000);
            };

            this.socket.onclose = () => {
                // 웹소켓 연결이 닫혔을 때 실행되는 콜백
                this.log('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
                setTimeout(this.connect, 3000); // 3초 후 재연결 시도
            };
        }
    },
    mounted() {
        // 컴포넌트가 마운트되었을 때 실행
        this.logElement = this.$refs.log; // 로그 요소 참조
        this.connect(); // 웹소켓 연결
    },
    beforeUnmount() {
        // 컴포넌트가 언마운트되기 전에 실행
        if (this.socket) {
            this.socket.close(); // 웹소켓 연결 종료
        }
    }
}
</script>

<style scoped>
#upper-half {
    height: 50vh; /* 상단 영역 높이 설정 */
    overflow-y: auto; /* 세로 스크롤 가능 */
}

#lower-half {
    height: 50vh; /* 하단 영역 높이 설정 */
    overflow-y: auto; /* 세로 스크롤 가능 */
    border-top: 1px solid #ccc; /* 상단 경계선 */
    padding: 10px; /* 패딩 설정 */
}

#log {
    font-family: monospace; /* 모노스페이스 폰트 사용 */
    white-space: pre-wrap; /* 공백 유지 */
}
</style>
