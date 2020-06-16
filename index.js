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

//NAMESPACE & ROOMS

const game = io.of('/game');

const rooms = require('./server/rooms')
let RoomManager =  new rooms.RoomManager();

//SOCKET EVENTS

game.on('connection', function(socket){
    console.log('made socket connection ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
        
        let room = RoomManager.removePlayer(socket.id);
        if(room != undefined){
            if(RoomManager.playerCount(room) == 0){
                RoomManager.removeRoom(room);
            }else{
                game.in(room).emit('update-players', {
                    room: room,
                    names: RoomManager.getPlayers(room)
                });
            }
        }
        console.log(room);
    });

    socket.on('host', (data) => {

        let room = RoomManager.addRoom(); //make a new room
        socket.join(room); //join the room
        RoomManager.addPlayer(room, socket.id, data.name);//add player to room

        //send back the room code 
        game.in(room).emit('update-players', {
            room: room, 
            names: RoomManager.getPlayers(room)
        }); 

        game.in(room).emit('chat', `${ data.name } created room`); //send back the chat message
    });

    socket.on('join', (data) => {
        //check if the room exists
        if(RoomManager.containsRoom(data.room)){
            socket.join(data.room); //join the room
            RoomManager.addPlayer(data.room, socket.id, data.name);//add player to room

            //send back the room code 
            game.in(data.room).emit('update-players', {
                room: data.room, 
                names: RoomManager.getPlayers(data.room)
            }); 
            game.in(data.room).emit('chat', `${ data.name } joined room`) //send back the chat message
        }
    });

    //receive a chat message
    socket.on('chat', (data) => {
        //send message to all sockets
        game.in(data.room).emit('chat', `${data.name}: ${data.message}`);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    });
    
});
