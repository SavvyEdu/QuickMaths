$(function () {

  const room = 'room'
  const socket = io('/game');

  //FORM SUBMIT    
  $('form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    let msg =  $('#m').val()
    //SEND the message and room
    socket.emit('chat', {message: msg, room: room });
    $('#m').val('');
    return false;
  });

  //SOCKET EVENTS

  socket.on('connect', () => {
    console.log('connected to socket')
    //SEND a join event
    socket.emit('join', { room: room });
  });

  socket.on('chat', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });

});