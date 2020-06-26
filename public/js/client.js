let room = 'ffff'; //room this player has joined
let socket; //socket ref

let problems = [];
let problemIndex = 0;

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
      let cls = alive ? '' : 'class = dq';
      let row = `<tr><td ${cls}>${username}</td><td ${cls}>${time == 1000 ? '--' : time}</td></tr>`;
      let element = $('#name-table').append(row);
    }
  });

  socket.on('show-ready', (data) => {
    if(data){ 
      show('#ready-button'); 
    }else{
      hide('#ready-button');
    }
  })

  socket.on('show-round-info', (data) => {
    $('#round-info').text(data);
  })

  socket.on('show-problem', (data) => {
    setMenuState('PROBLEM');

    problems = data;
    problemIndex = 0;

    $('#problem').text(problems[problemIndex].problem);

    //start the timer
    startTime = Date.now();
  });

  $('#num-problems-output').text(`Problems: ${ $('#num-problems').val() }`);
  $('#num-problems').change(function(){
    $('#num-problems-output').text(`Problems: ${ $('#num-problems').val() }`);
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
          show('#host-menu');
          show('#join-menu');
          break;
        case 'JOIN':
          isHost = false;
          hide('#initial-menu');
          hide('#problem-menu');
          hide('#host-menu');
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

    let numProblems = $('#num-problems').val();
    let add = $('input[name=add]').is(':checked');
    let sub = $('input[name=sub]').is(':checked');
    let mul = $('input[name=mul]').is(':checked');
    let div = $('input[name=div]').is(':checked');

    if(isHost){
      if(username != "" && (add || sub || mul || div)){
        socket.emit('host', { 
          name: username, 
          problemData: [numProblems, add, sub, mul, div], 
        });
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

  if(answer == problems[problemIndex].solution){

    problemIndex ++;
    if(problemIndex >= problems.length){
      let milliseconds = Date.now() - startTime;
      socket.emit('solve', {name: username, room: room, time: milliseconds / 1000 });
      setMenuState('READY');
    }else{
      $('#problem').text(problems[problemIndex].problem);
    }
  }

  return false;
});
