'use strict';

const apiUrl = 'http://'+ location.hostname +':8080/api/event/animations';
let isPaused = false;

$(() => {
	const target = $('div#target');

	if (!target[0]) {
		console.log('要素が見つかりません');
		return;
	}

	const observer = new MutationObserver((mutationRecords, mutationObserver) => {
		// 再生開始時
		if (target.hasClass('anm-state-playing')) {
			// ここに再生開始時に実行したい処理を書く
			if (isPaused) {
				console.log('resume!');
				postStatus('resume');
			}
			else {
				console.log('playing!');
				postStatus('start');
			}
		}
		// 一時停止時
		else if (target.hasClass('anm-state-paused')) {
			// ここに一時停止時に実行したい処理を書く
			console.log('paused!');
			isPaused = true;
			postStatus('pause');
		}
		// 再生終了時
		else if (target.hasClass('anm-state-stopped')) {
			// ここに再生終了時に実行したい処理を書く
			console.log('finished!');
			postStatus('end');
		}
	});
	const config = {
		// 対象ノードの属性の監視を有効にする
		attributes: true
	};
	observer.observe(target[0] , config);
});

// 指定されたPOSTリクエストを送る
function postStatus(status) {
	$.ajax({
		url: apiUrl,
		type: 'POST',
		dataType: 'json',
		data: {'type': status},
		timeout: 1000,
	}).done((data) => {
		console.log('POST succeed!')
		console.log(data);
	}).fail((XMLHttpRequest, textStatus, errorThrown) => {
		console.log('POST failed...')
		console.log('HttpStatus: ' + XMLHttpRequest.status)
		console.log('TextStatus: ' + textStatus)
		console.log('ErrorThrown: ' + errorThrown)
	});
}

// 実行したい任意の関数
function hoge() {
	console.log('called hoge function!!');
}
