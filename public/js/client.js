let room = 'ffff'; //room this player has joined
let socket; //socket ref

let solution; //solution to the given problem

let username = '';
let isHost = false;

let startTime = 0;

$(function () {

  socket = io('/game');

  //SOCKET EVENTS

  socket.on('connect', () => {
    console.log('connected to socket');
  });

  socket.on('join', (data) => {
    room = data.room; //set the room
    $('#code-display').text(data.room); //show the room
    setMenuState('READY');
  });

  socket.on('update-players', (data) => {  
   
    //update the player count
    let count = data.players.length
    $('#player-count').text(count);

    //update the names
    $('#name-table').empty();
    //add table header 
    $('#name-table').append('<tr><th>Name</th><th>Time</th></tr>');

    for(let i = 0; i < count; i++){
      let {username, time, alive} = data.players[i];
      let cls = alive ? '' : 'class = neu-inMin-alt';
      let row = `<tr><td ${cls}>${username}</td><td ${cls}>${time == 1000 ? '--' : time}</td></tr>`;
      let element = $('#name-table').append(row);
    }
  });

  socket.on('show-ready', (data) => {
    if(data){ show('#ready-button'); }
  })

  socket.on('show-round-info', (data) => {
    $('#round-info').text(data);
  })

  socket.on('show-problem', (data) => {
    setMenuState('PROBLEM');
    solution = data.solution; //store the solution
    $('#problem').text(data.problem);

    //start the timer
    startTime = Date.now();
  });

});

//MENU AND NAVIGATION 

let hide = (id) => $(id).addClass('hidden');
let show = (id) => $(id).removeClass('hidden'); 

function setMenuState(state){
    console.log("state: " + state);
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
          hide('#ready-button'); //hide the ready button for non host
          show('#join-menu');
          show('#code-menu');
          break;
        case 'READY':
          hide('#room-menu');
          show('#game-menu');  
          show('#players-menu');
          hide('#problem-menu');
          break;
        case 'PROBLEM':
          hide('#ready-button'); //hide ready from host
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
    let milliseconds = Date.now() - startTime;
    socket.emit('solve', {name: username, room: room, time: milliseconds / 1000 });
    setMenuState('READY');
  }

  return false;
});