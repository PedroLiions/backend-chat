const express = require("express");
const app = express();
require("./config/mongo").connect();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    origins: ["http://localhost:4200"]
});
const auth = require("./middleware/auth");
const usersRoute = require("./routes/users.route");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const Message = require("./model/message");
const usersOnline = [];

app.use(cors())
app.use(bodyParser.json());

app.use("/auth", usersRoute)

app.get("/welcome", auth, (req, res) => {
    return res.json({message: "Welcome"})
});

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, 'Acesso123#', function (err, decoded) {
            if (err) {
                return next(new Error('Authentication error'))
            }
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', async (socket) => {
    let userExist = false;
    usersOnline.forEach(user => {
        if (user.id === socket.decoded.id) {
            userExist = true;
        }
    })

    if (! userExist) {
        usersOnline.push(socket.decoded);
    }

    console.log("users", usersOnline);

    socket.broadcast.emit('usersConnected', usersOnline);

    const prevMessages = await Message.find();

    socket.emit("previousMessages", prevMessages);

    socket.emit("previousUserConnected", usersOnline)

    socket.on("sendMessage", async (data) => {
        let message = await Message.create({
            message: data.message,
            author: {
                id: socket.decoded.user_id,
                first_name: socket.decoded.first_name
            }
        });

        socket.broadcast.emit("receivedMessage", message);
        socket.emit("receivedMyMessage", message);
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit('usersConnected', usersOnline);
    })
});

server.listen(3000);
