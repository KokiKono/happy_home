(function ($) {
    const ctx = document.getElementById('canvas').getContext('2d');
    const button = '#add';
    const event = '#events';
    const motion = '#logs';
    const family = ['息子', '娘'];
    const socket = io.connect();
    // var socket = io.connect('http://localhost');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: '幸せ指数',
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgb(255, 0, 0)',
                data: [100, 120, 130, 100, 150, 100, 120],
                type: 'line',
            }, {
                label: '父',
                backgroundColor: 'rgb(255, 99, 132)',
                data: [20, 10, 5, 2, 20, 30, 45],
            }, {
                label: '母',
                backgroundColor: 'rgb(255, 99, 0)',
                data: [30, 10, 5, 2, 20, 30, 45],
            }, {
                label: '娘',
                backgroundColor: 'rgb(0, 99, 132)',
                data: [40, 10, 5, 2, 20, 30, 45],
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
            events.forEach((dataset, index) => {
                $(event).append(`<li>${dataset}</li>`);
            });
        });

        socket.emit('get motion logs');
        socket.on('read motion logs', (text) => {
            const events = text.split(/\r\n|\r|\n/);
            events.forEach((dataset, index) => {
                $(motion).append(`<li>${dataset}</li>`);
            });
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

        socket.on('graph update', (datas) => {
            // 一番古いデータ削除

            if (chart.data.labels.length >= 10) {
                chart.data.labels.splice(0, 1);
                $.graph.delete();
            }

            datas.forEach((data, index) => {
                // datasetsの中身か存在しなかった時の処理
                if (chart.data.datasets[index] === undefined) {
                    const newDatasets = {
                        backgroundColor: $.graph.randCode(),
                        label: family[(index + 1) % 2],
                        data: [],
                    };
                    // const length = chart.data.labels.length;
                    // console.log(length);
                    for (let i = 0; i <= chart.data.labels.length - 1; i++) {
                        newDatasets.data.push(0);
                    }
                    newDatasets.data.push(data);
                    chart.data.datasets.push(newDatasets);
                } else {
                    chart.data.datasets[index].data.push(data);
                }
            });

            if (datas.length < chart.data.datasets.length) {
                for (let len = datas.length; len < chart.data.datasets.length; len++) {
                    chart.data.datasets[len].data.push(0);
                }
            }
            const time = moment();
            const outputTime = time.format('HH : mm');

            chart.data.labels.push(`${outputTime}`);
            // $.graph.add();
            // chart.data.datasets[0].data.push(data);
            chart.update();
            // console.log(chart.data.datasets);
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
        randCode: () => `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
        addDataset: () => {
            const length = chart.data.labels.length();
        },
    };

    $.log = {
        eventAll: () => {

        },
        motionAll: () => {

        },
    };

}(jQuery));
