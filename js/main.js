// Prepare random data
console.log(cases)
data = []
max_cases = 0
total_cases = 0
total_deaths = 0
$.each(leitos,function(m,n){
    conf = 0
    deaths = 0
    $.each(cases,function(i,j){
        if (j.city_ibge_code==n.Cod){
        conf = parseInt(j.confirmed)
        deaths = parseInt(j.deaths)
        total_cases = total_cases+parseInt(j.confirmed)
        total_deaths = total_deaths+parseInt(j.deaths)
        console.log(total_cases)
        $("#total_cases").text(total_cases)
        $("#total_deaths").text(total_deaths)
        if (parseInt(j.confirmed)>max_cases){
            max_cases=parseInt(j.confirmed)
        }}
    })
    data.push([n.Cod,conf,deaths,n.Qtd_existente])
        
})
console.log(SPdata)
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
            data: data,
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
