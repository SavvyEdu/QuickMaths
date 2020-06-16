let room = 'ffff'
let socket;

$(function () {

  socket = io('/game');

  //FORM SUBMIT    
  $('form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    let msg =  $('#m').val()

    //SEND the message and room
    if(msg != ""){
      socket.emit('chat', {name: username, message: msg, room: room });
    }
    
    return false;
  });

  //SOCKET EVENTS

  socket.on('connect', () => {
    console.log('connected to socket');
  });

  socket.on('room', (data) => {  
    
    let count = data.names.length

    $('#code-display').text(data.room);
    $('#player-count').text(count);

    //update the names
    $('#players').empty();
    for(let i = 0; i < count; i++){
        $('#players').append($('<li>').text(data.names[i]));
    }
   
    setMenuState('GAME');
  })

  socket.on('chat', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });

});

let username = '';
let isHost = false;

//MENU AND NAVIGATION 

let hideMenu = (id) => $(id).addClass('hidden');
let showMenu = (id) => $(id).removeClass('hidden'); 

function setMenuState(state){
    console.log(state);
    switch(state){
        case 'INITIAL':
          hideMenu('#code-menu');
          hideMenu('#join-menu');
          hideMenu('#game-menu');
          showMenu('#initial-menu');
          break;
        case 'HOST':
          isHost = true;
          hideMenu('#initial-menu');
          showMenu('#join-menu');
          break;
        case 'JOIN':
          isHost = false;
          hideMenu('#initial-menu');
          showMenu('#join-menu');
          showMenu('#code-menu');
          break;
        case 'GAME':
          hideMenu('#room-menu');
          showMenu('#game-menu')  
    }
}

//NAVIGATION
setMenuState('INITIAL')
$('#host-button').click(() => setMenuState('HOST'));
$('#join-button').click(() => setMenuState('JOIN'));
$('#back-button').click(() => setMenuState('INITIAL'));

$('#start-button').click(function(){
    let code =  $('#code').val();
    username =  $('#name').val();

    if(isHost){
      if(username != ""){
        socket.emit('host', { name: username })
      }
    }else{
      if(username != ""){
        //SEND a join event
        socket.emit('join', { name: username, room: code });
      }
    }

});