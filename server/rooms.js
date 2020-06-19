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
            time: 0
        }

        this.idToRoom[id] = room;
    }
    
    playerCount(room){
        return Object.keys(this.rooms[room]).length;
    }

    getPlayers(room){
        let players = [];
        for(let id in this.rooms[room]){
            players.push(this.rooms[room][id]);
        }
        return players;
    }

    updatePlayerTime(room, id, time){
        this.rooms[room][id].time = time;
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