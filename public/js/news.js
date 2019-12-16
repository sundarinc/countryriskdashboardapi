$('select').formSelect();


function loadTableNews(news){
    let appendString = ``;
    for(var n in  news){
        appendString+= `
        <tr>
            <td>${news[n].date}</td>
            <td>${news[n].host}</td>
            <td>
                <a href="${news[n].link}" target="_blank">${news[n].headline}</a>
            </td>
            <td>
                <label>
                    <input type="checkbox" data-selector id=${news[n].id}/>
                    <span></span>
                </label>
            </td>
        </tr>`
    }
    // console.log(appendString);
    $('#newsContent').append(appendString);
}

$("#countryNews").change(function(){
    $('#newsContent').empty();
    var country = $(this).val();
    country = country.replace(" ","%20");
    $(this).attr('disabled', true);
    $.ajax({
        method: 'GET',
        url: '/api/news',
    data: {
        country: country
        },
        success: function(data) {
            console.log(data);
            loadTableNews(data);
        },
        error: (error) => {
            console.log(error);
        }
    });
})