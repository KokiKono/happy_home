window.onload = function() {
    var video = document.getElementById("video"),
        features = document.getElementById("canvas"),
        features_ctx;

    function loop () {
        requestAnimationFrame( loop );

        if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

            features_ctx.drawImage( video, 0, 0, 640, 480 );
        }
    }

    function init ( video ) {
        video.play();

        features_ctx = features.getContext( "2d" );
        // flip
        features_ctx.translate( 640, 0 );
        features_ctx.scale( -1, 1 );

        loop();
    }

    // web cam access
    navigator.getUserMedia(
        { video: true },
        function ( stream ) {

            if ( typeof video.mozSrcObject !== "undefined" ) {
                // moz
                video.mozSrcObject = stream;
            } else {
                // others
                video.src = ( window.URL && window.URL.createObjectURL( stream ) ) || stream;
            }

            // 初期処理
            init( video );
        },
        function ( error ) {

            console.log( error );
        }
    );
};