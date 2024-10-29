class WebSocketService {
    constructor() {
        this.socket = null;
        this.deviceId = this.getOrCreateUUID();
        this.listeners = new Map();
    }

    connect() {
        const isProduction = process.env.NODE_ENV === 'production';
        const serverUrl = isProduction
            ? 'wss://imoment-node-server-heroku-178f19c891f3.herokuapp.com/'
            : 'wss://imoment-node-server-heroku-178f19c891f3.herokuapp.com/';
        // 'ws://localhost:3000';

        this.socket = new WebSocket(serverUrl);

        this.socket.onopen = () => {
            console.log('wsc.js - 웹소켓 연결 성공');
            this.socket.send(JSON.stringify({ type: 'register', deviceId: this.deviceId }));
        };

        this.socket.onmessage = (event) => {
            // if (event.data === 'ping') {
            //     this.socket.send(JSON.stringify({ type: 'pong' }));
            //     console.log('wsc.js - ping 수신, pong 응답');
            //     return;
            // }

            console.log('wsc.js - 메시지 수신:', event.data);
            // 등록된 모든 리스너에게 메시지 전달
            this.listeners.forEach(callback => {
                callback(event.data);
            });
        };

        this.socket.onclose = () => {
            console.log('wsc.js - WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
            setTimeout(() => this.connect(), 3000);
        };
    }

    addMessageListener(id, callback) {
        this.listeners.set(id, callback);
    }

    removeMessageListener(id) {
        this.listeners.delete(id);
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getOrCreateUUID() {
        let uuid = localStorage.getItem('deviceId');
        if (!uuid) {
            uuid = this.generateUUID();
            localStorage.setItem('deviceId', uuid);
        }
        return uuid;
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default new WebSocketService();
