<template>
    <div>
        <div id="upper-half">
            <div id="nameForm" v-if="!userName">
                <input type="text" v-model="nameInput" @keypress.enter="submitName" placeholder="이름을 입력하세요">
                <button @click="submitName">제출</button>
            </div>
            <h2 id="greeting" v-else>Hello {{ userName }}</h2>
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
            socket: null,
            userName: '',
            nameInput: '',
            logElement: null
        }
    },
    methods: {
        log(message) {
            if (this.logElement) {
                this.logElement.innerHTML += message + '\n';
                this.logElement.scrollTop = this.logElement.scrollHeight;
            } else {
                console.log(message);
            }
        },
        connect() {
            this.socket = new WebSocket('https://imoment-node-server-heroku-178f19c891f3.herokuapp.com/');

            this.socket.onopen = () => {
                this.log('웹소켓 연결 성공');
                setInterval(() => {
                    if (this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(JSON.stringify({ type: 'ping' }));
                        this.log('핑 메시지 전송');
                    }
                }, 30000);
            };

            this.socket.onmessage = (event) => {
                if (event.data === 'ping') {
                    this.socket.send(JSON.stringify({ type: 'pong' }));
                    this.log('서버로 부터 Ping 수신 - 퐁 메시지 전송');
                } else if (event.data === 'updateClients') {
                    this.log('클라이언트 목록 업데이트 요청 수신');
                } else {
                    document.getElementById('messages').innerHTML += '<p>' + event.data + '</p>';
                    this.log(`메시지 수신: ${event.data}`);
                }
            };

            this.socket.onclose = () => {
                this.log('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
                setTimeout(this.connect, 3000);
            };
        },
        submitName() {
            if (this.nameInput) {
                this.userName = this.nameInput;
                this.socket.send(JSON.stringify({ type: 'name', name: this.userName }));
                this.log(`이름 전송: ${this.userName}`);
            }
        }
    },
    mounted() {
        this.logElement = this.$refs.log;
        this.connect();
    },
    beforeUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
</script>

<style scoped>
#upper-half {
    height: 50vh;
    overflow-y: auto;
}

#lower-half {
    height: 50vh;
    overflow-y: auto;
    border-top: 1px solid #ccc;
    padding: 10px;
}

#log {
    font-family: monospace;
    white-space: pre-wrap;
}
</style>