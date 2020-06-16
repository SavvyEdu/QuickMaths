//Rooms
class RoomManager{
    constructor(){
        //create a new dictionary
        this.rooms = {};
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
        this.rooms[room] = []

        console.log('room added: ' + room);
        return room;
    }

    containsRoom(room){
        return room in this.rooms;
    }

    removeRoom(room){
        delete this.rooms[room];
    }   

    addPlayer(room, username){
        if(this.containsRoom(room)){
            this.rooms[room].push(username);
            return true;
        }
        return false;
    }

    playerCount(room){
        return this.rooms[room].length;
    }

    getPlayers(room){
        return this.rooms[room];
    }

    removePlayer(room, username){

    }
}


module.exports.RoomManager = RoomManager;