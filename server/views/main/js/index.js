(function($){
    const iframe = '#iframe';
    const socket = io.connect('http://localhost:8080');
    $(() => {
        socket.on('url', (data) => {
            console.log(`url: ${data}`);
            $(iframe).attr("src", "");
            $(iframe).attr("src", data);
        });
    });
}(jQuery));