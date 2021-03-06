$('#photo').click(function(){

    //シャッター音の準備
    var audio = new Audio('https://' + location.hostname + ':5000/brawser_camera/sound/Camera-shutter03-1.mp3');

    //音をならす
    // audio.play();

    var formData = new FormData();

    for (var j = 0; j < 10; j++) {

        // if (localMediaStream) {
        //     console.log('ok');
        var canvas = document.getElementById('canvas');
        //canvasの描画モードを2dに
        var ctx = canvas.getContext('2d');
        var img = document.getElementById('img');


        //videoの縦幅横幅を取得
        var w = 1280;
        var h = 960;

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
        formData.append(`images${j}`, blob);

        const headers = {
            'Accept': 'application/json, */*',
            'Content-Type': 'multipart/form-data'
        }
        send(formData);
    }
    var message = '撮影終了';
    document.getElementById("photo").innerHTML = message;
});