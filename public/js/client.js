let room = 'ffff'; //room this player has joined
let socket; //socket ref

let solution; //solution to the given problem

let username = '';
let isHost = false;

$(function () {

  socket = io('/game');

  //SOCKET EVENTS

  socket.on('connect', () => {
    console.log('connected to socket');
  });

  socket.on('update-players', (data) => {  
    room = data.room

    let count = data.players.length

    $('#code-display').text(data.room);
    $('#player-count').text(count);

    //update the names

    $('#name-table').empty();
    $('#name-table').append('<tr><th>Name</th><th>Time</th></tr>');
    for(let i = 0; i < count; i++){
      let row = `<tr><td>${data.players[i].username}</td><td>${data.players[i].time}</td></tr>`
      $('#name-table').append(row);
    }


    setMenuState('READY');
  })

  socket.on('show-problem', (data) => {
    setMenuState('PROBLEM');
    solution = data.solution; //store the solution
    $('#problem').text(data.problem);
  });

});

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
          hide('#problem-menu');
          show('#join-menu');
          show('#code-menu');
          break;
        case 'READY':
          hide('#room-menu');
          show('#game-menu');  
          show('#players-menu');
          hide('#problem-menu');
          if(!isHost){ //only the host can set start the game
            hide('#ready-button')
          }
          break;
        case 'PROBLEM':
          hide('#players-menu');
          show('#problem-menu');
          break;
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

$('#problem-form').submit(function(e) {
  e.preventDefault(); // prevents page reloading
  console.log("problem form submit");
  
  let answer = parseInt($('#s').val());

  if(answer == solution){
    console.log("CORRECT");
    socket.emit('solve', {name: username, room: room, time: 1.5 });
    setMenuState('READY');
  }

  return false;
});