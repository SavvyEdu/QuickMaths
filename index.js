const express = require('express');
const socket = require('socket.io');
const PORT = process.env.PORT || 4000;

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

const rooms = require('./server/rooms');
let RoomManager =  new rooms.RoomManager();

const problems = require('./server/problem');
const e = require('express');
let ProblemGenerator = new problems.ProblemGenerator();

//SOCKET EVENTS
game.on('connection', function(socket){
    console.log('made socket connection ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
        
        let room = RoomManager.removePlayer(socket.id);
        console.log('removed from' + room);
        if(room != undefined){
            if(RoomManager.playerCount(room) == 0){
                RoomManager.removeRoom(room);
            }else{
                game.in(room).emit('update-players', {
                    room: room,
                    players: RoomManager.getPlayers(room)
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
        game.to(socket.id).emit('join', { room: room });
        game.in(room).emit('update-players', { players: RoomManager.getPlayers(room) }); 

    });

    socket.on('join', (data) => {
        //check if the room exists
        if(RoomManager.containsRoom(data.room)){
            socket.join(data.room); //join the room
            RoomManager.addPlayer(data.room, socket.id, data.name);//add player to room

            //send back the room code 
            game.to(socket.id).emit('join', { room: data.room });
            game.in(data.room).emit('update-players', { players: RoomManager.getPlayers(data.room) });    

        }
    });

    socket.on('ready', (data) => {
        RoomManager.resetRoom(data.room);
        game.in(data.room).emit('update-players', { players: RoomManager.getPlayers(data.room) });  

        let problemData = ProblemGenerator.newProblem(); // { problem, solution }
        game.in(data.room).emit('show-problem', problemData);
    });

    socket.on('solve', (data) => {
        RoomManager.updatePlayerTime(data.room, socket.id, data.time);
        RoomManager.appendToOrder(data.room, socket.id);

        //check if all users have answered
        if(RoomManager.checkAllAnswered(data.room)){
            //eliminate the last player
            let roundData = RoomManager.updateAlive(data.room);
            
            game.in(data.room).emit('show-round-info', roundMsg(roundData));
            //send to host
            game.to(RoomManager.getHost(data.room)).emit('show-ready', true); 
        }

        game.in(data.room).emit('update-players', { players: RoomManager.getPlayersByTime(data.room) });

    });
    
});

function roundMsg(roundData){
    let msg = 'Round Complete';
    if(roundData.winner != ''){
        msg += `\n${roundData.winner} wins!`;
    }else{
        msg += roundData.saved != '' ? `\n${roundData.saved} is back!` : '';
        msg += roundData.eliminated != '' ? `\n${roundData.eliminated} eliminated` : '';
    }
    return msg;
}
