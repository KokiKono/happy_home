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
            tooltips: {
              enabled: false,
            },
            plugins: {
              datalabels: {
                  color: 'white',
                  display() {
                      return 1; // display labels with an odd index
                  },
                  font: {
                      wight: 'bold',
                      size: 19,
                  },
                  textAlign: 'center',
                  // formatter: Math.round,
                  formatter(value, context) {
                      if (context.dataset.label !== '幸せ指数') {
                          if(Math.round(value)  != 0) {
                              return `${context.dataset.label}\n${Math.round(value)}`;
                          }
                      }
                          return null;
                  },
              },
            },
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
            const image = new Image();
            image.src = './abc.jpg';
            // width 634, height 314
            let percentage = 1;
            $(image).bind('load', () => {
                console.log(image.naturalWidth);
                console.log(image.naturalHeight);
                if (image.width > 634 || image.height > 314) {
                    if (image.width <= image.height) {
                        percentage = 634 / image.width;
                    } else {
                        percentage = 314 / image.height;
                    }
                }
                $(frame).empty();
                $(frame).append(`<img height="${image.height * percentage}" width="${image.width * percentage}" src="./abc.jpg"/>`);
            });
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
        socket.on('image update', (path, data) => {
            const image = new Image();
            image.src = path;
            // width 634, height 314
            let percentage = 1;
            $(image).bind('load', () => {
                console.log(image.naturalWidth);
                console.log(image.naturalHeight);
                if (image.width > 634 || image.height > 314) {
                    if (image.width <= image.height) {
                        percentage = 634 / image.width;
                    } else {
                        percentage = 314 / image.height;
                    }
                }
                $(frame).empty();
                $(frame).append(`<img height="${image.height * percentage}" width="${image.width * percentage}" src="${path}"/>`);
            });
            const emotionData = data.map(dataItem => {
                return dataItem.map((emotionItem, index) => {
                    if (index === 0) {
                        return emotionItem[index];
                    }
                    return (emotionItem * 100).toFixed(3);
                });
            });
            $.text.change(emotionData);
        });

        socket.on('graph update', (datas) => {
            console.log(datas);
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
                        if (datas[key].num < 20 && key !== '幸せ指数') {
                            chart.data.datasets[index].data.push(datas[key].minus);
                        } else {
                            chart.data.datasets[index].data.push(datas[key].num);
                        }
                        flg = true;
                    }
                });

                if (flg === false) {
                    const newDatasets = {
                        backgroundColor: datas[key].color,
                        label: key,
                        data: [],
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 5,
                    };
                    for (let i = 0; i <= chart.data.labels.length - 1; i++) {
                        newDatasets.data.push(0);
                    }
                    if (datas[key].num < 20 && key !== '幸せ指数') {
                        newDatasets.data.push(datas[key].minus);
                    } else {
                        newDatasets.data.push(datas[key].num);
                    }
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
