$(function () {

    //FORM SUBMIT

    var socket = io('/game');
    $('form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
      socket.emit('chat', $('#m').val());
      $('#m').val('');
      return false;
    });

    //SOCKET EVENTS

    socket.on('connect', () => {
      console.log('connected to socket')
    });

    socket.on('chat', (msg) => {
      $('#messages').append($('<li>').text(msg));
    });

});