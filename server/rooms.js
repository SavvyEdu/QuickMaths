//Rooms
class RoomManager{
    constructor(){
        //create a new dictionary
        this.MAX_TIME = 1000;
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
        this.rooms[room] = {
            order: [], //array of ids
            players: {}
        };

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
        this.rooms[room].players[id] = {
            username: username,
            time: this.MAX_TIME,
            alive: true
        }

        this.idToRoom[id] = room;
    }

    //Get the number of players in the room
    playerCount(room){
        return Object.keys(this.rooms[room].players).length;
    }

    //Get the socket id of the host player
    getHost(room){
        return Object.keys(this.rooms[room].players)[0];
    }

    getPlayers(room){
        let players = [];
        for(let id in this.rooms[room].players){
            players.push(this.rooms[room].players[id]);
        }
        return players;
    }

    getPlayersByTime(room){
        return this.getPlayers(room).sort((a, b) => a.time - b.time);
    }

    resetRoom(room){
        for(let id in this.rooms[room].players){
            this.updatePlayerTime(room, id, this.MAX_TIME);
        }
        this.rooms[room].order = []; //clear the order 
    }

    appendToOrder(room, id){
        this.rooms[room].order.push(id);
    }

    updatePlayerTime(room, id, time){
        this.rooms[room].players[id].time = time;
    }

    updateAlive(room){
        let data = {
            eliminated: '', //username of eliminated player
            saved: '', //username of first to answer if they were dead
            winner: true //true if all but one player eliminated
        }

        let ord = this.rooms[room].order
        //loop from [last to first), eliminate last alive player to respond
        for(let i = ord.length-1; i > 0; i-- ){
            //check if player is alive
            if(data.eliminated == '' && this.rooms[room].players[ord[i]].alive){
                this.rooms[room].players[ord[i]].alive = false;
                
                console.log(ord + ' ' +  i);
                data.eliminated = this.rooms[room].players[ord[i]].username;
            }

            //winner is true when all others are false
            data.winner = data.winner && !this.rooms[room].players[ord[i]].alive;
        }

        //first player to respond is always safe
        if(!this.rooms[room].players[ord[0]].alive){
            this.rooms[room].players[ord[0]].alive = true;
            
            data.saved =  this.rooms[room].players[ord[0]].username;
        }
        
        console.log(data.eliminated + " " + data.saved + " " + data.winner);

        return data;
    }

    checkAllAnswered(room){
        for(let id in this.rooms[room].players){
            if( this.rooms[room].players[id].time == this.MAX_TIME){
                return false;
            }
        }
        return true;
    }

    removePlayer(id){

        if(id in this.idToRoom){
            let room = this.idToRoom[id];
            delete this.rooms[room].players[id];
            return room; //return room code so room can be updated
        }

        return undefined;
    }
}


module.exports.RoomManager = RoomManager;