
  window.onload=function(){
class ajaxBody{

  constructor(){

  }


}


function tegnPunkter(jsonresult) {
var dataPointsA = []
var dataPointsB = []
let averagepayment = 0;

    for (var i = 0; i < jsonresult.length; i++) {

      averagepayment += jsonresult[i].innbetaling -0
    var date = new Date(jsonresult[i].dato)
      dataPointsA.push({
        x: i/12,
        y: jsonresult[i].restgjeld
      });
      /* dataPointsB.push({
        x: field[i].time,
        y: field[i].yyy
      }); */
    }
    document.getElementById('averagepayment').innerHTML = "Du vil i gjennomsnitt betale " + averagepayment/jsonresult.length + " per måned"
    document.getElementById('antaar').innerHTML ="Det vil ta " + jsonresult.length + " måneder. (" + jsonresult.length/12 + " år) å betale ned lånet."

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


$(document).ready(function(){ // USE $
let notpressed = true;

  $('.daterange').on('change', function () {
    let daterange = document.getElementById('daterange').value
    let dato = document.getElementById('date').value


      postTilStacc()
  });
  $('.staccskjema').on('submit', function () {
      rangeSaveToHidden();
      postTilStacc()
      notpressed = false;
      let x =
      document.getElementById('range-span').style.display ='inline'
      document.getElementById('range-span').classList.add('smoother')
      return false;

  });
});
function rangeSaveToHidden(){
  document.getElementById('dateForRange').value = document.getElementById('date').value
}
function clearHidden(){
  document.getElementById('dateForRange').value= ""
}
function dateRangeNearest(daterangevalue, dato){
  let savedDate = new Date(dato)
  savedDate.setYear(savedDate.getFullYear()+(daterangevalue-0))
  let datestring = formatDate(savedDate)
  console.log(daterangevalue)
  if(daterangevalue !== "0"){
    document.getElementById('rangetext').innerHTML = savedDate.getFullYear()
  } else if (daterangevalue === "0"){
    console.log("fooo")
    document.getElementById('rangetext').innerHTML = "Dra slideren for å endre fullføringsår"
  }

  return datestring
}
function postTilStacc(){

  let belop = document.getElementById('belop').value
  let rangevalue = document.getElementById('daterange').value
  let dato = document.getElementById('date').value
  let hiddenDate = document.getElementById('dateForRange').value
    dato = dateRangeNearest(rangevalue, hiddenDate)
    $('.innbetalingsdato').datepicker("setDate", dato);


  let utbetalingsdato = document.getElementById('utbetalingdate').value
  let forstebetaling = document.getElementById('forstebetalingdate').value

  let belopint = belop -0
  let payload =   {
    "laanebelop":belopint,
    "nominellRente":3,
    "terminGebyr": 30,
    "utlopsDato":dato,
    "saldoDato":utbetalingsdato,
    "datoForsteInnbetaling":forstebetaling,
    "ukjentVerdi":"TERMINBELOP"
  }


$.ajax({
              type: 'post',
              url: 'https://visningsrom.stacc.com/dd_server_laaneberegning/rest/laaneberegning/v1/nedbetalingsplan',
              data: JSON.stringify(payload),
              contentType: "application/json; charset=utf-8",
              traditional: true,
              success: function(data) {
                tegnPunkter(data.nedbetalingsplan.innbetalinger)

              }});

}}
