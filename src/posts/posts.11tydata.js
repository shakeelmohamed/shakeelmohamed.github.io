module.exports = {
    eleventyComputed: {
        pageTitle: data => data.title + " by Shakeel Mohamed",
        // Reformat the date in ISO format
        date: data => formatDate(data.page.date),
        categories: data => data.tags.filter((val) => {
            return !(val.toLowerCase() == "post" || val.toLowerCase() == "featured");
        }).join(", ")
    }
};

// The date returned may be off by 1 day due to UTC Offset
// This split on T is probably not ideal, but good enough for now
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

// TODO: if date is missing, try to parse it from the folder name?