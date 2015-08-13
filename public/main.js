var pictionary = function() {
    var socket = io(); // need this to connect to socket
    var canvas, context, guessBox;
    var drawing = false;
    var guesses = $('#guesses');

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    var addGuess = function(guess) {
        guesses.text(guess);
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function() {
        drawing = true;
    });
    canvas.on('mouseup', function() {
        drawing = false;
    });
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};

        if (drawing) {
            socket.emit('draw', position);
            draw(position);
        }
    });

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        var guess = guessBox.val();
        console.log(guess);
        socket.emit('guess', guess);
        guessBox.val('');
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    socket.on('draw', draw);
    socket.on('guess', addGuess);
};

$(document).ready(function() {
    pictionary();
});