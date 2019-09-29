
let myChart;

function plotGraf(json) {
    var labels = []
    var data = []
    let averagepayment = 0
    let averagerenter = 0
    for (let i = 0; i < json.length; i++) {
        averagepayment += json[i].innbetaling - 0
        averagerenter += json[i].renter - 0
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
    let average = (averagepayment / json.length).toFixed(2)
    let lengde = json.length
    let renter = (averagerenter / json.length).toFixed(2)
    printFaktaTilHTML(average, lengde, renter)
    myChart = new Chart(ctx, config);
}

//For å unngå memory leaks og at grafene plottes oppå hverandre, må den gamle fjernes.
function destroyChart() {
    if (myChart) {
        myChart.destroy()
        console.log("chart destroyed")
    } else {
        console.log("no chart found")
    }
}

function printFaktaTilHTML(average, lengde, renter) {
    document.getElementById('antaar').innerHTML = "Lånet vil gå over <span style='color:#991c00'>" + (lengde / 12).toFixed(2) + "</span> år (<span style='color:#991c00'>" + lengde + "</span> måneder)."
    if (lengde > 0) {
        document.getElementById('averagepayment').innerHTML = "Du vil i gjennomsnitt betale <span style='color:#991c00'>" + average + "</span> kroner per måned."
        document.getElementById('rentepm').innerHTML = "Av <span style='color:#991c00'>" + average + "</span> kroner i måneden er går gjennomsnittlig <span style='color:#991c00'>" + renter + "</span> kroner til renter."
        let mndlonn = document.getElementById('mndlonn').value
        let pengerAlevePa = (mndlonn - average).toFixed(2)
        if (pengerAlevePa < 8000 && mndlonn - 0 !== 0) {
            document.getElementById('warningtext').innerHTML = "Månedspriser er sannsynligvis for høy for din inntekt og vil gi deg <span style='color:#991c00'>" + pengerAlevePa + "</span> å bruke i måneden. Forsøk å sette datoen litt lenger bak"
        } else {
            document.getElementById('warningtext').innerHTML = ""
        }
    } else {
        document.getElementById('averagepayment').innerHTML = "Tidsrommet er ikke gyldig"
        document.getElementById('rentepm').innerHTML = "Tidsrommet er ikke gyldig"
    }
}

function printError() {
    document.getElementById('antaar').innerHTML = "Serveren godkjente ikke forespørselen din. Vennligst prøv på ny!"
}

$(document).ready(function() {
    let notpressed = true
        $('.daterange').on('change', function() {
            let daterange = document.getElementById('daterange').value
            let dato = document.getElementById('date').value
            destroyChart()
            postTilStacc()
        });
    $('.staccskjema').on('submit', function() {
        destroyChart()
        rangeSaveToHidden();
        postTilStacc()
        notpressed = false;
        document.getElementById('faktaboks-container').style.display = 'inline'
        document.getElementById('faktaboks-right').style.display = 'inline-block'
        document.getElementById('range-span').classList.add('smoother')
        document.getElementById('row-hidden').style.display = "inline"
      return false;
    });
});

function rangeSaveToHidden() {
    document.getElementById('dateForRange').value = document.getElementById('date').value
}

function clearHidden() {
    document.getElementById('dateForRange').value = ""
}
let ikkeslidet = true

function dateRangeNearest(daterangevalue, dato) {
    let savedDate = new Date(dato)
    savedDate.setYear(savedDate.getFullYear() + (daterangevalue - 0))
    let datestring = formatDate(savedDate)
    console.log(daterangevalue)
    if (daterangevalue !== "0" || !ikkeslidet) {
        document.getElementById('rangetext').innerHTML = "Nedbetalt i: " + savedDate.getFullYear()
    } else {
        document.getElementById('rangetext').innerHTML = "Dra slideren for å gå opp eller ned noen år"
        ikkeslidet = false;
        console.log(ikkeslidet)
    }
    return datestring
}

function postTilStacc() {
    let belop = document.getElementById('belop').value
    let rangevalue = document.getElementById('daterange').value
    let dato = document.getElementById('date').value
    let hiddenDate = document.getElementById('dateForRange').value
    dato = dateRangeNearest(rangevalue, hiddenDate)
    $('.innbetalingsdato').datepicker("setDate", dato);
    let utbetalingsdato = document.getElementById('utbetalingdate').value
    let forstebetaling = document.getElementById('forstebetalingdate').value
    /*
      Disse kunne blitt brukt, men dersom denne kalkulatoren skulle være for f.eks DNB ville det være to ting som blir satt av banken selv.
      Dersom det er en kalkulator som er uavhengig av banker for å kunne sammenligne, er det bare å un-commente så vil de bli sendt med.

      let nominell = document.getElementById('nominellRente').value
      let termin = document.getElementById('terminGebyr').value
      */
    let nominell = 3
    let termin = 30
    let belopint = belop - 0
    let payload = {
        "laanebelop": belopint,
        "nominellRente": nominell, //nominell
        "terminGebyr": termin, //termin
        "utlopsDato": dato,
        "saldoDato": utbetalingsdato,
        "datoForsteInnbetaling": forstebetaling,
        "ukjentVerdi": "TERMINBELOP"
    }
    $.ajax({
        type: 'post',
        url: 'https://visningsrom.stacc.com/dd_server_laaneberegning/rest/laaneberegning/v1/nedbetalingsplan',
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(data) {
            plotGraf(data.nedbetalingsplan.innbetalinger)
        },
        error: function(data) {
            printError()
        }
    });
}

//Gamle graf-printer
/*
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
      dataPointsB.push({
        x: field[i].time,
        y: field[i].yyy
      });
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
      }, {
        type: "line",
        name: "line2",
        dataPoints: dataPointsB
      },  ]
    });

    chart.render();
    document.title = "Kodeoppgave"
}
*/
