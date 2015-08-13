var pictionary = function() {
    var socket = io(); // need this to connect to socket
    var canvas, context;
    var drawing = false;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
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

    socket.on('draw', draw);
};

$(document).ready(function() {
    pictionary();
});