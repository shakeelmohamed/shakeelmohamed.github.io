module.exports = {
    eleventyComputed: {
        // Reformat the date in ISO format
        date: data => formatDate(data.date),
        categories: data => data.tags.filter((val) => {
            return val.toLowerCase() != "post";
        }).join(", ")
    }
};

// TODO: the date returned may be off by 1 day due to UTC Offset
// see also: https://www.11ty.dev/docs/dates/
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// TODO: if date is missing, try to parse it from the folder name?