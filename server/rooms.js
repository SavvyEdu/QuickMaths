//Rooms
class RoomManager{
    constructor(){
        //create a new dictionary
        this.rooms = {};
        this.id_lookup = {};
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

    addPlayer(room, id, username){
        this.rooms[room].push({
            id: id,
            username: username
        });

        this.id_lookup[id] = room;
    }
    
    playerCount(room){
        return this.rooms[room].length;
    }

    getPlayers(room){
        let usernames = [];
        this.rooms[room].forEach(element => {
            usernames.push(element.username);
        });
        return usernames;
    }

    removePlayer(id){

        if(id in this.id_lookup){
            let room = this.id_lookup[id];
            this.rooms[room] = this.rooms[room].filter((item) => item.id !== id);
    
            return room; //return room code so room can be updated
        }

        return undefined;
    }
}


module.exports.RoomManager = RoomManager;