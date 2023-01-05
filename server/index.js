const app = require('express')();
const {Server} = require('socket.io')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
const cors = require("cors");
const authRouter = require("./routes/auth/index")
const uuid = require('short-uuid')

const io = new Server({
    cors : true
})


app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).send("app running")
})

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
)
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))

const socketToUser = new Map()
const userToSocket = new Map()

const setMap = (key, value) => {
    socketToUser.set(key, value);
    userToSocket.set(value, key);
}

const deleteMap = (socketId) => {
    const user = socketToUser.get(socketId);
    userToSocket.delete(user);
    socketToUser.delete(socketId)
}
    
io.on('connection', (socket) => {
    socket.on('create-new-meeting', (user ,callback) => {
        try {
            const roomId = uuid.generate();  
            socket.join(roomId);
            socket.roomId = roomId
            setMap(socket.id, user)
            callback({status : 1, roomId})
        }
        catch (err) {
            callback({status : 0, message : err})
        }

    })

    socket.on("join-room", (roomId, user , callback) => {
        if (io.sockets.adapter.rooms.get(roomId)) {
            socket.join(roomId)
            socket.roomId = roomId
            setMap(socket.id, user)
            socket.to(roomId).emit('user-joined', user)
            callback({message : null})
        }
        else callback({message : "Please enter a valid roomid"})
    })

    socket.on('get-room-clients', (roomId, callback) => {
        if (!io.sockets.adapter.rooms.get(roomId)) return;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId))
        const users = clients.map(client => socketToUser.get(client))
        callback(users)
    })

    socket.on('disconnect', (reason) => {
        if (socket.roomId) {
            const user = socketToUser.get(socket.id);
            socket.leave(socket.roomId)
            deleteMap(socket.id)
            socket.to(socket.roomId).emit("user-left", user)
        }
    })
})



app.listen(process.env.PORT || 5002, () => {
    console.log(`Server running at ${process.env.PORT}`)
})
io.listen(4001)

app.use('/api/auth', authRouter)