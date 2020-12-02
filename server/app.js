/* Create server using Express*/
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users.js')()

const toObject = (name, text, id) => ({ name, text, id })


/* Connection Socket*/
io.on('connection', socket => {
    /* Creates new user and joins him to the room*/
    socket.on('newUser', (data, newcallback) => {

        if (!data.name || !data.room) {
            return newcallback('Try again')
        }

        socket.join(data.room)

        users.remove(socket.id)
        users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        })
        /* Callback to welcome new user*/
        newcallback({ userId: socket.id })
        io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
        socket.emit('newMessage', toObject('admin', `Welcome ${data.name}`))
        socket.broadcast
            .to(data.room)
            .emit('newMessage', toObject('admin', `User ${data.name} connected`))
    })
    /*This method creates and sends messages */
    socket.on('createMessage', (data, newcallback) => {
        let userID = data.id
        if (!data.text) {
            return newcallback('Write something')
        }
        let user = users.getUser(data.id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', toObject(user.name, data.text, data.id))
        }
        newcallback()
    })
    /* Sends messages to everyone when user left and deletes him from User List */
    socket.on('userLeft', (id, cb) => {
        const user = users.remove(id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', toObject('admin', `User ${user.name} has left`))
        }
        cb()
    })
    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', toObject('admin', `User ${user.name} has left`))
        }
    })
})

module.exports = {
    app,
    server
}
