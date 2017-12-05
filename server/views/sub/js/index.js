(function ($) {
    const ctx = document.getElementById('canvas').getContext('2d');
    const button = '#add';
    const event = '#events';
    const motion = '#logs';
    const frame = '.image';
    const tbody = 'tbody';
    const family = ['息子', '娘'];
    const socket = io.connect();
    const testdata = [['公の後期', 10, 20, 30, 40, 50, 60, 70, 80, 90], ['ueshima', 10, 20, 30, 40, 50, 60, 70, 80, 90], ['きんきらきん', 10, 20, 30, 40, 50, 60, 70, 80, 90]];
    const colorArray = [
        '#c60019',
        '#fff001',
        '#1d4293',
        '#00984b',
        '#019fe6',
        '#c2007b',
        '#dbdf19',
        '#d685b0',
        '#a0c238',
        '#95ff2b',
        '#ff55aa',
        '#FFB6C1',
        '#F4A460',
        '#6699ff',
    ];
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '幸せ指数',
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgb(255, 0, 0)',
                data: [],
                type: 'line',
            },
            ],
        },
        options: {

            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true,
                }],
            },
        },
    });

    $(() => {


        $(button).on('click', () => {
            // chart.data.labels.splice(0, 1);
            // chart.data.datasets[0].data.splice(0, 1);
            // chart.data.labels.push('新しいの');
            // chart.data.datasets[0].data.push(100);
            // chart.update();
            // console.log(chart.data);
            console.log(chart.data);
            console.log(chart.data.datasets.label);
            // socket.emit('get image');
        });

        socket.on('add date', (date) => {
            const max_size = chart.data.datasets[0].data.length;
            chart.data.datasets[0].data[max_size] = date;
            chart.update();
        });

        // ブラウザ読み込み時にlogを読み込む処理
        socket.emit('get event logs');
        socket.on('read event logs', (text) => {
            const events = text.split(/\r\n|\r|\n/);
            if (events.length > 1) {
                events.forEach((dataset, index) => {
                    $(event).append(`<li>${dataset}</li>`);
                });
            }
        });

        socket.emit('get motion logs');
        socket.on('read motion logs', (text) => {
            const motions = text.split(/\r\n|\r|\n/);
            if (motions.length > 1) {
                motions.forEach((dataset, index) => {
                    $(motion).append(`<li>${dataset}</li>`);
                });
            }
        });


        socket.on('change event logs', (data) => {
            console.log(`event: ${data}`);
            $(event).append(`<li>${data}</li>`);
        });

        socket.on('change motion logs', (data) => {
            console.log(`motion: ${data}`);
            $(motion).append(`<li>${data}</li>`);
        });

        socket.on('voice', (text) => {
            speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        });

        // 画像置き換え処理
        socket.on('image update', (path) => {
            const image = new Image();
            image.src = path;
            // width 416, height 206
            let percentage = 1;
            if (image.width > 416 || image.height > 231) {
                if (image.width >= image.height) {
                    percentage = 416 / image.width;
                } else {
                    percentage = 206 / image.height;
                }
            }
            $(frame).empty();
            $(frame).append(`<img height="${image.width * percentage}" width="${image.height * percentage}" src="${path}"/>`);
            $.text.change(testdata);
        });

        socket.on('graph update', (datas) => {
            // 一番古いデータ削除

            if (chart.data.labels.length >= 10) {
                chart.data.labels.splice(0, 1);
                $.graph.delete();
            }


            for (const key in datas) {
                // datasetsの中身か存在しなかった時の処理
                let flg = false;
                chart.data.datasets.forEach((dataset, index) => {
                // for (const labels in chart.data.datasets.label) {
                    if (dataset.label === key) {
                        flg = true;
                        chart.data.datasets[index].data.push(datas[key]);
                    }
                });

                if (flg === false) {
                    const newDatasets = {
                        backgroundColor: $.graph.randCode(),
                        label: key,
                        data: [],
                    };
                    for (let i = 0; i <= chart.data.labels.length - 1; i++) {
                        newDatasets.data.push(0);
                    }
                    newDatasets.data.push(datas[key]);
                    chart.data.datasets.push(newDatasets);
                }
            }
            const time = moment();
            const outputTime = time.format('HH : mm');

            chart.data.labels.push(`${outputTime}`);
            chart.data.datasets.forEach((dataset, index) => {
                if (chart.data.labels.length !== dataset.data.length) {
                    chart.data.datasets[index].data.push(0);
                }
            });
            chart.update();
            console.log(chart.data.datasets);
        });
    });

    $.graph = {
        add: () => {
            chart.data.datasets.forEach((dataset, index) => {
                dataset.data.push(Math.floor(Math.random() * 101));
            });
        },
        delete: () => {
            chart.data.datasets.forEach((dataset, index) => {
                dataset.data.shift();
            });
        },
        randCode: () => {
            const rand = Math.floor(Math.random() * (colorArray.length - 1));
            console.log(rand);
            const returnCode = colorArray[rand];
            colorArray.splice(rand, 1);
            return returnCode;
        },
        addDataset: () => {
            const length = chart.data.labels.length();
        },
    };

    $.text = {
        change: (list) => {
            $(tbody).empty();
            list.forEach((dataset, index) => {
                // $(tbody).append('<tr></tr>');
                let tr = '<tr>';
                dataset.forEach((data, index) => {
                    tr += `<td>${data}</td>`;
                });
                tr += '</tr>';
                console.log(tr);
                $(tbody).append(tr);
            });
        },
    };

}(jQuery));
