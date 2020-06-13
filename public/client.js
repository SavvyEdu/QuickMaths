$(function () {
    var socket = io();
    $('form').submit(function(e) {
      e.preventDefault(); // prevents page reloading
      socket.emit('chat', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
});