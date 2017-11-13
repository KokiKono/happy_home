(function ($) {
    const ctx = document.getElementById('canvas').getContext('2d');
    const button = '#add';
    const event = '#events';
    const motion = '#logs';
    const socket = io.connect('http://localhost:8080');
    // var socket = io.connect('http://localhost');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
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
            chart.data.labels.splice(0, 1);
            chart.data.datasets[0].data.splice(0, 1);
            chart.data.labels.push('新しいの');
            chart.data.datasets[0].data.push(100);
            chart.update();
        });

        socket.on('add date', (date) => {
            const max_size = chart.data.datasets[0].data.length;
            chart.data.datasets[0].data[max_size] = date;
            chart.update();
        });

        socket.on('change event logs', (data) => {
            console.log(`event: ${data}`);
            $(event).append(`<li>${data}</li>`);
        });

        socket.on('change motion logs', (data) => {
            console.log(`motion: ${data}`);
            $(motion).append(`<li>${data}</li>`);
            window.scrollTo(0, motion.scrollHeight);
        });

        socket.on('voice', (text) => {
            speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        });

        socket.on('graph update', (data) => {
            chart.data.labels.splice(0, 1);
            // chart.data.datasets[0].data.splice(0, 1);
            $.graph.delete();
            chart.data.labels.push('新しいの');
            $.graph.add();
            // chart.data.datasets[0].data.push(data);
            chart.update();
        });
    });

    //todo グラフ削除部分検証中
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
    };

}(jQuery));
