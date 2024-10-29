<template>
    <div>
        <div id="log" ref="log"></div>
    </div>
</template>

<script>
import websocketService from '../services/websocketService';

export default {
    name: 'WebSocketComponent',
    data() {
        return {
            logElement: null
        }
    },
    methods: {
        log(message) {
            if (this.logElement) {
                this.logElement.innerHTML += message + '\n';
                this.logElement.scrollTop = this.logElement.scrollHeight;
            }
        },
        handleMessage(message) {
            this.log(`wsc.vue : 메시지 수신: ${message}`);
            this.$emit('scene-message', message);
        }
    },
    mounted() {
        this.logElement = this.$refs.log;
        websocketService.connect();
        websocketService.addMessageListener('websocket-component', this.handleMessage);
    },
    beforeUnmount() {
        websocketService.removeMessageListener('websocket-component');
    }
}
</script>

<style scoped>
#log {
    font-family: monospace;
    white-space: pre-wrap;
}
</style>
