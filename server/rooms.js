//Rooms
class RoomManager{
    constructor(){
        this.roomsCodes = [];
    }  

    addRoom(){
        let code;
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        do{
            code = '';
            for(let i = 0; i < 4; i++){
                code += letters.charAt(Math.floor(Math.random() * letters.length));
            }
        }while(this.roomsCodes.includes(code));

        console.log('room added: ' + code);
        this.roomsCodes.push(code);
        return code;
    }

    containsRoom(code){
        return this.roomsCodes.includes(code)
    }

    removeRoom(code){
        let index = this.roomsCodes.indexOf(code);
        this.roomsCodes.splice(index, 1);
    }   
}

module.exports.RoomManager = RoomManager;