$(document).ready(function(){
    $('.tabs').tabs();
    $('select').formSelect();
    $("#loadInit").click(function(){
        var initId = $("#selectedInit").val();
        if(initId) {
            $.ajax({
                method: 'GET',
                url: '/api/getInit',
                data: {
                    id: initId
                },
                success: function(data) {
                    console.log(data);
                    loadServerVals(data);
                },
                error: (error) => {
                    console.log(error);
                }
            });
        } else {
            alert('Please select and initiative');
        }
    })

    function loadPointDistributionChart(obj){
        let points = ['governanceScore', 'transparencyScore', 'robustnessScore', 'capacityScore']
        let allAvailable = true;
        points.forEach((el) => {
            if(!obj[el]){
                allAvailable = false
            }
        })

        if(allAvailable){
            let data = [
                {
                    values: points.map((el) => obj[el]),
                    labels: points.map((el) => _.startCase(el)),
                    type: 'pie'
                }
            ];
            let options = {
                title: 'Initiative Score Distribution',
                height: 400,
                width: 500
            };

            console.log(data);

            Plotly.newPlot('loadPointDistributionChart', data, options, {responsive: true});


        }
    }


    function updateDOMVal(selector, value){
        if(typeof value == "boolean"){
            $(selector).prop('checked', value);
        } else if(typeof value !== "undefined"){
            $(selector).val(value);
            M.updateTextFields();
        }
    }

    function loadServerVals(obj){
        let selectors = ['#name', '#lang1', '#lang2', '#imageUrl', '#labor', '#env', '#governanceScore', '#transparencyScore', '#robustnessScore', '#capacityScore', '#overallScore'];
        selectors.forEach((el) => updateDOMVal(el, obj[el.replace("#", '')]));
        loadPointDistributionChart(obj);
    }

    $("#updateInitiativeBtn").click(function(){
        $(this).prop('disabled',true);
        let selectors = ['#name', '#lang1', '#lang2', '#imageUrl', '#labor', '#env', '#governanceScore', '#transparencyScore', '#robustnessScore', '#capacityScore', '#overallScore'];
        let payload = new Object();
        selectors.forEach((el) => {
            let key = el.replace("#", '');
            if(key == "env" || key == "labor"){
                payload[key] = $(el).prop('checked');
            } else if(/score/i.test(key)){
                let score = parseFloat($(el).val());
                payload[key] = isNaN(score) ? null : score
            } 
            else {
                payload[key] = $(el).val();
            }
        })
        console.log(payload);

        $.ajax({
            method: 'POST',
            url: '/api/updateInit',
            data: JSON.stringify({
                id: $("#selectedInit").val(),
                newValues: payload,
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data){
                console.log(data);
                alert('Update Success');
                $("#updateInitiativeBtn").prop('disabled',false);
            },
            error: function(error){
                console.log(error);
                alert('Update Fail, Please Contact Admin')
                $("#updateInitiativeBtn").prop('disabled',false);
            }
        })

    })
});