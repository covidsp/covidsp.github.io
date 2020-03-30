// Prepare random data

cases_all = cases
$("#date_at").text(date_at)

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
date_ = dd + '-' + mm + '-' + yyyy;

Highcharts.chart('container_avanco', {
    chart:{
        borderColor: '#021254',
        borderRadius: 40,
        borderWidth: 3,
        type: 'line'
    },
    exporting: { enabled: false },
    title: {
        text: 'Casos - Estado SP'
    },
    yAxis: {
        title: {
            text: 'Quantidade de casos'
        }
    },
    
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats:{ 
            day: "%e-%b-%y",
            month: "%b-%y"
        }
    },
    legend: {
        enabled:false
    },
    series: [{
        name: 'Casos',
        data: av_sp
    }]

});

function getData(cases_n){
    cases_data = []
    ids = {}
    max_cases = 0
    total_cases = 0
    total_deaths = 0
    $.each(leitos,function(m,n){
        conf = 0
        deaths = 0
        $.each(cases_n,function(i,j){
            if (j.city_ibge_code==n.Cod){
            conf = parseInt(j.confirmed)
            deaths = parseInt(j.deaths)
            total_cases = total_cases+parseInt(j.confirmed)
            total_deaths = total_deaths+parseInt(j.deaths)
            $("#total_cases").text(total_cases)
            $("#total_deaths").text(total_deaths)
            if (parseInt(j.confirmed)>max_cases){
                max_cases=parseInt(j.confirmed)
            }}
        })
        cases_data.push([n.Cod,conf,deaths,n.Qtd_existente])
        ids[n.Cod] = conf
            
    })
    $.each(cases_n,function(i,j){
        if (!(j.city_ibge_code in ids)){
        console.log(j)
        conf = parseInt(j.confirmed)
        deaths = parseInt(j.deaths)
        total_cases = total_cases+parseInt(j.confirmed)
        total_deaths = total_deaths+parseInt(j.deaths)
        $("#total_cases").text(total_cases)
        $("#total_deaths").text(total_deaths)
        if (parseInt(j.confirmed)>max_cases){
            max_cases=parseInt(j.confirmed)
        }
        cases_data.push([j.city_ibge_code,conf,deaths,0])
        ids[j.city_ibge_code] = conf
    
    }
    })
    return cases_data
}
function update(date){
    cases = cases_all[date]
    cases_data = getData(cases)
    
    Highcharts.mapChart('container', {
            chart: {
                map: SPdata,
                backgroundColor: '#4b96af'
            },
            exporting: { enabled: false },
            title: {
                text: 'COVID-19 - Sao Paulo - Brasil'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 1,
                max: 30,      
                startOnTick: true, 
                minColor: '#ffe714',
                maxColor: '#f61111',
                stops: [
                    [0, '#f7f7f7'],
                    [0.01, '#fffbbc'],
                    [0.9, '#c4463a']
                ]
            },

            series: [{
                data: cases_data,
                keys: ['Brasil_m_2', 'value','death','leitos'],
                joinBy: 'Brasil_m_2',
                name: 'Cases',
                states: {
                    hover: {
                        color: 'red'
                    }
                },
                tooltip:{
                    headerFormat: '<span style="font-size:10px">{point.properties.Brasil_mun}</span><br/>',
                    pointFormat: '<b>{point.properties.Brasil_mun}<b><br/>Casos Comprovados: <b>{point.value:.0f}</b><br/>Obitos: <b>{point.death:.0f}</b><br/>Leitos: <b>{point.leitos:.0f}</b><br/>',
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.properties.Brasil_mun}'
                }
            }]
        });
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
date_ = dd + '-' + mm + '-' + yyyy;
i=0
while (cases_all[date_]==null) {
  i = i+1
  today = new Date(today)
  today.setDate(today.getDate() - i)
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2,   '0'); //January is 0!
  var yyyy = today.getFullYear();
  date_ = dd + '-' + mm + '-' + yyyy;
}
$("#date_now").text(date_)
update(date_)

$("#left_arrow").click(function(){
    var date_new = new Date(today.getTime());
    date_new.setDate(date_new.getDate() - 1)
    var dd = String(date_new.getDate()).padStart(2, '0');
    var mm = String(date_new.getMonth() + 1).padStart(2,   '0'); //January is 0!
    var yyyy = date_new.getFullYear();
    date_ = dd + '-' + mm + '-' + yyyy;
    if (cases_all[date_]==null){
        console.log(date_)
        alert ('Não há mais dados!')
    } else {
        today = new Date(date_new.getTime())
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2,   '0'); //January is 0!
        var yyyy = today.getFullYear();
        date_ = dd + '-' + mm + '-' + yyyy;
        cases = cases_all[date_]
        cases_data = getData(cases)
        console.log(date_)   
        $("#date_now").text(date_)
        $("#container").highcharts().series[0].update({
            data: cases_data
          });
    }
    }
)
$("#right_arrow").click(function(){
    var date_new = new Date(today.getTime());
    date_new.setDate(date_new.getDate() + 1)
    var dd = String(date_new.getDate()).padStart(2, '0');
    var mm = String(date_new.getMonth() + 1).padStart(2,   '0'); //January is 0!
    var yyyy = date_new.getFullYear();
    date_ = dd + '-' + mm + '-' + yyyy;
    console.log(today)
    if (cases_all[date_]==null){
        console.log(date_)
        alert ('Não há mais dados!')
    } else {
        today = new Date(date_new.getTime())
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2,   '0'); //January is 0!
        var yyyy = today.getFullYear();
        date_ = dd + '-' + mm + '-' + yyyy;
        cases = cases_all[date_]
        cases_data = getData(cases)
        console.log(date_)   
        $("#date_now").text(date_)
        $("#container").highcharts().series[0].update({
            data: cases_data
          });
    }
    }
)