
  window.onload=function(){
class ajaxBody{

  constructor(){

  }


}


function plotGraf(json){
  console.log(json[0])

  console.log(json[0].innbetaling)
  var labels = []
  var data = []
  let averagepayment = 0;
  for(let i = 0; i<json.length;i++){
    averagepayment += json[i].innbetaling -0
    labels[i] = json[i].dato
    data[i] = json[i].restgjeld
  }

  var ctx = canvas.getContext('2d');
  var config = {
     type: 'line',
     data: {
        labels: labels,
        datasets: [{
           label: 'Resterende gjeld',
           data: data,
           borderColor: 'rgba(245, 158, 66, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
     }
  };
  let average = (averagepayment/json.length).toFixed(2)
  let lengde = json.length
  printFaktaTilHTML(average, lengde)
  var chart = new Chart(ctx, config);
}

function printFaktaTilHTML(average, lengde){

  document.getElementById('averagepayment').innerHTML = "Du vil i gjennomsnitt betale " + average + " kroner per måned."
  document.getElementById('antaar').innerHTML ="Lånet vil gå over " + (lengde/12).toFixed(2) + " år (" + lengde + " måneder)."
  let mndlonn = document.getElementById('mndlonn').value
  let pengerAlevePa = (mndlonn - average).toFixed(2)
  console.log(mndlonn)
  console.log("wtf")
  if(pengerAlevePa < 8000 && mndlonn-0 !== 0){
    document.getElementById('warningtext').innerHTML = "Månedspriser er sannsynligvis for høy for din inntekt og vil gi deg " + pengerAlevePa + " å bruke i måneden. Forsøk å sette datoen litt lenger bak"
  }else{
    document.getElementById('warningtext').innerHTML = ""
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
    document.getElementById('averagepayment').innerHTML = "Du vil i gjennomsnitt betale " + (averagepayment/jsonresult.length).toFixed(2) + " kroner per måned."
    document.getElementById('antaar').innerHTML ="Lånet vil gå over " + (jsonresult.length/12).toFixed(2) + " år (" + jsonresult.length + " måneder)."

    var chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: ""
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
let notpressed = true

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
      document.getElementById('faktaboks-right').style.display='inline'
      return false;

  });
});
function rangeSaveToHidden(){
  document.getElementById('dateForRange').value = document.getElementById('date').value
}
function clearHidden(){
  document.getElementById('dateForRange').value= ""
}
let ikkeslidet = true
function dateRangeNearest(daterangevalue, dato){
  let savedDate = new Date(dato)
  savedDate.setYear(savedDate.getFullYear()+(daterangevalue-0))
  let datestring = formatDate(savedDate)
  console.log(daterangevalue)
  if(daterangevalue !== "0"){
    document.getElementById('rangetext').innerHTML = savedDate.getFullYear()
  } else if (daterangevalue === "0"){
    console.log("fooo")
    if(ikkeslidet){
    document.getElementById('rangetext').innerHTML = "Dra slideren for å gå opp eller ned noen år"
    ikkeslidet = false;
  } else{
    document.getElementById('rangetext').innerHTML = "Velg ny dato i skjemaet og trykk 'Submit' for å endre strekningen av årstall"
  }
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
                plotGraf(data.nedbetalingsplan.innbetalinger)

              }});

}}