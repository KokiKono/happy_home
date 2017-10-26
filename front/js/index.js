(function($){
  var ctx = document.getElementById("canvas").getContext("2d");
  var button = "#add";

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "February", "March", "April", "May", "June"],
      datasets: [{
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgb(255, 0, 0)',
        data: [100,120,130,100,150,100,120],
        type: 'line',
      },{
        label: '父',
        backgroundColor: 'rgb(255, 99, 132)',
        data:[20, 10, 5, 2, 20, 30, 45, 10, 5, 2, 20, 30, 45],
      },{
        label: '母',
        backgroundColor: 'rgb(255, 99, 0)',
        data:[30, 10, 5, 2, 20, 30, 45],
      },{
        label: '娘',
        backgroundColor: 'rgb(0, 99, 132)',
        data:[40, 10, 5, 2, 20, 30, 45],
      },
    ]},
    options:{

      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      },
    }
  });

  $(function(){
    $(button).on('click',function(){
      var max_size = chart.data.datasets[0].data.length;
      chart.data.datasets[0].data[max_size] = Math.floor( Math.random() * (100 + 1 - 1) ) + 1 ;;
      chart.update();
    });
  });

  $.graph = {

  }

})(jQuery);
