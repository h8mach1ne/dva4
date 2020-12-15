export const state = () => ({
    user: {},
    messages: [],
    users: []
})
/* Saves data */
export const mutations = {
    setUser(state, user) {
        state.user = user
    },
    clearData(state) {
        state.messages = [],
            state.user = {},
            state.users = []
    },
    SOCKET_newMessage(state, message) {
        state.messages.push(message)
    },
    SOCKET_updateUsers(state, users) {
        state.users = users
    }
}