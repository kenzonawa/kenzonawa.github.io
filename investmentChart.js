var ctx = document.getElementById("myChart");
ctx.height = 230;
ctx = ctx.getContext('2d');

var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
gradient1.addColorStop(0, '#6b51f2');
gradient1.addColorStop(1, '#a18fff');

var gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
gradient2.addColorStop(0, '#1ee8ea');
gradient2.addColorStop(1, '#44ebec');

var gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
gradient3.addColorStop(0, '#dd4dab');
gradient3.addColorStop(1, '#7746ab');

var dataUS = ['50000', '50880', '51775', '52687','53614', '54558'];
var dataCapital = ['50000', '51150', '52326', '53530', '54761','56021'];
var dataGramercy = ['50000', '54125', '58590', '63424', '68656','74321']

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["1", "2", "3", "4", "5", "6"],
        datasets: [
            {
                data: dataUS,
                backgroundColor: gradient3,
                pointBackgroundColor: '#fff',
                pointRadius : 4,
                pointBorderWidth: 4,
                pointBorderColor: 'rgba(0,0,0,0.2)',
                label: 'US Treasury Bond'
            },
            {
                data: dataCapital,
                backgroundColor: gradient2,
                pointBackgroundColor: '#fff',
                pointRadius : 4,
                pointBorderWidth: 4,
                pointBorderColor: 'rgba(0,0,0,0.2)',
                label: 'Capital One 360 CD'
            },
            {
                data: dataGramercy,
                backgroundColor: gradient1,
                pointBackgroundColor: '#fff',
                pointRadius : 4,
                pointBorderWidth: 4,
                pointBorderColor: 'rgba(0,0,0,0.2)',
                label: 'Gramercy District Phase 1A'
            }
        ]
    },
    options: {
        // String - Template string for single tooltips
        tooltips: {
            callbacks: {
                title: function(tooltipItem, data) {
                    var datasetLabel = data.datasets[tooltipItem[0].datasetIndex].label || 'Other';
                    return datasetLabel;
                  },
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return "$" + formatValue(Math.round(label));
                  }
            }
          },
        responsive: true,
        legend: {
            position: 'bottom',
            display: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    type: 'logarithmic',
                    min: 50000,
                    max: 80000,
                    maxTicksLimit: 5,
                    userCallback: function(value, index, values) {
                        // Convert the number to a string and splite the string every 3 charaters from the end
                        value = value.toString();
                        value = value.split(/(?=(?:...)*$)/);
                        value = value.slice(0, -1);

                        // Convert the array to a string and format the output
                        value = value.join('.');
                        return '$' + value + 'k';
                    }
                }
            }],
            xAxes: [{
                ticks: {
                    type: 'logarithmic',
                    min: 0,
                    max: 5,
                    maxTicksLimit: 6,
                    userCallback: function(value, index, values) {

                        // Convert the array to a string and format the output
                        //value = value.join('.');
                        return 'Year ' + (value-1);
                    }
                }
            }]
        }
    }
});

calculateTotal(50000);

document.getElementById('amount').onchange = function(){
    this.value = normalizeValue(this.value);
    console.log(parseInt(this.value));
    doGraph(parseInt(this.value));
}

function doGraph(amount) {
    calculateInv(amount);
   
    myChart.data.datasets[1].data = dataCapital;
    myChart.data.datasets[2].data = dataGramercy;
     myChart.data.datasets[0].data = dataUS;
    
    
    //show result
    calculateTotal(amount);

    var endValue = normalizeValue(document.getElementById('result').innerHTML);
    endValue = parseInt(endValue.replace('$', ''));

    if(endValue + 10000 > myChart.config.options.scales.yAxes[0].ticks.max) {
        console.log("first");
        while(endValue > myChart.config.options.scales.yAxes[0].ticks.max) {
            myChart.config.options.scales.yAxes[0].ticks.max = myChart.config.options.scales.yAxes[0].ticks.max + 10000;
        }
        console.log(myChart.config.options.scales.yAxes[0].ticks.max);
    }
    else {
        console.log("second");
        while(endValue + 10000 < myChart.config.options.scales.yAxes[0].ticks.max) {
            myChart.config.options.scales.yAxes[0].ticks.max = myChart.config.options.scales.yAxes[0].ticks.max - 10000;
            if(myChart.config.options.scales.yAxes[0].ticks.max == 90000) {
                break;
            }
        }
    }

    var startValue = normalizeValue(document.getElementById("amount").value);
    startValue = parseInt(startValue) || 0;
    myChart.config.options.scales.yAxes[0].ticks.min = startValue;
    myChart.update();
}

function calculateInv(investment) {
    for (i = 0 ; i<dataUS.length ; i++){
        dataUS[i] = investment;
        dataCapital[i] = investment;
        dataGramercy[i] = investment;
    }
    for (i=1 ; i< dataUS.length ; i++) {
        for (j=0; j<i ; j++) dataUS[i] = dataUS[i] + dataUS[i] * (0.0176);
    }
    for (i=1 ; i< dataCapital.length ; i++) {
        for (j=0; j<i ; j++) dataCapital[i] = dataCapital[i] + dataCapital[i] * (0.023);
    }
    for (i=1 ; i< dataGramercy.length ; i++) {
        for (j=0; j<i ; j++) dataGramercy[i] = dataGramercy[i] + dataGramercy[i] * (0.0825);
    }
    
}

function calculateTotal(amount) {
    amount = parseInt(amount) || 0;

    /*if (amount < 50000) {
        amount = 50000;
        document.getElementById('amount').value = formatValue(amount);
    }*/


    for(var i = 1; i <= 5; i++) {
        amount = amount * 1.0825;
    }

    amount = Math.round(amount);
    document.getElementById('result').innerHTML = formatValue(amount);
    handleChange();
}

// Add $ symbol
function handleChange() {
   var myValue = document.getElementById("result").innerHTML;
   if (myValue.indexOf("$") != 0)
   {
      myValue = "$" + myValue;
   }

   document.getElementById("result").innerHTML = myValue;
}

function formatValue(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function normalizeValue(x) {
    return x.replace(/,/g,'');
}

