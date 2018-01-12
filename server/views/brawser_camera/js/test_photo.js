$('#photo').click(function(){

    //シャッター音の準備
    var audio = new Audio('https://' + location.hostname + ':5000/brawser_camera/sound/Camera-shutter03-1.mp3');

    //一瞬反転（戻る）が鏡像するソース
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

    //音をならす
    audio.play();

    var count = 0;

    for (var j = 0; j < 10; j++) {

        // if (localMediaStream) {
        //     console.log('ok');
        var canvas = document.getElementById('canvas');
        //canvasの描画モードを2dに
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('img');


        //videoの縦幅横幅を取得
        var w = 640;
        var h = 480;

        //同じサイズをcanvasに指定
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);

        //canvasにコピー
        // ctx.drawImage(video, 0, 0, w, h);

        //ここから画像のバイナリ化
        var can = canvas.toDataURL('image/jpeg');
        // Data URLからBase64のデータ部分のみを取得
        var base64Data = can.split(',')[1];
        // base64形式の文字列をデコード
        var data = window.atob(base64Data);
        var buff = new ArrayBuffer(data.length);
        var arr = new Uint8Array(buff);

        // blobの生成
        for (var i = 0, dataLen = data.length; i < dataLen; i++) {
            arr[i] = data.charCodeAt(i);
        }
        var blob = new Blob([arr], {
            type: 'image/jpeg'
        });

        //データをセット
        var formData = new FormData();
        formData.append('image' + j, blob);
        
        for(item of formData) console.log(item);
        //非同期通信開始
        // $.ajax({
        //     type: "POST",
        //     url: 'https://' + location.hostname + ':5000/api/image/upload',
        //     data: formData,
        //     contentType: false,
        //     processData: false,
        //     cache: false,
        // }).then(function() {
        //     if (count === 12) {
        //         var message = '撮影が終了しました。';
        //         document.getElementById("message").innerHTML = message;
        //     }
        // });
    }
    var message = '撮影終了';
    document.getElementById("photo").innerHTML = message;
});