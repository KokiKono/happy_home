(function($){
    const iframe = '#iframe';
    const socket = io.connect('http://' + location.hostname + ':8080');
    $(() => {
        socket.on('portal_sentence', (data) => {
            console.log(`portal_sentence ${data}`);
            $('#sentence')[0].innerHTML = data;
        });
        socket.on('portal_next', (data) => {
            console.log(`portal_next ${data}`);
            $('#next')[0].innerHTML = data;
        });
        socket.on('portal_next_btn', (data) => {
            console.log(`portal_next_btn ${data}`);
            $('#next_btn')[0].innerHTML = data;
        });
    });
}(jQuery));