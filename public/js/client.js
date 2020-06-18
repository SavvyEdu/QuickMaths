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

  socket.on('update-players', (data) => {  
    room = data.room
    let count = data.names.length

    $('#code-display').text(data.room);
    $('#player-count').text(count);

    //update the names
    $('#players').empty();
    for(let i = 0; i < count; i++){
        $('#players').append($('<li>').text(data.names[i]));
    }
   
    setMenuState('READY');
  })

  socket.on('chat', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('show-problem', (data) => {
    console.log('show');
    $('#problem').text(data.problem);
  });

});

let username = '';
let isHost = false;

//MENU AND NAVIGATION 

let hide = (id) => $(id).addClass('hidden');
let show = (id) => $(id).removeClass('hidden'); 

function setMenuState(state){
    console.log(state);
    switch(state){
        case 'INITIAL':
          hide('#code-menu');
          hide('#join-menu');
          hide('#game-menu');
          show('#initial-menu');
          break;
        case 'HOST':
          isHost = true;
          hide('#initial-menu');
          show('#join-menu');
          break;
        case 'JOIN':
          isHost = false;
          hide('#initial-menu');
          show('#join-menu');
          show('#code-menu');
          break;
        case 'READY':
          hide('#room-menu');
          show('#game-menu');  
        case 'PROBLEM':
          hide('#player-menu');
          show('#problem-menu');
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

$('#ready-button').click(function(){
  socket.emit('ready', {room: room});
});