const express = require('express');
const socket = require('socket.io');
const PORT = 4000

//SOCKET.IO SETUP

var app = express();
var server = app.listen(PORT, function(){
    console.log(`listening on port: ${PORT}`)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/room', (req, res) => {
    res.sendFile(__dirname + '/public/room.html');
});

app.use(express.static('public'))

const io = socket(server);

//NAMESPACE

const game = io.of('/game');

//SOCKET EVENTS

game.on('connection', function(socket){
    console.log('made socket connection ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
    });

    socket.on('join', (data) => {
        socket.join(data.room); //join the room
        game.in(data.room).emit('chat', 'joined room')
    });

    //receive a chat message
    socket.on('chat', (data) => {
        //send message to all sockets
        game.emit('chat', data.message);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    });
    
});