//Rooms
class RoomManager{
    constructor(){
        //create a new dictionary
        this.rooms = {};
        this.idToRoom = {};
    }  

    addRoom(){
        let room;

        //generate a random 4 letter code
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        do{
            room = '';
            for(let i = 0; i < 4; i++){
                room += letters.charAt(Math.floor(Math.random() * letters.length));
            }

        }while(this.containsRoom(room)); //make sure that room code is not in use

        //add to dictionary
        this.rooms[room] = {};

        console.log('room added: ' + room);
        return room;
    }

    containsRoom(room){
        return room in this.rooms;
    }

    removeRoom(room){
        delete this.rooms[room];
    }   

    addPlayer(room, id, username){
        this.rooms[room][id] = {
            username: username,
            time: 0,
            alive: true
        }

        this.idToRoom[id] = room;
    }

    //Get the number of players in the room
    playerCount(room){
        return Object.keys(this.rooms[room]).length;
    }

    //Get the socket id of the host player
    getHost(room){
        return Object.keys(this.rooms[room])[0];
    }

    getPlayers(room){
        let players = [];
        for(let id in this.rooms[room]){
            players.push(this.rooms[room][id]);
        }
        return players;
    }

    getPlayersByTime(room, sortFunc){
        return this.getPlayers(room).sort((a, b) => a.time - b.time);
    }

    resetPlayerTimes(room){
        for(let id in this.rooms[room]){
            this.updatePlayerTime(room, id, 0);
        }
    }

    updatePlayerTime(room, id, time){
        this.rooms[room][id].time = time;
    }

    checkAllAnswered(room){
        for(let id in this.rooms[room]){
            if( this.rooms[room][id].time == 0){
                return false;
            }
        }
        return true;
    }

    removePlayer(id){

        if(id in this.idToRoom){
            let room = this.idToRoom[id];
            delete this.rooms[room][id];
            return room; //return room code so room can be updated
        }

        return undefined;
    }
}


module.exports.RoomManager = RoomManager;