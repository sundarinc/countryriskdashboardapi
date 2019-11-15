$('select').formSelect();
$('[data-chart]').hide(); // Hide all data charts

function loadHdiChart(hdiData, name){
    let chartDiv = $('[data-chart="hdiChart"]');
    chartDiv.find('.rank').text(`${name} HDI Rank ${hdiData.rank}`);

    let trace = {
        x: Object.keys(hdiData.yearly),
        y: Object.values(hdiData.yearly),
        mode: 'lines',
        type: 'scatter',
        name: 'HDI Index'
    }

    let layout =  {
        title: name + ' HDI Index'
    };
    let data = [trace];
    Plotly.newPlot('hdiChart', data, layout, {response:true});
    chartDiv.show();
}

function genderInequality(genderInequality, name, hdiData){
    console.log('Loading Gender Chart');
    let chartDiv = $('[data-chart="genderInequalityChart"]');
    let trace = {
        x: Object.keys(genderInequality.yearly),
        y: Object.values(genderInequality.yearly),
        mode: 'markers+text',
        type: 'scatter',
        name: 'Gender Inequality Index',
        marker: {color: '#e74c3c', size: 8}
    }
    if(hdiData){
        let trace2 = {
            x: Object.keys(hdiData.yearly),
            y: Object.values(hdiData.yearly),
            mode: 'lines',
            type: 'scatter',
            name: 'HDI Index',
            line: {color: '#2c3e50'}
        }
        let layout =  {
            title: name + 'Gender Inequality'
        };
        let data = [trace, trace2];
        Plotly.newPlot('genderInequalityChart', data, layout, {response:true});
    } else {
        let layout =  {
            title: name + 'Gender Inequality'
        };
        let data = [trace];
        Plotly.newPlot('genderInequalityChart', data, layout, {response:true});
    }
    chartDiv.show();
}

$("#submitCountry").click(function(e){
    e.preventDefault();
    console.log($('#countryName').val());
    $.ajax({
        method: 'get',
        url: '/api/getCountryInfo',
        data: {
            id: $('#countryName').val()
        },
        success: (data) => {
            console.log(data);
            if(data.hdi){
                loadHdiChart(data.hdi, data.countryName);
            }
            if(data.genderInequality){
                if(data.hdi){
                    genderInequality(data.genderInequality, data.countryName, data.hdi);
                }
            }
        },
        error: (error) => {
            console.log(error);
        }
    })
    
});