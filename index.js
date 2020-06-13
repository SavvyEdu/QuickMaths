const express = require('express');
const socket = require('socket.io');
const PORT = 4000

var app = express();
var server = app.listen(PORT, function(){
    console.log(`listening on port: ${PORT}`)
})

app.use(express.static('public'))

const io = socket(server);

io.on('connection', function(socket){
    console.log('made socket connection ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
    });

    //receive a chat message
    socket.on('chat', function(data){
        //send message to all sockets
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data)
    });
    
});