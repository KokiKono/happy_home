// $(function() {
// 	//videoタグを取得
// 	var video = document.getElementById('video');
// 	//カメラが起動できたかのフラグ
// 	var localMediaStream = null;
// 	//カメラ使えるかチェック
// 	var hasGetUserMedia = function() {
// 		return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
// 	};
//
// 	//エラー
// 	var onFailSoHard = function(e) {
// 		console.log('エラー!', e);
// 	};
//
// 	if(!hasGetUserMedia()) {
// 		alert("未対応ブラウザです。");
// 	} else {
// 		window.URL = window.URL || window.webkitURL;
// 		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
// 		navigator.getUserMedia({video: true}, function(stream) {
// 			video.src = window.URL.createObjectURL(stream);
// 			localMediaStream = stream;
// 		}, onFailSoHard);
// 	}
//
// 	//session start
// 	window.sessionStorage.setItem(['count'],[0]);
//
//
// 	//キーボード押下を検知したら処理スタート
// 	document.onkeydown = keydown_p;
// 	function keydown_p() {
//
// 		//シャッター音の準備
// 		var audio = new Audio('http://' + location.hostname + ':8080/brawser_camera/sound/Camera-shutter03-1.mp3');
//
// 		if (localMediaStream) {
// 			var canvas = document.getElementById('canvas');
// 			//canvasの描画モードを2sに
// 			var ctx = canvas.getContext('2d');
// 			var img = document.getElementById('img');
//
// 			//videoの縦幅横幅を取得
// 			var w = video.offsetWidth;
// 			var h = video.offsetHeight;
//
// 			//同じサイズをcanvasに指定
// 			canvas.setAttribute("width", w);
// 			canvas.setAttribute("height", h);
//
// 			//canvasにコピー
// 			ctx.drawImage(video, 0, 0, w, h);
// 		}
//
// 		//ここから画像のバイナリ化
// 		var can = canvas.toDataURL();
// 		// Data URLからBase64のデータ部分のみを取得
// 		var base64Data = can.split(',')[1];
// 		// base64形式の文字列をデコード
// 		var data = window.atob(base64Data);
// 		var buff = new ArrayBuffer(data.length);
// 		var arr = new Uint8Array(buff);
//
// 		// blobの生成
// 		for(var i = 0, dataLen = data.length; i < dataLen; i++){
// 			arr[i] = data.charCodeAt(i);
// 		}
// 		var blob = new Blob([arr], {type: 'image/jpeg'});
//
// 		//データをセット
// 		var formData = new FormData();
// 		formData.append('image', blob);
//
// 		//非同期通信開始
// 		$.ajax({
// 			type: "POST",
// 	        url: 'http://' + location.hostname + ':8080/api/image/upload',
// 	        data: formData,
// 			contentType: false,
// 			processData: false,
// 			cache : false,
// 	    }).then(function(){
// 			var count = window.sessionStorage.getItem(['count']);
// 			var message = '残り' + (9 - Number(count)) + '枚';
// 			document.getElementById("message").innerHTML = message;
// 			//音をならす
// 			if(count < 9){
// 				audio.play();
// 				count++;
// 				window.sessionStorage.setItem(['count'],[count]);
// 				setTimeout(keydown_p, 500);
// 			}else{
// 				window.sessionStorage.clear();
// 				var message = '撮影が終了しました。';
// 				document.getElementById("message").innerHTML = message;
// 			}
// 		});
// 	};
// });

$(function() {
    //videoタグを取得
    var video = document.getElementById('video');
    //カメラが起動できたかのフラグ
    var localMediaStream = null;
    //カメラ使えるかチェック
    var hasGetUserMedia = function() {
        return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    };

    //エラー
    var onFailSoHard = function(e) {
        console.log('エラー!', e);
    };

    if (!hasGetUserMedia()) {
        alert("未対応ブラウザです。");
    } else {
        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.getUserMedia({
            video: true
        }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            localMediaStream = stream;
        }, onFailSoHard);
    }

    //キーボード押下を検知したら処理スタート
    document.onkeydown = keydown_p;

    function keydown_p() {

        //シャッター音の準備
        var audio = new Audio('http://' + location.hostname + ':8080/brawser_camera/sound/Camera-shutter03-1.mp3');

        //音をならす
        audio.play();

        var count = 0;

        for (var j = 0; j < 10; j++) {

            count++;

            if (localMediaStream) {
                var canvas = document.getElementById('canvas');
                //canvasの描画モードを2dに
                var ctx = canvas.getContext('2d');
                var img = document.getElementById('img');


                //videoの縦幅横幅を取得
                var w = video.offsetWidth;
                var h = video.offsetHeight;

                //縮小
                // var width = 800;
                // var ratio = width / w;
                // var height = h * ratio;
                // console.log(width);
                // console.log(height);

                //同じサイズをcanvasに指定
                canvas.setAttribute("width", w);
                canvas.setAttribute("height", h);

                //canvasにコピー
                ctx.drawImage(video, 0, 0, w, h);
            }

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
            formData.append('image', blob);

            //非同期通信開始
            $.ajax({
                type: "POST",
                url: 'http://' + location.hostname + ':8080/api/image/upload',
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
            }).then(function() {
                if (count === 10) {
                    var message = '撮影が終了しました。';
                    document.getElementById("message").innerHTML = message;
                }
            });
        }
    };
});