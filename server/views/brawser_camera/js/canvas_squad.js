window.onload = function() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track('#video', tracker, { camera: true });
    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            context.strokeStyle = '#fff';
            context.strokeRect(rect.x+20, rect.y, rect.width, rect.height);
        });
    });
};