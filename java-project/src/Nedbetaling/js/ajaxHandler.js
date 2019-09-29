
window.onload=function(){

$(document).ready(function() {
var dataPointsA = []
var dataPointsB = []
let averagepayment = 0;
/*  $.ajax({
            type: 'post',
            url: 'Your-URI',
            data: JSON.stringify(SendInfo),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function (data) {
                jsonreturn = data
            }
        });
        */
$.ajax({
  type: 'GET',
  url: 'https://api.myjson.com/bins/bujip',
  dataType: 'json',
  success: function(field) {
    for (var i = 0; i < field.length; i++) {
      averagepayment += field[i].innbetaling
    var date = new Date(field[i].dato)
      dataPointsA.push({
        x: i/12,
        y: field[i].restgjeld
      });
      /* dataPointsB.push({
        x: field[i].time,
        y: field[i].yyy
      }); */
    }
    document.getElementById('averagepayment').innerHTML = "Du vil i gjennomsnitt betale " + averagepayment/field.length + " per måned"
    document.getElementById('antaar').innerHTML ="Det vil ta " + field.length + " måneder. (" + field.length/12 + " år) å betale ned lånet."

    var chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: "Restbeløp over tid"
      },

      data: [{
        type: "line",
        name: "line1",
        dataPoints: dataPointsA
      }, /*{
        type: "line",
        name: "line2",
        dataPoints: dataPointsB
      }, */ ]
    });

    chart.render();
    document.title = "Kodeoppgave"
  }
});
})

  }
