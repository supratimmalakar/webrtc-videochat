const app = require('express')();
const {Server} = require('socket.io')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
const cors = require("cors");
const authRouter = require("./routes/auth/index")

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


    
io.on('connection', (socket) => {
    socket.on('hello', () => {
        console.log('hello')
    })
})


app.listen(process.env.PORT || 5002, () => {
    console.log(`Server running at ${process.env.PORT}`)
})
io.listen(4001)

app.use('/api/auth', authRouter)