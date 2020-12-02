import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function ({ store }) {//We need receive 'store' for using vue-socket.io library
    Vue.use(new VueSocketIO({
        debug: false,
        connection: 'http://localhost:3000',
        vuex: {
            store,
            actionPrefix: 'SOCKET_',
            mutationPrefix: 'SOCKET_'
        }
    }))
}
